import { ContentInMemory } from "../src/fs-utils"
import  DomProvider  from "../src/dom-provider"
import { Content } from "../src/content"

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

    root.addContent(content)

    content.add("a", 1)
    content.add("b", 1)
    root.attach()
    root.resolveTemplate()
    expect(root.toHtml()).toContain("<p>foo</p>")

    content.add("a", 1)
    content.add("b", 2)
    root.attach()
    root.resolveTemplate()
    expect(root.toHtml()).toContain("<p>bar</p>")
})

test ("if only 'else'", ()=>{
    const content = createContent()
    const root = createDom(`
        <template else>
            <p>bar</p>
        </template>
    `)
    
    try{
        content.add("a", 1)
        content.add("b", 1)
        root.addContent(content)
        root.attach()
        root.resolveTemplate()
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

    content.add("values", [ {name: "value 1"}, {name: "value 2"}, {name: "value 3"} ])
    root.addContent(content)
    root.attach()
    root.resolveTemplate()

    const html = root.toHtml();
    expect(html).toContain("<p>value 1</p>")
    expect(html).toContain("<p>value 2</p>")
    expect(html).toContain("<p>value 3</p>")
})


function createDom(content: string): DomProvider{
    return new DomProvider(new ContentInMemory("root", content))
}

function createContent(): Content{
    return new Content([])
}