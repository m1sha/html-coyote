import _ from './cli'
import __ from './strings'
import { Site } from "./site"
import { TemplateResolver } from './template-resolver'
import DevServer from './dev-server'
import { Layout } from './layout'
import { Page } from './page'

const site = new Site("../site")
const layouts = site.layouts
const pages = site.pages
const parts = site.parts
const content = site.content
const resolver = new TemplateResolver()

if (process.env.watch){
  const server = new DevServer()
  server.start()
} else {
  _.info(__.StartSiteAssembly)
  publishPages()
  publishAssets()
  _.info(__.EndSiteAssembly)
}


function publishPages(): void{
  _.info(__.PublishPages)
  for (const page of pages) {
    content.add(__.PageName, page.name)
    try {
      page.attach()
      const layout = layouts.getLayout(page.layoutName)

      const mds = content.documents.find(page.name)
      let publishFileName = page.name
      if (!mds.length){
        publishPage(layout, page, publishFileName)
      }
      else for (let i = 0; i< mds.length; i++){
        const md = mds[i]
        md.open()
        content.add(__.Markdown, md)
        publishFileName = md.name
        publishPage(layout, page, publishFileName)
      }
      
    } catch(e){
      _.err(__.page(page.name, e.message))
    }
  }
}

function publishPage(layout: Layout, page: Page, publishFileName: string): void{
  const html = resolver.resolve(layout, page, parts, content)
  site.publishPage(publishFileName, html)
  _.succ(__.page(publishFileName))
}

function publishAssets(): void{
  _.info(__.Assets)
  site.publishAssets((src, dist, err)=>{
    if (err){
      _.err(`${err}. ${src}`)
      return
    }
    _.succ(`${dist}`)
  
  })
}