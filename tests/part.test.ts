import { ContentInMemory } from "../src/fs-utils"
import { Part } from "../src/part"

test("attrs must be 3", () => {
    const part = new Part(new ContentInMemory("test", `
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
`))

    part.attach()
    const attrs = part.attrs
    expect(attrs).toEqual([".name", ".href", "@content"])
})

test("part attrs", ()=>{
    const part = new Part(new ContentInMemory("test", `
    <!--#
    .attr
    -->
    <template>
        <p>{{attr}}</p>
    </template>
    `))
    
    part.attach()
    const attrs = part.attrs
    expect(attrs).toEqual([".attr"])
})