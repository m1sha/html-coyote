import { ContentInMemory } from "../src/fs-utils"
import  DomProvider  from "../src/dom-provider"

test ("template-resolver", ()=>{
    const root = new DomProvider(new ContentInMemory("root", `
<template if="a===b">
 <p>foo</p>
</template>
<template else>
 <p>bar</p>
</template>
    `))

    root.attach()
    root.resolveTemplate([], {a: 1, b: 1})
    expect(root.toHtml()).toContain("<p>foo</p>")

    root.attach()
    root.resolveTemplate([], {a: 1, b: 2})
    expect(root.toHtml()).toContain("<p>bar</p>")
})

test ("template-resolver only 'else'", ()=>{
    const root = new DomProvider(new ContentInMemory("root", `
<template else>
 <p>bar</p>
</template>
    `))

    root.attach()
    try{
        root.resolveTemplate([], {a: 1, b: 1})
        expect(true).toBe(false)
    } catch(e){
        expect(e).toBeDefined()
    }
})

test ("template-resolver only 'else'", ()=>{

    const root = new DomProvider(new ContentInMemory("root", `
<template loop="item of items">
<p>{{item.name}}</p>
</template>
    `))

    root.attach()
    root.resolveTemplate([], {items: [ {name: "value 1"}, {name: "value 2"}, {name: "value 3"} ]})

    const html = root.toHtml();
    expect(html).toContain("<p>value 1</p>")
    expect(html).toContain("<p>value 2</p>")
    expect(html).toContain("<p>value 3</p>")
})