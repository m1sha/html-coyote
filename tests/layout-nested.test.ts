import { 
    createLayout, 
    createPage, 
    createResolver, 
    createContent, 
    createFile,
    createParts} from "./helpers"
import strings from "../src/strings"

test("layout-nested. slot in part", ()=> {
    const layoutTemplate = `<html><body>
    <nav>
    <ul>
        <template loop="item of items">
            <menu-item href="{{item.href}}">
                {{item.name}}
            </menu-item>
        </template>
    </ul>
    </nav>
    <section>
        <slot name="content"></slot>
    </section>
    </body></html>`

    const pageTemplate = `
    <template slot="submenu">
        <ul>
            <li>Subitem 1</li>
        </ul>
    </template>
    <template slot="content">
        <p>The content from page</p>
    </template>
    `

    const partTemplate = `
    <!--#
    .href
    @content
    -->
    <template>
        <li>
            <a href="{{href}}">{{content}}</a>
            <slot name="submenu"></slot>
        </li>
    </template>
    `

    
    const layout = createLayout("layout", layoutTemplate)
    const page = createPage("index", pageTemplate)
    const parts = createParts([createFile("menu-item", partTemplate)])
    const content = createContent()
    content.add(strings.PageName, "index")
    content.add("items", [{name: "Item 1", href: "index.html"}, {name: "Item 2", href: "index2.html"}])
    const resolver = createResolver(layout, page, parts, content)
    const html = resolver.resolve()
    expect(html).toContain("Item 1")
    expect(html).toContain("The content from page")
    expect(html).toContain("Subitem 1")
})

test("expression in title tag", ()=>{
    const layoutTemplate = `<html>
    <head>
        <slot name="header"></slot>
    <head>
    </html>
    `
    const pageTemplate = `
    <template slot="header">
        <title>
            {{title}}
        </title>
    </template>
    `
    
    const layout = createLayout("layout", layoutTemplate)
    const page = createPage("index", pageTemplate)
    const content = createContent()
    content.add("title", "Hello")
    const resolver = createResolver(layout, page, null, content)
    const html = resolver.resolve()
    expect(html).toContain("Hello")
})