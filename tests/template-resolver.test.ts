import {createLayout, createContent, createMd, createResolver} from "./helpers"
import __ from "../src/strings"

test ("if-else-statement", ()=>{
    const content = createContent()
    const root = createLayout("layout.html", `
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
    let resolver = createResolver(root, null, null, content)
    resolver.resolve()
    expect(root.toHtml()).toContain("<p>foo</p>")

    content.add("a", 1)
    content.add("b", 2)
    root.attach()
    resolver = createResolver(root, null, null, content)
    resolver.resolve()
    expect(root.toHtml()).toContain("<p>bar</p>")
})

test ("if only 'else'", ()=>{
    const content = createContent()
    const root = createLayout("layout.html", `
        <template else>
            <p>bar</p>
        </template>
    `)
    root.attach()
    try{
        content.add("a", 1)
        content.add("b", 1)
        const resolver = createResolver(root, null, null, content)
        resolver.resolve()
        expect(true).toBeFalsy()
    } catch(e){
        expect(e).toBeDefined()
    }
})

test ("loop-statement", ()=>{
    const content = createContent()
    const root = createLayout("layout.html", `
        <template loop="value of values">
            <p>{{value.name}}</p>
        </template>
    `)
    root.attach()
    content.add("values", [ {name: "value 1"}, {name: "value 2"}, {name: "value 3"} ])
    const resolver = createResolver(root, null, null, content)
    resolver.resolve()
    const html = root.toHtml()
    expect(html).toContain("<p>value 1</p>")
    expect(html).toContain("<p>value 2</p>")
    expect(html).toContain("<p>value 3</p>")
})

test("template markdown", ()=>{
    const content = createContent()
    const root = createLayout("layout.html", `<template markdown></template>`)
    const md = createMd("file.md",`# Hello`)
    md.open()
    content.add(__.Markdown, md)
    root.attach()
    const resolver = createResolver(root, null, null, content)
    const html = resolver.resolve()
    expect(html).toContain(`<h1 id="hello">Hello</h1>`)
})

test("template in template", ()=>{
    const content = createContent()
    const root = createLayout("layout.html", `
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
    const resolver = createResolver(root, null, null, content)
    const html = resolver.resolve()
    expect(html).toContain("<p>value 1</p>")
    expect(html).toContain("<span>value 2</span>")
    expect(html).toContain("<span>value 3</span>")
})

test("double loop in template", ()=>{
    const content = createContent()
    const root = createLayout("layout.html",`
        <ul>
            <template loop="item of items">
                <li>
                    <p>{{item.name}}</p>
                    <template if="item.subItems">
                        <ul>
                            <template loop="sub of item.subItems">
                                <li>{{sub}}</li>
                            </template>    
                        </ul>
                    </template>
                </li>
            </template>
        </ul>
    `)
    root.attach()
    content.add("items", [ 
    {
        name: "value 1",
        subItems: ["subItem 1", "subItem 2", "subItem 3"]
    }, 
    {
        name: "value 2"
    }, 
    {
        name: "value 3"
    } 
    ])
    content.add("current", "value 1")
    const resolver = createResolver(root, null, null, content)
    const html = resolver.resolve()
    expect(html).toContain("<p>value 1</p>")
    expect(html).toContain("<li>subItem 1</li>")
    expect(html).toContain("<li>subItem 2</li>")
    expect(html).toContain("<li>subItem 3</li>")
})


