import { ContentInMemory } from "../src/fs-utils"
import { MdDocument } from "../src/md-document"

const mdtext =`
---
page: index
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
const mdoc = new MdDocument(new ContentInMemory("file.md", mdtext))
mdoc.open()

test("md headers", () => {
    const headers = mdoc.headers
    expect(headers).toEqual([
        {  href:"#1.1-subheader-text-1", name: "1.1 Subheader text 1" },
        {  href:"#1.2-subheader-text-2", name: "1.2 Subheader text 2" }
    ])
})

test("md content", () => {
    const html = mdoc.content
    expect(html).toContain("Templates")
})

test("md meta", ()=>{
    expect(mdoc.meta.pageName).toEqual("index")
})