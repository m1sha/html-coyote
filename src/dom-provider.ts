import { TemplateProvider }  from "./template-provider"
import {IContentFile} from "./fs-utils"
import jsdom from "jsdom"
const { JSDOM } = jsdom

export default class DomProvider extends TemplateProvider {
   
    protected dom: jsdom.JSDOM
    name: string
    document: Document

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

    static createFragment(frag: string): DocumentFragment {
        return JSDOM.fragment(frag)
    }
}