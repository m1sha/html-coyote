import TemplateProvider  from "./template-provider"
import {IContentFile} from "./fs-utils"
import utils from "./utils"
import jsdom from "jsdom"
const { JSDOM } = jsdom

export default class DomProvider extends TemplateProvider {
    protected file: IContentFile
    protected dom: jsdom.JSDOM
    protected document: Document

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

    resolveTemplate(parts: DomProvider[], data: unknown){
        const templates = this.document.getElementsByTagName("template")
        let ifResult = null
        while(templates.length > 0){
            const template = templates[0]
            const info = getInfo(template)
            if (info.hasIf && info.hasElse) throw new Error(`A template in the file '${this.file.name}' has 'if' and 'else' attribute at the same time'`)

            if (info.hasIf){
                ifResult = info._if(data)
                if (ifResult){
                    const html = this.applyTemplate(template.innerHTML, data)
                    template.replaceWith(this.fragment(html))
                }
                else{
                    template.replaceWith(this.fragment(""))
                }

            }

            if (info.hasElse){
                if (ifResult === null) throw new Error(`Part '${this.name}' not found if statement`)
                if (!ifResult){
                   const html = this.applyTemplate(template.innerHTML, data)
                   template.replaceWith(this.fragment(html))
                }
                else{
                    template.replaceWith(this.fragment(""))
                }
            }

            if (info.hasLoop){
                const loop = info._loop(data)
                const items = data[loop.items]
                const frags = []
                for (let i = 0; i < items.length; i++) {
                    data[loop.item] = items[i];
                    const html = this.applyTemplate(template.innerHTML, data)
                    frags.push(html)
                }
                template.replaceWith(this.fragment(frags.join("\n")))
            }

            if (info.empty){
                const html = this.applyTemplate(template.innerHTML, data)
                template.replaceWith(this.fragment(html))
            }
            
        }
        return this
    }
}

function getInfo(template: HTMLTemplateElement){
    const slot = template.attributes.getNamedItem("slot")
    const _if = template.attributes.getNamedItem("if")
    let ifvalue = null
    let hasIf = false
    if (_if && _if.nodeValue){
        ifvalue = utils.preparing(_if.nodeValue, "data")
        hasIf = true
    }

    const _else = template.attributes.getNamedItem("else")
    const hasElse = !!_else

    const _loop = template.attributes.getNamedItem("loop")
    const hasLoop = !!_loop

    return {
        hasIf,
        hasElse,
        hasLoop,
        _loop: function(data: unknown){
           return utils.parseLoopStatement(_loop.nodeValue)
        },

        _if : function(data: unknown){
            return eval(ifvalue)
        },
        
        _slot : slot ? slot.nodeValue: null,

        empty: !hasIf && !hasElse && !hasLoop
    }
}

