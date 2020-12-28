import {IContentFile} from "./fs-utils"
import DomProvider from "./dom-provider"
import { Page } from "./page"
import { PartCollection } from "./part"
import { BaseCollection } from "./base-collection"
import { Dictionary } from "./base-dictionary"
import { Content } from "./content"

export class Layout extends DomProvider {

    _content: Content

    constructor(file: IContentFile){
        super(file)
    }

    addContent(content: Content){
        this._content = content
        return this
    }

    applyPage(page: Page){
        const slots = this.document.getElementsByTagName("slot")
        let counter = 0
        while(slots.length > 0){
            const slot = slots[0]
            if (slots.length === counter) throw new Error(`Detected infinity loop in page '${page.name}' slot '${slot.name}' `);
            counter = slots.length
            
            const frag = page.templates[slot.name]
            slot.replaceWith(this.fragment(frag))
        }
        
        return this
    }

    applyParts(parts: PartCollection){

        for(const part of parts){
           
           const elems = this.document.getElementsByTagName(part.name)
           if (!elems.length){
               continue
           }
           part.attach()

           const attrs = part.attrs
           while  (elems.length > 0){
            const elem = elems[0]
            const data = {... this._content.data}
            for(let a = 0; a < attrs.length; a++){
                const attr = attrs[a]
                let value = ''
                
                if (attr.startsWith("@")){
                    value =  elem.innerHTML
                } 
                
                if (attr.startsWith(".")) {
                    const a = attr.substring(1)
                    const attrValue = elem.attributes[a]
                    if (!attrValue) throw new Error(`Tag '${elem.tagName.toLocaleLowerCase()}' hasn't contain attribute '${a}'`);

                    value =  attrValue.nodeValue
                }

                const attrName = attr.substring(1)
                data[attrName] = value
            }

            const templates = part.getTemplates(data)
            for (let i = 0; i < templates.length; i++) {
                const template = templates[i];
                const partHtml = part.applyTemplate(template, data)
                elem.replaceWith(this.fragment(partHtml))
            }

           }
        }
        
        return this
    }

    build(){
        return this.toHtml()
    }

}

export class LayoutCollection extends BaseCollection<Layout>{

    createItem(file: IContentFile): Layout {
        return new Layout(file)
    }

    constructor(files: IContentFile[]){
        super(files)
    }

    getLayout(name): Layout{
        const result = this.items.filter(p=>p.name === name)[0]
        if (!result) throw new Error(`Layout ${name} wasn't found`) 
        
        return result 
    }
}


