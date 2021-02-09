import { TemplateProvider }  from "./template-provider"
import {IContentFile} from "./fs-utils"
import jsdom from "jsdom"
const { JSDOM } = jsdom

export default class DomProvider extends TemplateProvider {
   
    protected dom: jsdom.JSDOM
    name: string
    private document: Document

    constructor(file: IContentFile, originProvider?: DomProvider) {
        super(file, originProvider)
        this.name = file.name
        this.dom = new JSDOM('')
        this.document = this.dom.window.document
    }

    attach(): void {
        this.dom = new JSDOM(this.file.content)
        const { document } = this.dom.window
        this.document = document
    }

    toHtml(): string {
        return this.dom.serialize()
    }

    get documentBody(): string{
        return this.document.body.innerHTML
    }

    get innerHTML(): string{
        return this.document.documentElement.innerHTML
    }

    set innerHTML(value: string){
        this.document.documentElement.innerHTML = value
    }

    getTemplates(): HTMLCollectionOf<HTMLTemplateElement>{
        return this.document.getElementsByTagName("template")
    }

    getParts(name: string): HTMLCollectionOf<Element>{
        return this.document.getElementsByTagName(name)
    }

    findSlots(): HTMLCollectionOf<HTMLSlotElement>{
        return this.document.getElementsByTagName("slot")
    }

    getComments(): string[]{
        return Array.from(this.document.childNodes)
            .filter(p=>p.nodeType === 8)
            .map(p=>p.nodeValue)
    }

    static createFragment(frag: string): DocumentFragment {
        return JSDOM.fragment(frag)
    }
}