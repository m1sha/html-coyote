import { createMd } from "./helpers"

const mdText =`
---
page: index
title: "Title"
author:
    name: "AuthorName"
---

# Templates
## 1.1 Subheader text 1
* Item 1
* Item 1
* Item 1

## 1.2 Subheader text 2
The paragraph page
The attributes have a parameter the name of page. 

\`\`\`html
<div></div>
\`\`\`
    
`
const mdoc = createMd("file.md", mdText)
mdoc.open()

test("md headers", () => {
    const headers = mdoc.headers
    expect(headers).toEqual([
        {  href:"#11-subheader-text-1", name: "1.1 Subheader text 1" },
        {  href:"#12-subheader-text-2", name: "1.2 Subheader text 2" }
    ])
})

test("md content", () => {
    const html = mdoc.content
    expect(html).toContain("Templates")
})

test("md meta pageName", () => {
    expect(mdoc.meta.pageName).toEqual("index")
})

test("md meta data", () => {
    expect(mdoc.meta.data["author"].name).toEqual("AuthorName")
    expect(mdoc.meta.data["title"]).toEqual("Title")
})