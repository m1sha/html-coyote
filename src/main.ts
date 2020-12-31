import cli from './cli'
import { Site } from "./site"
import { TemplateResolver } from './template-resolver'

const site = new Site("../site")
const layouts = site.layouts
const pages = site.pages
const parts = site.parts
const content = site.content
const resolver = new TemplateResolver()

cli.info(`Start site assembly\n`)
for (const page of pages) {
  content.add("_pageName", page.name)
  try {
    page.attach()
    const layout = layouts.getLayout(page.layoutName)
    const html = resolver.resolve(layout, page, parts, content)
    
    site.publishPage(page.name, html)
    cli.succ(`page: ${page.name}`)
  } catch(e){
    cli.err(`page: ${page.name}. ${e.message}`)
  }
    
}

cli.info(`\nAssets`)
site.publishAssets((src, dist, err)=>{
  if (err){
    cli.err(`${err}. ${src}`)
    return
  }
  cli.succ(`${dist}`)

})
cli.info(`\ncomplited`)