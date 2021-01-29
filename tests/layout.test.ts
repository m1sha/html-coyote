import { 
    createLayout, 
    createPage, 
    createResolver, 
    createContent, 
    createFile,
    createParts} from "./helpers"


const content = createContent([createFile("menu.yml", `
menu:
    - item 1
    - item 2
    - item 3
`)])

test("layout + template content", () => {
    const layout = createLayout("layout", `
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
    const resolver = createResolver(layout, null, null, content)
    const html = resolver.resolve()
    expect(html).toContain("<p>item 1</p>")
    expect(html).toContain("<p>item 2</p>")
    expect(html).toContain("<p>item 3</p>")
})

test("layout + page", () => {
    const layout = createLayout("layout", `
    <html>
    <body>
        <slot name="place-holder"></slot>
    </body>
    </html>
    `)

    const page = createPage("page", `
    <template slot="place-holder">
        <p>Page Content</p>
    </template>
    `)

    const resolver = createResolver(layout, page, null, null)
    const html = resolver.resolve()
    expect(html).toContain("<p>Page Content</p>")
})

test("layout + part", ()=>{
    const layout = createLayout("layout", `
    <html>
    <body>
       <part-component attr="value" />
    </body>
    </html>
    `)

    const part = createFile("part-component", `
    <!--#
    .attr
    -->
    <template>
    <p>{{attr}}</p>
    </template>
    `)

    layout.attach()
    const resolver = createResolver(layout, null, createParts([ part ]), createContent())
    const html = resolver.resolve()
    expect(html).toContain("<p>value</p>")

})

test("layout + content data + part", ()=>{

    const layout = createLayout("layout", `
    <html>
    <body>
       <template loop="item of menu">
         <part-component attr="{{item}}" />
       </template>
    </body>
    </html>
    `)

    const part = createFile("part-component", `
    <!--#
    .attr
    -->
    <template>
    <p>{{attr}}</p>
    </template>
    `)
    const resolver = createResolver(layout, null, createParts([ part ]), content)
    const html = resolver.resolve()
    expect(html).toContain("<p>item 1</p>")
    expect(html).toContain("<p>item 2</p>")
    expect(html).toContain("<p>item 3</p>")
})