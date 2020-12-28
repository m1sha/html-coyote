import { BaseCollection } from "./base-collection"
import DomProvider from "./dom-provider"
import { IContentFile } from "./fs-utils"

export class Part extends DomProvider {

    constructor(file: IContentFile){
        super(file)
    }

    get attrs(): string[] {
        const result = []
        const nodes = this.document.childNodes
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.nodeType === 8 && node.nodeValue.startsWith("#")) { 
                node.nodeValue
                    .substring(1)
                    .split("\n")
                    .filter(p=>p)
                    .map(p => {
                        const v = p.replace("\r", "").trim()
                        if (v.indexOf(" ") > -1 && (!v.startsWith(".") || !v.startsWith("@"))){
                            throw new Error(`Part '${this.name}' can't parse attr '${v}'`)
                        }
                        return v
                    })
                    .forEach(p=> result.push(p))
            }
        }
        return result
    }

    getTemplates(data: any): string[] {
        const templates = this.document.getElementsByTagName("template")
        const r = []
        let _ifvalue = null
        for(let i=0; i < templates.length; i++){
            const template = templates[i]
            const _if = template.attributes.getNamedItem("if")
            if (_if && _if.nodeValue){
                const _ifAttrValue = preparing(_if.nodeValue)
                _ifvalue = eval(_ifAttrValue) // data injected here
                if (_ifvalue){
                    r.push(template.innerHTML)
                }
            }

            const _else = template.attributes.getNamedItem("else")
            if (_else){
                if (_ifvalue === null) throw new Error(`Part '${this.name}' not found if statement`)
                if (!_ifvalue) r.push(template.innerHTML)
            }

            if (!_if && !_else){
                r.push(template.innerHTML)
            }
        }

        return r
    }
}

export class PartCollection extends BaseCollection<Part>{
    constructor(files: IContentFile[]){
        super(files)
    }

    createItem(file: IContentFile): Part {
        return new Part(file)
    }
}

function preparing(value: string): string{

    var r = value
       .split(" ")
       .filter(p=>p)
       .map(p=>{
           const chr = p.substring(0,1)
           if ((chr >= 'a' && chr <= 'z') || chr === '_' ){
             return "data." + p
           }
           return p
       }).join(" ")
    return r
}