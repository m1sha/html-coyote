import jsdom  from "jsdom"
const { JSDOM } = jsdom;

export class Page {

    name: string
    content: string
    dom: jsdom.JSDOM
    document: Document

    constructor(name: string, content: string){
        this.name = name
        this.content = content
        this.dom = new JSDOM('')
        this.document = this.dom.window.document
    }

    init(){
        this.dom = new JSDOM(this.content)
        const { document } =  this.dom.window
        this.document = document
    }

    get templates(){
        const templates = this.document.getElementsByTagName("template")
        const r = {}
        for(let i=0; i < templates.length; i++){
            const template = templates[i]
            const slot = template.attributes.getNamedItem("slot")
            if (!slot || !slot.nodeValue) {
                throw new Error(`tag template hasn't contain required attribute slot`)
            }
            
            r[slot.nodeValue] = template.innerHTML
        }
        return r
    }

    get layoutName(){
        const nodes = this.document.childNodes
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.nodeType === 8 && node.nodeValue.startsWith("#layout=")) {  //TODO: If more than an one throwing the error "#layout must be one only"
                let name = node.nodeValue.substring(8)  
                if (name.endsWith(".html")){
                    name = name.substring(0, name.length - 5)
                }

                return name
            }
        }
        return ""
    }

}

export class PageCollection{
    items: Page[]
    length: number

    constructor(files){
        this.items = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            this.items.push(new Page(file.name, file.content))
        }
        this.length = this.items.length
    }

    [Symbol.iterator](){
        let index = 0;
        return {
          next: () => {
            if (index < this.items.length) {
              return {value: this.items[index++], done: false}
            } else {
              return {done: true}
            }
          }
        }
    }
}