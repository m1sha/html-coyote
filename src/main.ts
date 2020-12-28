import cli from './cli'
import { Site } from "./site"

const site = new Site("../site")
const layouts = site.layouts
const pages = site.pages
const parts = site.parts
const content = site.content


cli.info(`Start site assembly\n`)
for (const page of pages) {

  try {
    page.attach()
    const layout = layouts.getLayout(page.layoutName)
    content.add("_pageName", page.name)
    const html = layout
      .attach()
      .addContent(content)
      .resolveTemplate(parts.items, content.data)
      .applyPage(page)
      .applyParts(parts)
      .build()

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