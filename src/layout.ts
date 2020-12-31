import {IContentFile} from "./fs-utils"
import DomProvider from "./dom-provider"
import { Page } from "./page"
import { BaseCollection } from "./base-collection"

export class Layout extends DomProvider {

    constructor(file: IContentFile){
        super(file)
    }

    resolvePage(page: Page){
        const slots = this.document.getElementsByTagName("slot")
        let count = 0
        while(slots.length > 0){
            const slot = slots[0]

            if (slots.length === count) throw new Error(`Detected infinity loop in page '${page.name}' slot '${slot.name}' `);
            count = slots.length
            
            const frag = page.templates[slot.name]
            slot.replaceWith(this.fragment(frag))
        }
        
        return this
    }

    resolveParts(){

         for(const part of this.parts){
           
            const elems = this.document.getElementsByTagName(part.name)
            if (!elems.length){
                continue
            }
            part.attach()
            part.addContent(this.content)
            part.addParts(this.parts)

           const attrs = part.attrs
           let index = 0
           while  (elems.length > 0){ //TODO Rewrite all same places
            if (elems.length === index) throw new Error("Infinity loop")
            index = elems.length

            const elem = elems[0]
            //const data = {... this.content.data}
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
                this.content.add(attrName, value)
            }

            part.resolveTemplate()
            const html = part.toHtml()
            elem.replaceWith(this.fragment(html))
            part.attach()

           }
        }
        
         return this
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


