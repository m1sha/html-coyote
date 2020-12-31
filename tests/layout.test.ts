import { Page } from "../src/page"
import { Content } from "../src/content"
import { ContentInMemory, IContentFile } from "../src/fs-utils"
import { Layout } from "../src/layout"
import { Part, PartCollection } from "../src/part"
import { TemplateResolver } from "../src/template-resolver"
const resolver = new TemplateResolver()
const content = new Content([new ContentInMemory("menu.yml", `
menu:
    - item 1
    - item 2
    - item 3
`)])

test("layout + template content", ()=>{
    const layout = createLayout(`
    <html>
    <body>
        <nav>
            <ul>
            <template loop="item of menu">
            <p>{{item}}</p>
            </template>
            </ul>
        </nav>
    </body>
    </html>
    `) 
    
    const html = resolver.resolve(layout, null, null, content)
    expect(html).toContain("<p>item 1</p>")
    expect(html).toContain("<p>item 2</p>")
    expect(html).toContain("<p>item 3</p>")
})

test("layout + page", () => {
    const layout = createLayout(`
    <html>
    <body>
        <slot name="place-holder"></slot>
    </body>
    </html>
    `)

    const page = createPage(`
    <template slot="place-holder">
        <p>Page Content</p>
    </template>
    `)

    
    const html = resolver.resolve(layout, page, null, null)
    expect(html).toContain("<p>Page Content</p>")
})

test("layout + part", ()=>{
    const layout = createLayout(`
    <html>
    <body>
       <part-component attr="value" />
    </body>
    </html>
    `)

    const part = createFile(`
    <!--#
    .attr
    -->
    <template>
    <p>{{attr}}</p>
    </template>
    `)

    layout.attach()
    const html = resolver.resolve(layout, null, createParts([ part ]), new Content([]))
    expect(html).toContain("<p>value</p>")

})

test("layout + content data + part", ()=>{

    const layout = createLayout(`
    <html>
    <body>
       <template loop="item of menu">
         <part-component attr="{{item}}" />
       </template>
    </body>
    </html>
    `)

    const part = createFile(`
    <!--#
    .attr
    -->
    <template>
    <p>{{attr}}</p>
    </template>
    `)
   
    const html = resolver.resolve(layout, null, createParts([ part ]), content)
    expect(html).toContain("<p>item 1</p>")
    expect(html).toContain("<p>item 2</p>")
    expect(html).toContain("<p>item 3</p>")
})

function createLayout(content: string): Layout {
    return new Layout(new ContentInMemory("layout", content))
}

function createPage(content: string): Page{
    return new Page(new ContentInMemory("page", content))
}

function createFile(content: string): IContentFile{
    return new ContentInMemory("part-component", content)
}

function createParts(parts: IContentFile[]){
    return new PartCollection(parts)
}