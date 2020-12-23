import jsdom from "jsdom"
const { JSDOM } = jsdom

export default class DomProvider {
    name: string
    content: string
    dom: jsdom.JSDOM
    document: Document

    constructor(name: string, content: string){
        this.name = name
        this.content = content
        this.dom = new JSDOM('')
        this.document = this.dom.window.document
    }

    init(){
        this.dom = new JSDOM(this.content)
        const { document } = this.dom.window
        this.document = document
        return this
    }

    fragment(frag: string){
        return JSDOM.fragment(frag)
    }
}