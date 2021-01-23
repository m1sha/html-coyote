import path from "path"
import {info, succ, fail} from './msg'
import __ from './strings'
import { Site } from "./site"
import { TemplateResolver } from './template-resolver'
import DevServer from './dev-server'
import { Layout, LayoutCollection } from './layout'
import { Page, PageCollection } from './page'
import { Content } from './content'
import { PartCollection } from './part'

export function run(watch: boolean, port: number): void {
  const dir =path.resolve(process.cwd(), "site")
  
  info(`work directory: ${dir}`)
  const site = new Site(dir)
  const layouts = site.layouts
  const pages = site.pages
  const parts = site.parts
  const content = site.content
  const resolver = new TemplateResolver()

  if (watch){
    const server = new DevServer(dir, port)
    server.start()
  } else {
    info(__.StartSiteAssembly)
    publishPages(site, layouts, pages, parts, content, resolver)
    publishAssets(site)
    info(__.EndSiteAssembly)
  }
}

export function createNew(): void{
  const dir = process.cwd()
  Site.export(dir, (src, dist, err)=>{
    if (err){
      fail(`${err}. ${src}`)
      return
    }
    succ(`${dist}`)
  })
}

function publishPages(site: Site,layouts: LayoutCollection, pages: PageCollection, parts: PartCollection, content: Content, resolver: TemplateResolver): void{
  info(__.PublishPages)
  for (const page of pages) {
    content.add(__.PageName, page.name)
    try {
      page.attach()
      const layout = layouts.getLayout(page.layoutName)

      const mds = content.documents.find(page.name)
      let publishFileName = page.name
      if (!mds.length){
        publishPage(site, layout, page, parts, content, resolver, publishFileName)
      }
      else for (let i = 0; i< mds.length; i++){
        const md = mds[i]
        md.open()
        content.add(__.Markdown, md)
        content.add("meta", md.meta.data)
        publishFileName = md.name
        publishPage(site, layout, page, parts, content, resolver, publishFileName)
      }
      
    } catch(e){
      fail(__.page(page.name, e.message))
    }
  }
}

function publishPage(site: Site, layout: Layout, page: Page, parts: PartCollection, content: Content, resolver: TemplateResolver, publishFileName: string): void{
  const html = resolver.resolve(layout, page, parts, content)
  site.publishPage(publishFileName, html)
  succ(__.page(publishFileName))
}

function publishAssets(site: Site): void{
  info(__.Assets)
  site.publishAssets((src, dist, err)=>{
    if (err){
      fail(`${err}. ${src}`)
      return
    }
    succ(`${dist}`)
  })
}
