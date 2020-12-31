import { ContentInMemory } from "../src/fs-utils"
import { Part } from "../src/part"

test("attrs should be 3", () => {
    const part = createPart(`
        <!--#
        .name
        .href
        @content
        -->
    `)

    part.attach()
    const attrs = part.attrs
    expect(attrs).toEqual([".name", ".href", "@content"])
})

test("attrs should be 1", ()=>{
    const part = createPart(`
        <!--#
        .attr
        -->
    `)
    
    part.attach()
    const attrs = part.attrs
    expect(attrs).toEqual([".attr"])
})

test("attrs should be @content only", ()=>{
    const part = createPart(`
        <!--#
    
        @content
    
        -->
    `)
    
    part.attach()
    const attrs = part.attrs
    expect(attrs).toEqual(["@content"])
})

function createPart(content: string): Part{
    return new Part(new ContentInMemory("test", content))
}