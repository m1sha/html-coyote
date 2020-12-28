import {IContentFile} from "./fs-utils"
import DomProvider from "./dom-provider"
import { BaseCollection } from "./base-collection"

export class Page extends DomProvider  {

    constructor(file: IContentFile){
        super(file)
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

export class PageCollection extends BaseCollection<Page>{

    constructor(files: IContentFile[]){
        super(files)
    }

    createItem(file: IContentFile): Page {
        return new Page(file)
    }
}