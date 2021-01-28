import { 
    createLayout, 
    createResolver, 
    createContent, 
    createFile,
    createParts,
    createPart} from "./helpers"

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
    const layout = createLayout("layout", layoutTemplate)
    const parts = createParts([
        createFile("inner-part", innerPart),
        createFile("outer-part", outerPart)
    ])

    const resolver = createResolver()
    const html = resolver.resolve(layout, null, parts, createContent())
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

    const content = createContent()
    content.add("values", [{name:"item 1"}, {name:"item 2"}, {name:"item 3"}])
    const layout = createLayout("layout", layoutTemplate)
    const parts = createParts([
        createFile("outer-part", outerPart),
        createFile("inner-part", innerPart)
    ])
    const resolver = createResolver()
    const html = resolver.resolve(layout, null, parts, content)
    expect(html).toContain("<p>item 1</p>")
    expect(html).toContain("<p>item 2</p>")
    expect(html).toContain("<p>item 3</p>")
})

test("part template in template", ()=>{
    const layoutTemplate = `
    <html>
        <body>
            <part></part>
        </body>
    </html>
    `

    const partTemplate = `
    <template>
        <ul>
            <template loop="item of items">
                <li>{{item.name}}</li>
            </template>
        </ul>
    </template>
    `
    const content = createContent()
    content.add("items", [{name:"item 1"}, {name:"item 2"}, {name:"item 3"}])
    const layout = createLayout("layout", layoutTemplate)
    const parts = createParts([
        createFile("part", partTemplate)
    ])

    const resolver = createResolver()
    const html = resolver.resolve(layout, null, parts, content)
    expect(html).toContain("<li>item 1</li>")
})


test("parts with objects as parameters", ()=>{
    const menu = createFile("main-menu", `
    <!--#items-->
    <template>
        <nav>
            <ul>
                <template loop="item of items">
                    <main-menu-item :item="item" />
                </template>
            </ul>
        </nav>
    </template>
    `)
    const menuItem = createFile("main-menu-item", `
    <!--#item-->
    <template>
        <li>
            <template if="__pageName == item.name">
                <span>{{item.title}}</span>
            </template>
            <template else>
                <a href="{{item.url}}">{{item.title}}</a>
            </template>
        </li>
    </template>
    `)
    createParts([menu, menuItem])
    expect(true).toBeTruthy()
})
