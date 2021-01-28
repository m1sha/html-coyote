import { 
    createPart, 
} from "./helpers"

test("attrs should be 3", () => {
    const part = createPart("part", `
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
    const part = createPart("part", `
        <!--#
        .attr
        -->
    `)
    
    part.attach()
    const attrs = part.attrs
    expect(attrs).toEqual([".attr"])
})

test("attrs should be @content only", ()=>{
    const part = createPart("part", `
        <!--#
    
        @content
    
        -->
    `)
    
    part.attach()
    const attrs = part.attrs
    expect(attrs).toEqual(["@content"])
})

