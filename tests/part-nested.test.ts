import { Layout } from "../src/layout"
import { ContentInMemory } from "../src/fs-utils"
import { PartCollection } from "../src/part"
import { TemplateResolver } from "../src/template-resolver"
import { Content } from "../src/content"

test("part-nested", () => {
    const layoutTemplate = `
    <html>
        <body>
            <outer-part>
            </outer-part>
        </body>
    </html>
    `
    const outerPart = `
    <template>
        <inner-part>Sent from outer</inner-part>
    </template>
    `
    const innerPart = `
    <!--#@content-->
    <template>
        <p>{{content}}</p>
        <p>Message from inner part</p>
    </template>
    `
    const layout = new Layout(new ContentInMemory("layout", layoutTemplate))
    const parts = new PartCollection([
        new ContentInMemory("inner-part", innerPart),
        new ContentInMemory("outer-part", outerPart)
    ])

    const resolver = new TemplateResolver()
    const html = resolver.resolve(layout, null, parts, new Content([]))
    expect(html).toContain("Message from inner part")
    expect(html).toContain("Sent from outer")
})

test("part-nested+content", ()=>{
    const layoutTemplate = `
    <html>
        <body>
            <outer-part></outer-part>
        </body>
    </html>
    `
    const outerPart = `
    <template>
        <inner-part :items="values"></inner-part>
    </template>
    `
    const innerPart = `
    <!--#.items-->
    <template loop="item of items">
        <p>{{item.name}}</p>
    </template>
    `

    const content = new Content([])
    content.add("values", [{name:"item 1"}, {name:"item 2"}, {name:"item 3"}])
    const layout = new Layout(new ContentInMemory("layout", layoutTemplate))
    const parts = new PartCollection([
        new ContentInMemory("outer-part", outerPart),
        new ContentInMemory("inner-part", innerPart)
    ])
    const resolver = new TemplateResolver()
    const html = resolver.resolve(layout, null, parts, content)
    expect(html).toContain("<p>item 1</p>")
    expect(html).toContain("<p>item 2</p>")
    expect(html).toContain("<p>item 3</p>")
})