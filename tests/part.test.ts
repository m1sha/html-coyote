import { Part } from "../src/part"

const part = new Part("test", `
<!--#
.name
.href
@content
-->

<template if="__pageName === name">
    <li>{{content}}</li>
</template>
<template else>
    <li><a href="{{href}}">{{content}}</a></li>
</template>
`)

part.init()

test("attrs must be 3", () => {
    const attrs = part.attrs
    expect(attrs.length).toBe(3)
})

test("if statement", () => {
    const templates = part.getTemplates({__pageName: "index", name: "index"})
    expect(templates.length).toBe(1)
    expect(templates[0]).toContain("<li>{{content}}</li>")
})

test("else statement", () => {
    const templates = part.getTemplates({__pageName: "index", name: "jndex"})
    expect(templates.length).toBe(1)
    expect(templates[0]).toContain(`<li><a href="{{href}}">{{content}}</a></li>`)
})