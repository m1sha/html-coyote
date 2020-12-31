import { Content } from "./content";
import DomProvider from "./dom-provider";
import { Layout } from "./layout";
import { Page } from "./page";
import { Part, PartCollection } from "./part";

export class TemplateResolver {
    constructor() {
        
    }

    resolve(layout: Layout, page: Page, parts: PartCollection, content: Content): string{
        layout.attach()
        if (page)
          this.resolvePage(layout, page)
        if (content)
            this.resolveTemplate(layout, content)
        if (parts)
            this.resolveParts(layout, parts, content)

        return layout.toHtml()
    }

    resolvePage(layout: Layout, page: Page){
        page.attach()

        const slots = layout.document.getElementsByTagName("slot")
        let count = 0
        while(slots.length > 0){
            const slot = slots[0]

            if (slots.length === count) throw new Error(`Detected infinity loop in page '${page.name}' slot '${slot.name}' `);
            count = slots.length
            
            const frag = page.templates[slot.name]
            slot.replaceWith(layout.fragment(frag))
        }
    }

    resolveTemplate(element: DomProvider, content: Content){
        const data = content.data
        const templates = element.document.getElementsByTagName("template")
        let ifResult = null
        let _else = false
        let count = 0
        while(templates.length > 0){
            if (templates.length === count) throw new Error("Infinity loop")
            count = templates.length
            const template = templates[0]
            const info = element.getTemplateInfo(template)

            if (info.hasIf){
                ifResult = info.getIfResult(data)
                this.applyIf(element, ifResult, template, data)
                _else = false
            }

            if (info.hasElif){

            }

            if (info.hasElse){
                if (_else) throw new Error("'Else' more one time")
                this.applyElse(element, ifResult, template, data)
                _else = true
            }

            if (info.hasLoop){
                const loop = info.getLoopInfo(data)
                this.applyLoop(element, loop, template, data)
            }

            if (info.empty){
                const html = element.applyTemplateData(template.innerHTML, data)
                template.replaceWith(element.fragment(html))
            }
            
        }
    }

    resolveParts(element: DomProvider, parts: PartCollection, content: Content){
        for(const part of parts){
          
           const elems = element.document.getElementsByTagName(part.name)
           if (!elems.length){
               continue
           }

           this.resolvePart(elems, element, part,content)
       }
    }

    private resolvePart(elems: HTMLCollectionOf<Element>, element: DomProvider, part: Part, content: Content){
        part.attach()
        const attrs = part.attrs
        let index = 0
        
        while  (elems.length > 0) { 
            if (elems.length === index) throw new Error("Infinity loop")
            index = elems.length
   
            const elem = elems[0]
            this.collectAttributeValues(elem, attrs, content)
            this.resolveTemplate(part, content)
            
            const html = part.toHtml()
            elem.replaceWith(element.fragment(html))
            part.attach()
        }
    }

    private applyIf(element: DomProvider, ifResult: boolean, template: HTMLTemplateElement, data: unknown){
        if (ifResult){
            const html = element.applyTemplateData(template.innerHTML, data)
            template.replaceWith(element.fragment(html))
        }
        else{
            template.replaceWith(element.fragment(""))
        }
    }

    private applyElse(element: DomProvider, ifResult: object, template: HTMLTemplateElement, data: unknown){
        if (ifResult === null) throw new Error(`Part '${element.name}' not found if statement`)
        if (!ifResult){
           const html = element.applyTemplateData(template.innerHTML, data)
           template.replaceWith(element.fragment(html))
        }
        else{
            template.replaceWith(element.fragment(""))
        }
    }

    private applyLoop(element: DomProvider, {item, items}, template: HTMLTemplateElement, data: unknown){
        const frags = []
        const values = data[items]
        for (let i = 0; i < values.length; i++) {
            data[item] = values[i];
            const html = element.applyTemplateData(template.innerHTML, data)
            frags.push(html)
        }
        template.replaceWith(element.fragment(frags.join("\n")))
    }

    private collectAttributeValues(elem: Element, attrs: string[], content: Content){
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
            content.add(attrName, value)
        }
    }
}