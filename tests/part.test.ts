import { ContentInMemory } from "../src/fs-utils"
import { Part } from "../src/part"

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

test("attrs must be 3", () => {
    const attrs = part.attrs
    expect(attrs.length).toBe(3)
})