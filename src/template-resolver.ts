import __ from './strings'
import { Content } from "./content";
import DomProvider from "./dom-provider";
import { Layout } from "./layout";
import { Page } from "./page";
import { Part, PartCollection } from "./part";
import { ifdef, ifeq, ifnull } from './err';

export class TemplateResolver {

    resolve(layout: Layout, page: Page, parts: PartCollection, content: Content): string {
        ifnull(layout, __.LayoutShouldBeDefined)
        layout.attach()

        let go = true
        while(page ? this.resolvePage(layout, page): go){
      
            go = false
        
            if (content){
                this.resolveTemplate(layout, content)
            }

            if (parts)
            {
                ifnull(content, __.CannotResolvePartsIfContentUndefined)
                this.resolveParts(layout, parts, content)
            }
        }
        
        return layout.toHtml()
    }

    resolvePage(layout: Layout, page: Page): boolean{
        ifnull(layout, __.LayoutShouldBeDefined)
        ifnull(page, __.PageShouldBeDefined)
        page.attach()

        const slots = layout.document.getElementsByTagName("slot")
        if (slots.length == 0){
            return false
        }

        let count = 0
        while(slots.length > 0){
            const slot = slots[0]
            ifeq(slots.length, count, __.infinityLoopDetected(slot.name))
            count = slots.length
            
            const frag = page.templates[slot.name]
            slot.replaceWith(layout.fragment(frag))
        }
        return true
    }

    resolveTemplate(element: DomProvider, content: Content): void{
        const data = content.data
        const templates = element.document.getElementsByTagName("template")
        let ifResult = null
        let _else = false
        let count = 0
        while(templates.length > 0){
            ifeq(templates.length, count, __.infinityLoopDetected(element.name))
            count = templates.length
            const template = templates[0]
            const info = element.getTemplateInfo(template)

            if (info.hasIf){
                ifResult = info.getIfResult(data)
                this.applyIf(element, ifResult, template, data)
                _else = false
            }

            // if (info.hasElif){

            // }

            if (info.hasElse){
                ifdef(_else, "'Else' more one time")
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

    resolveParts(element: DomProvider, parts: PartCollection, content: Content): void{
        let go = true
        while(go){
            for(const part of parts){
          
                const elems = element.document.getElementsByTagName(part.name)
                if (!elems.length){
                    go = false
                    continue
                }
     
                this.resolvePart(elems, element, part, content)
                go = true
            }
        }
        
    }

    private resolvePart(elems: HTMLCollectionOf<Element>, root: DomProvider, part: Part, content: Content){
        let index = 0
        while  (elems.length > 0) { 
            ifeq(elems.length, index, __.infinityLoopDetected(root.name))
            index = elems.length

            part.attach()
            const attrs = part.attrs
   
            const elem = elems[0]
            this.collectAttributeValues(elem, attrs, content)
            this.resolveTemplate(part, content)
            
            const html = part.toHtml()
            elem.replaceWith(root.fragment(html))
        }
    }

    private applyIf(root: DomProvider, ifResult: boolean, template: HTMLTemplateElement, data: unknown){
        if (ifResult){
            const html = root.applyTemplateData(template.innerHTML, data)
            template.replaceWith(root.fragment(html))
            return
        }
        
        template.replaceWith(root.fragment(""))
    }

    private applyElse(root: DomProvider, ifResult: unknown, template: HTMLTemplateElement, data: unknown){
        ifeq(ifResult, null, `Part '${root.name}' not found if statement`)
        if (!ifResult){
           const html = root.applyTemplateData(template.innerHTML, data)
           template.replaceWith(root.fragment(html))
           return
        }
        
        template.replaceWith(root.fragment(""))
    }

    private applyLoop(root: DomProvider, {item, items}, template: HTMLTemplateElement, data: unknown){
        const frags = []
        const values = data[items]
        for (let i = 0; i < values.length; i++) {
            data[item] = values[i];
            const html = root.applyTemplateData(template.innerHTML, data)
            frags.push(html)
        }
        template.replaceWith(root.fragment(frags.join("")))
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
                ifnull(attrValue, `Tag '${elem.tagName.toLocaleLowerCase()}' hasn't contain attribute '${a}'`);
                value =  attrValue.nodeValue
            }

            const attrName = attr.substring(1)
            content.add(attrName, value)
        }
    }
}