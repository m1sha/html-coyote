import __ from './strings'
import { Content } from "./content";
import { DomElementCollectionOf, DomProvider, PartDomElement, TemplateDomElement } from "./dom-provider";
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
                this.resolveParts(this.layout)
            }
        }
        
        return this.layout.toHtml()
    }

    private resolvePage(): boolean{
        ifnull(this.page, __.PageShouldBeDefined)
        this.page.attach()

        const slots = this.layout.getSlots()
        if (slots.length == 0){
            return false
        }

        let count = 0
        while(slots.length > 0){
            const slot = slots.first
            ifeq(slots.length, count, __.infinityLoopDetected(slot.name))
            count = slots.length
            
            let frag = this.page.templates[slot.name]
            if (this.content)
                frag = this.page.resolveExpression(frag, this.content.data)
                
            slot.inject(frag)
        }

        return true
    }

    private resolveTemplate(domProvider: DomProvider): void{
        const data = this.content.data
        const templates = domProvider.getTemplates()
        let ifResult = null
        let _else = false
        let count = 0
        
        if (templates.length === 0){
            domProvider.innerHTML = domProvider.resolveExpression(domProvider.innerHTML, data)
            return
        }

        while(templates.length > 0){
            ifeq(templates.length, count, __.infinityLoopDetected(domProvider.name))
            count = templates.length
            const template = templates.first
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
                ifnull(data.markdown, `The page has <template markdown></template> but can't found markdown-document`)
                const html = data.markdown["content"]
                template.inject(html)
            }

            if (info.empty){
                const html = this.resolveTemplateNested(domProvider, template)
                template.inject(html)
            }
        }
    }

    private resolveParts(domProvider: DomProvider): void{
        if (!this.parts || !this.parts.length) return
        let go = true
        while(go){
            for(const part of this.parts){
          
                const tags = domProvider.getParts(part.name)
                if (!tags.length){
                    go = false
                    continue
                }
     
                this.resolvePart(tags, domProvider, part)
                go = true
            }
        }
        
    }

    private resolvePart(tags: DomElementCollectionOf<PartDomElement>, domProvider: DomProvider, part: Part){
        let index = 0
        while  (tags.length > 0) { 
            ifeq(tags.length, index, __.infinityLoopDetected(domProvider.name))
            index = tags.length

            part.attach()
            const attrs = part.attrs
   
            const tag = tags.first
            this.collectAttributeValues(tag, attrs)
            this.resolveTemplate(part)
            
            const html = part.toHtml()
            tag.inject(html)
        }
    }

    private applyIf(domProvider: DomProvider, ifResult: boolean, template: TemplateDomElement){
        if (ifResult){
            const html = this.resolveTemplateNested(domProvider, template)
            template.inject(html)
            return
        }
        
        template.remove()
    }

    private applyElse(domProvider: DomProvider, ifResult: unknown, template: TemplateDomElement){
        ifeq(ifResult, null, `Part '${domProvider.name}' not found if statement`)
        if (!ifResult){
           const html = this.resolveTemplateNested(domProvider, template)
           template.inject(html)
           return
        }
        
        template.remove()
    }

    private applyLoop(domProvider: DomProvider, { item, items }, template: TemplateDomElement){
        const frags = []
        const data = this.content.data
        for (let i = 0; i < items.length; i++) {
            data[item] = items[i];
            const html = this.resolveTemplateNested(domProvider, template)
            const component = new DomProvider(new ContentInMemory("part.html", html), domProvider)
            component.attach()
            this.resolveParts(component)
            frags.push(component.toHtml())
        }
        
        template.inject(frags.join(""))
    }

    private resolveTemplateNested(domProvider: DomProvider, template: TemplateDomElement): string{
        const el = new DomProvider(new ContentInMemory("frag.html", template.innerHTML), domProvider)
        el.attach()
        this.resolveTemplate(el)
        const body = el.documentBody
        return domProvider.resolveExpression(body, this.content.data)
    }

    // private resolvePartNested(){

    // }

    private collectAttributeValues(elem: PartDomElement, attrs: string[]){
        for(let i = 0; i < attrs.length; i++){ 
            const attr = attrs[i]
            let value = null
            
            if (attr.startsWith("@")){
                value = elem.innerHTML
            } 
            
            if (attr.startsWith(".")) {
                const a = attr.substring(1)
                
                let attrValue = elem.getAttributeByName(':' + a)
                if (attrValue){
                    value = utils.getValueFromObject(this.content.data, attrValue.value)
                } else{
                    attrValue = elem.getAttributeByName(a)
                    ifnull(attrValue, `Tag '${elem.name}' hasn't contain attribute '${a}'`);
                    value = attrValue.value
                }
            }

            const attrName = attr.substring(1)
            this.content.add(attrName, value)
        }
    }
}

