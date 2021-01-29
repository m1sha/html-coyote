import __ from './strings'
import { Content } from "./content";
import DomProvider from "./dom-provider";
import { Layout } from "./layout";
import { Page } from "./page";
import { Part, PartCollection } from "./part";
import { ifdef, ifeq, ifnull } from './err';
import utils from './utils';
import { ContentInMemory } from './fs-utils';

export class TemplateResolver {

    private layout: Layout
    private page: Page
    private parts: PartCollection
    private content: Content

    constructor(layout: Layout, page: Page, parts: PartCollection, content: Content){
        ifnull(layout, __.LayoutShouldBeDefined)
        this.layout = layout
        this.page = page
        this.parts = parts
        this.content = content
    }

    resolve(): string {
        this.layout.attach()
        let go = true
        while(this.page ? this.resolvePage(): go){
      
            go = false
        
            if (this.content){
                this.resolveTemplate(this.layout)
            }

            if (this.parts)
            {
                ifnull(this.content, __.CannotResolvePartsIfContentUndefined)
                this.resolveParts()
            }
        }
        
        return this.layout.toHtml()
    }

    private resolvePage(): boolean{
        
        ifnull(this.page, __.PageShouldBeDefined)
        this.page.attach()

        const slots = this.layout.findSlots()
        if (slots.length == 0){
            return false
        }

        let count = 0
        while(slots.length > 0){
            const slot = slots[0]
            ifeq(slots.length, count, __.infinityLoopDetected(slot.name))
            count = slots.length
            
            const frag = this.page.templates[slot.name]
            slot.replaceWith(this.layout.fragment(frag))
        }
        return true
    }

    private resolveTemplate(domProvider: DomProvider): void{
        const data = this.content.data
        const templates = domProvider.document.getElementsByTagName("template")
        let ifResult = null
        let _else = false
        let count = 0
        if (templates.length === 0){
            domProvider.document.documentElement.innerHTML = domProvider.applyTemplateData(domProvider.document.documentElement.innerHTML, this.content.data)
            return
        }

        while(templates.length > 0){
            ifeq(templates.length, count, __.infinityLoopDetected(domProvider.name))
            count = templates.length
            const template = templates[0]
            const info = domProvider.getTemplateInfo(template)

            if (info.hasIf){
                ifResult = info.getIfResult(data)
                this.applyIf(domProvider, ifResult, template)
                _else = false
            }

            // if (info.hasElif){

            // }

            if (info.hasElse){
                ifdef(_else, "'Else' more one time")
                this.applyElse(domProvider, ifResult, template)
                _else = true
            }

            if (info.hasLoop){
                const loop = info.getLoopInfo(data)
                this.applyLoop(domProvider, loop, template)
            }

            if (info.hasMarkdown){
                ifnull(data.markdown, `Can't found markdown-document`)
                const html = data.markdown["content"]
                template.replaceWith(domProvider.fragment(html))
            }

            if (info.empty){
                const html = this.resolveTemplateNested(domProvider, template)
                template.replaceWith(domProvider.fragment(html))
            }
        }
    }

    private resolveParts(): void{
        if (!this.parts.length) return
        let go = true
        while(go){
            for(const part of this.parts){
          
                const elems = this.layout.document.getElementsByTagName(part.name)
                if (!elems.length){
                    go = false
                    continue
                }
     
                this.resolvePart(elems, this.layout, part)
                go = true
            }
        }
        
    }

    private resolvePart(elems: HTMLCollectionOf<Element>, domProvider: DomProvider, part: Part){
        let index = 0
        while  (elems.length > 0) { 
            ifeq(elems.length, index, __.infinityLoopDetected(domProvider.name))
            index = elems.length

            part.attach()
            const attrs = part.attrs
   
            const elem = elems[0]
            this.collectAttributeValues(elem, attrs)
            this.resolveTemplate(part)
            
            const html = part.toHtml()
            elem.replaceWith(domProvider.fragment(html))
        }
    }

    private applyIf(domProvider: DomProvider, ifResult: boolean, template: HTMLTemplateElement){
        if (ifResult){
            const html = this.resolveTemplateNested(domProvider, template)
            template.replaceWith(domProvider.fragment(html))
            return
        }
        
        template.replaceWith(domProvider.fragment(""))
    }

    private applyElse(domProvider: DomProvider, ifResult: unknown, template: HTMLTemplateElement){
        ifeq(ifResult, null, `Part '${domProvider.name}' not found if statement`)
        if (!ifResult){
           const html = this.resolveTemplateNested(domProvider, template)
           template.replaceWith(domProvider.fragment(html))
           return
        }
        
        template.replaceWith(domProvider.fragment(""))
    }

    private applyLoop(domProvider: DomProvider, {item, items}, template: HTMLTemplateElement){
        const frags = []
        const data = this.content.data
        for (let i = 0; i < items.length; i++) {
            data[item] = items[i];
            const html = this.resolveTemplateNested(domProvider, template)
            frags.push(html)
        }
        
        template.replaceWith(domProvider.fragment(frags.join("")))
    }

    private resolveTemplateNested(domProvider: DomProvider, template: HTMLTemplateElement): string{
        const el = new DomProvider(new ContentInMemory("frag.html", template.innerHTML))
        el.attach()
        this.resolveTemplate(el)
        const body = el.documentBody
        return domProvider.applyTemplateData(body, this.content.data)
    }

    // private resolvePartNested(){

    // }

    private collectAttributeValues(elem: Element, attrs: string[]){
        for(let i = 0; i < attrs.length; i++){ 
            const attr = attrs[i]
            let value = null
            
            if (attr.startsWith("@")){
                value =  elem.innerHTML
            } 
            
            if (attr.startsWith(".")) {
                const a = attr.substring(1)
                let attrValue = elem.attributes[':' + a]
                if (attrValue){
                    value = utils.getValueFromObjectSafely(this.content.data, attrValue.nodeValue)
                } else{
                    attrValue = elem.attributes[a]
                    ifnull(attrValue, `Tag '${elem.tagName.toLocaleLowerCase()}' hasn't contain attribute '${a}'`);
                    value = attrValue.nodeValue
                }
            }

            const attrName = attr.substring(1)
            this.content.add(attrName, value)
        }
    }
}

