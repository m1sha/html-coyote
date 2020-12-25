import cli from './cli'
import { Site } from "./site"

const site = new Site("../site")
const layouts = site.layouts
const pages = site.pages
const parts = site.parts

cli.info(`Start site assembly\n`)
for (const page of pages) {

  try {
    page.init()
    const layout = layouts.getLayout(page.layoutName)
    const html = layout
      .init()
      .data({
        __pageName: page.name
      })
      .applyPage(page)
      .applyParts(parts)
      .build()

      site.publishPage(page.name, html)
      cli.succ(`page: ${page.name}`)

  } catch(e){
    cli.err(`page: ${page.name}. ${e.message}`)
  }
    
}

cli.info(`\ncomplited`)