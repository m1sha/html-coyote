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
  

  if (watch){
    const server = new DevServer(dir, port)
    server.start()
  } else {
    info(__.StartSiteAssembly)
    publishPages(site, layouts, pages, parts, content)
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

function publishPages(site: Site,layouts: LayoutCollection, pages: PageCollection, parts: PartCollection, content: Content): void{
  info(__.PublishPages)
  for (const page of pages) {
    content.add(__.PageName, page.name)
    try {
      page.attach()
      const layout = layouts.getLayout(page.layoutName)

      const mds = content.documents.find(page.name)
      let publishFileName = page.name
      if (!mds.length){
        publishPage(site, layout, page, parts, content, publishFileName)
      }
      else for (let i = 0; i< mds.length; i++){
        const md = mds[i]
        md.open()
        content.add(__.Markdown, md)
        content.add("meta", md.meta.data)
        publishFileName = md.name
        publishPage(site, layout, page, parts, content, publishFileName)
      }
      
    } catch(e){
      fail("Error: " + e.message)
    }
  }
}

function publishPage(site: Site, layout: Layout, page: Page, parts: PartCollection, content: Content,  publishFileName: string): void{
  info(__.page(publishFileName))
  const resolver = new TemplateResolver(layout, page, parts, content)
  const html = resolver.resolve()
  site.publishPage(publishFileName, html)
  succ("[ ok ]")
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
