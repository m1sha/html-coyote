const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class Page {

    constructor({name, content}){
        this.name = name
        this.content = content
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
            const slot = template.attributes["slot"]
            r[slot.nodeValue] = template.innerHTML
            //r.push({ name: slot.nodeValue, content : template.innerHTML})
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

class PageCollection{
    constructor(files){
        this.items = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            this.items.push(new Page(file))
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

module.exports = { Page, PageCollection }