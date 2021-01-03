import { BaseCollection } from "./base-collection"
import DomProvider from "./dom-provider"
import { iftrue } from "./err"
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
                    .filter(p=>p && p.trim() && p.replace("\t", "").trim())
                    .map(p => {
                        const v = p.replace("\r", "").trim()
                        iftrue (v.indexOf(" ") > -1 && (!v.startsWith(".") || !v.startsWith("@")), `Part '${this.name}' can't parse attr '${v}'`)
                        return v
                    })
                    .forEach(p=> result.push(p))
                node.remove()
            }
        }
        return result
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