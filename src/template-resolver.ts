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

        const slots = this.layout.document.getElementsByTagName("slot")
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

    private resolveTemplate(element: DomProvider): void{
        const data = this.content.data
        const templates = element.document.getElementsByTagName("template")
        let ifResult = null
        let _else = false
        let count = 0
        if (templates.length === 0){
            element.document.documentElement.innerHTML = element.applyTemplateData(element.document.documentElement.innerHTML, this.content.data)
            return
        }

        while(templates.length > 0){
            ifeq(templates.length, count, __.infinityLoopDetected(element.name))
            count = templates.length
            const template = templates[0]
            const info = element.getTemplateInfo(template)

            if (info.hasIf){
                ifResult = info.getIfResult(data)
                this.applyIf(element, ifResult, template)
                _else = false
            }

            // if (info.hasElif){

            // }

            if (info.hasElse){
                ifdef(_else, "'Else' more one time")
                this.applyElse(element, ifResult, template)
                _else = true
            }

            if (info.hasLoop){
                const loop = info.getLoopInfo(data)
                this.applyLoop(element, loop, template)
            }

            if (info.hasMarkdown){
                ifnull(data.markdown, `Can't found markdown-document`)
                const html = data.markdown["content"]
                template.replaceWith(element.fragment(html))
            }

            if (info.empty){
                const html = this.resolveTemplateNested(element, template)
                template.replaceWith(element.fragment(html))
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

    private resolvePart(elems: HTMLCollectionOf<Element>, root: DomProvider, part: Part){
        let index = 0
        while  (elems.length > 0) { 
            ifeq(elems.length, index, __.infinityLoopDetected(root.name))
            index = elems.length

            part.attach()
            const attrs = part.attrs
   
            const elem = elems[0]
            this.collectAttributeValues(elem, attrs)
            this.resolveTemplate(part)
            
            const html = part.toHtml()
            elem.replaceWith(root.fragment(html))
        }
    }

    private applyIf(root: DomProvider, ifResult: boolean, template: HTMLTemplateElement){
        if (ifResult){
            const html = this.resolveTemplateNested(root, template)
            template.replaceWith(root.fragment(html))
            return
        }
        
        template.replaceWith(root.fragment(""))
    }

    private applyElse(root: DomProvider, ifResult: unknown, template: HTMLTemplateElement){
        ifeq(ifResult, null, `Part '${root.name}' not found if statement`)
        if (!ifResult){
           const html = this.resolveTemplateNested(root, template)
           template.replaceWith(root.fragment(html))
           return
        }
        
        template.replaceWith(root.fragment(""))
    }

    private applyLoop(root: DomProvider, {item, items}, template: HTMLTemplateElement){
        const frags = []
        const data = this.content.data
        for (let i = 0; i < items.length; i++) {
            data[item] = items[i];
            const html = this.resolveTemplateNested(root, template)
            frags.push(html)
        }
        
        template.replaceWith(root.fragment(frags.join("")))
    }

    private resolveTemplateNested(root: DomProvider, template: HTMLTemplateElement): string{
        const el = new DomProvider(new ContentInMemory("frag.html", template.innerHTML))
        el.attach()
        this.resolveTemplate(el)
        const body = el.documentBody
        return root.applyTemplateData(body, this.content.data)
    }

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

