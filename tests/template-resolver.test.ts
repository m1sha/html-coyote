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