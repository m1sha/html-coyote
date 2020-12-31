import { TemplateProvider }  from "./template-provider"
import {IContentFile} from "./fs-utils"
import jsdom from "jsdom"
import { Content } from "./content"
import { PartCollection } from "./part"
const { JSDOM } = jsdom

export default class DomProvider extends TemplateProvider {
    protected file: IContentFile
    protected dom: jsdom.JSDOM
    document: Document
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
    
    

    fragment(frag: string): DocumentFragment {
        return JSDOM.fragment(frag)
    }

    toHtml(): string {
        return this.dom.serialize()
    }

    
}