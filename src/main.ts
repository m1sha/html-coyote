import chalk from 'chalk'
import { Site } from "./site"

const site = new Site("../site")
const layouts = site.layouts
const pages = site.pages
const parts = site.parts

console.log(chalk.whiteBright(`Start site assembly\n`))    
for (const page of pages) {
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
    console.log(chalk.greenBright(`page: ${page.name}`))    
}
console.log(chalk.greenBright(`\nAssembly complited`))    

