import { 
    createLayout, 
    createResolver, 
    createContent, 
    createFile,
    createParts } from "./helpers"

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

    const resolver = createResolver(layout, null, parts, createContent())
    const html = resolver.resolve()
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
    const resolver = createResolver(layout, null, parts, content)
    const html = resolver.resolve()
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

    const resolver = createResolver(layout, null, parts, content)
    const html = resolver.resolve()
    expect(html).toContain("<li>item 1</li>")
})


test("parts with objects as parameters", ()=>{
    const layout = createLayout("layout", `
    <html>
        <body>
            <main-menu :items="menu" />
        </body>
    </html>
    `)
    const menu = createFile("main-menu", `
    <!--#.items-->
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
    <!--#.item-->
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
    const parts = createParts([menu, menuItem])
    const content = createContent([createFile("settings.yml", `
menu: 
    - { name: "index", url: "index.html", title: "Home" }
    - { name: "about", url: "about.html", title: "About" }
    `)])
    content.add("__pageName", "index")
    const resolver = createResolver(layout, null, parts, content)
    const html = resolver.resolve()
    //expect(html).toContain("<span>Home</span>") // <-- problem 
    expect(html).toContain(`<a href="about.html">About</a>`)
})

test("parts with strings as parameters", ()=>{
    const layout = createLayout("layout", `
    <html>
        <body>
            <main-menu :items="menu" />
        </body>
    </html>
    `)
    const menu = createFile("main-menu", `
    <!--#.items-->
    <template>
        <nav>
            <ul>
                <template loop="item of items">
                    <main-menu-item name="{{item.name}}" url="{{item.url}}" title="{{item.title}}" />
                </template>
            </ul>
        </nav>
    </template>
    `)
    const menuItem = createFile("main-menu-item", `
    <!--#
    .name
    .url
    .title
    -->
    <template>
        <li>
            <template if="__pageName == name">
                <span>{{title}}</span>
            </template>
            <template else>
                <a href="{{url}}">{{title}}</a>
            </template>
        </li>
    </template>
    `)
    const parts = createParts([menu, menuItem])
    const content = createContent([createFile("settings.yml", `
menu: 
    - { name: "index", url: "index.html", title: "Home" }
    - { name: "about", url: "about.html", title: "About" }
    `)])
    content.add("__pageName", "index")
    const resolver = createResolver(layout, null, parts, content)
    const html = resolver.resolve()
    expect(html).toContain("<span>Home</span>")
    expect(html).toContain(`<a href="about.html">About</a>`)
})
