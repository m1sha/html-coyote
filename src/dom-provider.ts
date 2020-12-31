import { TemplateProvider }  from "./template-provider"
import {IContentFile} from "./fs-utils"
import jsdom from "jsdom"
import { Content } from "./content"
import { PartCollection } from "./part"
const { JSDOM } = jsdom

export default class DomProvider extends TemplateProvider {
    protected file: IContentFile
    protected dom: jsdom.JSDOM
    protected document: Document
    protected content: Content
    protected parts: PartCollection

    name: string

    constructor(file: IContentFile) {
        super()

        this.file = file
        this.name = file.name
        this.dom = new JSDOM('')
        this.document = this.dom.window.document
    }

    attach() {
        this.dom = new JSDOM(this.file.content)
        const { document } = this.dom.window
        this.document = document
        return this
    }
    
    addContent(content: Content){
        this.content = content
        return this
    }

    addParts(parts: PartCollection){
        this.parts = parts
        return this
    }

    fragment(frag: string): DocumentFragment {
        return JSDOM.fragment(frag)
    }

    toHtml(): string {
        return this.dom.serialize()
    }

    resolveTemplate(){
        const data = this.content.data
        const templates = this.document.getElementsByTagName("template")
        let ifResult = null
        let _else = false
        let count = 0
        while(templates.length > 0){
            if (templates.length === count) throw new Error("Infinity loop")
            count = templates.length
            const template = templates[0]
            const info = this.getTemplateInfo(template)

            if (info.hasIf){
                ifResult = info.getIfResult(data)
                this.applyIf(ifResult, template, data)
                _else = false
            }

            if (info.hasElif){

            }

            if (info.hasElse){
                if (_else) throw new Error("'Else' more one time")
                this.applyElse(ifResult, template, data)
                _else = true
            }

            if (info.hasLoop){
                const loop = info.getLoopInfo(data)
                this.applyLoop(loop, template, data)
            }

            if (info.empty){
                const html = this.applyTemplateData(template.innerHTML, data)
                template.replaceWith(this.fragment(html))
            }
            
        }
        return this
    }

    private applyIf(ifResult: boolean, template: HTMLTemplateElement, data: unknown){
        if (ifResult){
            const html = this.applyTemplateData(template.innerHTML, data)
            template.replaceWith(this.fragment(html))
        }
        else{
            template.replaceWith(this.fragment(""))
        }
    }

    private applyElse(ifResult: object, template: HTMLTemplateElement, data: unknown){
        if (ifResult === null) throw new Error(`Part '${this.name}' not found if statement`)
        if (!ifResult){
           const html = this.applyTemplateData(template.innerHTML, data)
           template.replaceWith(this.fragment(html))
        }
        else{
            template.replaceWith(this.fragment(""))
        }
    }

    private applyLoop({item, items}, template: HTMLTemplateElement, data: unknown){
        const frags = []
        const values = data[items]
        for (let i = 0; i < values.length; i++) {
            data[item] = values[i];
            const html = this.applyTemplateData(template.innerHTML, data)
            frags.push(html)
        }
        template.replaceWith(this.fragment(frags.join("\n")))
    }
}