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
const attrs = part.attrs
console.log(attrs)

const templates = part.getTemplates({__pageName: "page", name: "page"})
console.log(templates)