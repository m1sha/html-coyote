import { TemplateProvider }  from "./template-provider"
import {IContentFile} from "./fs-utils"
import jsdom from "jsdom"
const { JSDOM } = jsdom

export class DomProvider extends TemplateProvider {
    private dom: jsdom.JSDOM
    private document: Document
    readonly name: string

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

    getTemplates(): DomElementCollectionOf<TemplateDomElement>{
        return this.getElementsByTagName<TemplateDomElement>("template", p => new TemplateDomElement(p))
    }

    getParts(name: string): DomElementCollectionOf<PartDomElement>{
        return this.getElementsByTagName<PartDomElement>(name, p => new PartDomElement(p))
    }

    getSlots(): DomElementCollectionOf<SlotDomElement>{
        return this.getElementsByTagName<SlotDomElement>("slot", p => new SlotDomElement(p))
    }

    getComments(): string[]{
        return Array.from(this.document.childNodes)
            .filter(p=>p.nodeType === 8)
            .map(p=>p.nodeValue)
    }

    private getElementsByTagName<T extends DomElement>(tagName: string, activator: CallableFunction) :DomElementCollectionOf<T>{
        return new DomElementCollectionOf(this.document, tagName, activator) as DomElementCollectionOf<T>
    }
}

export class DomElementCollectionOf<T extends DomElement>{
    private readonly document: Document
    private readonly tagName: string
    private readonly activator: CallableFunction

    private get items(): T[]{
        const tags = this.document.getElementsByTagName(this.tagName)
        return Array.from(tags).map(p=>this.activator(p))
    }

    constructor(document: Document, tagName: string, activator: CallableFunction){
        this.document = document
        this.tagName = tagName
        this.activator = activator
    }
    
    get first(): T{
        return this.items[0]
    }

    get(index: number): T{
        return this.items[index]
    }

    get length(): number{
        return this.items.length
    }
}

export abstract class DomElement{
    protected readonly element: HTMLElement

    constructor(element: HTMLElement){
        this.element = element
    }

    inject(frag: string): void{
        this.element.replaceWith(JSDOM.fragment(frag))
    }

    hasAttribute(name: string): boolean{
        return !!this.element.attributes.getNamedItem(name)
    }

    getAttributeByName(name: string): IDomAttribute{
        const attr = this.element.attributes.getNamedItem(name)
        if (!attr) return null
        return {
            name,
            value: attr.nodeValue
        }
    }

    remove(): void{
        this.element.remove()
    }

    get innerHTML(): string{
        return this.element.innerHTML
    }
}

export class TemplateDomElement extends DomElement{
    constructor(element: HTMLTemplateElement){
        super(element)
    }
}

export class PartDomElement extends DomElement{
    constructor(element: HTMLElement){
        super(element)
    }

    get name(): string{
        return this.element.tagName.toLocaleLowerCase()
    }
}

export class SlotDomElement extends DomElement{
    constructor(element: HTMLSlotElement){
        super(element)
    }

    get name(): string{
        return (this.element as HTMLSlotElement).name
    }
}

export interface IDomAttribute{
    readonly name: string
    readonly value: string
}