import { ContentInMemory } from "../src/fs-utils"
import  DomProvider  from "../src/dom-provider"
import { Content } from "../src/content"
import { TemplateResolver } from "../src/template-resolver"
import { MdDocument } from "../src/md-document"
import __ from "../src/strings"
const resolver = new TemplateResolver()

test ("if-else-statement", ()=>{
    const content = createContent()
    const root = createDom(`
        <template if="a === b">
            <p>foo</p>
        </template>
        <template else>
            <p>bar</p>
        </template>
    `)

    content.add("a", 1)
    content.add("b", 1)
    root.attach()
    resolver.resolveTemplate(root, content)
    expect(root.toHtml()).toContain("<p>foo</p>")

    content.add("a", 1)
    content.add("b", 2)
    root.attach()
    resolver.resolveTemplate(root, content)
    expect(root.toHtml()).toContain("<p>bar</p>")
})

test ("if only 'else'", ()=>{
    const content = createContent()
    const root = createDom(`
        <template else>
            <p>bar</p>
        </template>
    `)
    root.attach()
    try{
        content.add("a", 1)
        content.add("b", 1)
        resolver.resolveTemplate(root, content)
        expect(true).toBeFalsy()
    } catch(e){
        expect(e).toBeDefined()
    }
})

test ("loop-statement", ()=>{
    const content = createContent()
    const root = createDom(`
        <template loop="value of values">
            <p>{{value.name}}</p>
        </template>
    `)
    root.attach()
    content.add("values", [ {name: "value 1"}, {name: "value 2"}, {name: "value 3"} ])
    resolver.resolveTemplate(root, content)

    const html = root.toHtml();
    expect(html).toContain("<p>value 1</p>")
    expect(html).toContain("<p>value 2</p>")
    expect(html).toContain("<p>value 3</p>")
})

test("template markdown", ()=>{
    const content = createContent()
    const root = createDom(`<template markdown></template>`)
    const md = new MdDocument(new ContentInMemory("file.md",`# Hello`))
    md.open()
    content.add(__.Markdown, md)
    root.attach()
    const html = resolver.resolve(root, null, null, content)
    expect(html).toContain(`<h1 id="hello">Hello</h1>`)
})

test("template in template", ()=>{
    const content = createContent()
    const root = createDom(`
        <ul>
            <template loop="item of items">
                <li>
                    <template if="current === item.name">
                        <p>{{item.name}}</p>
                    </template>
                    <template else>
                        <span>{{item.name}}</span>
                    </template>
                </li>
            </template>
        </ul>
    `)
    root.attach()
    content.add("items", [ {name: "value 1"}, {name: "value 2"}, {name: "value 3"} ])
    content.add("current", "value 1")
    const html = resolver.resolve(root, null, null, content)
    expect(html).toContain("<p>value 1</p>")
    expect(html).toContain("<span>value 2</span>")
    expect(html).toContain("<span>value 3</span>")
})


function createDom(content: string): DomProvider{
    return new DomProvider(new ContentInMemory("root", content))
}

function createContent(): Content{
    return new Content([])
}