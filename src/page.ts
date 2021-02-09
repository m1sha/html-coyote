import {IContentFile} from "./fs-utils"
import {DomProvider} from "./dom-provider"
import { BaseCollection } from "./base-collection"
import { iftrue } from "./err"

export class Page extends DomProvider  {

    constructor(file: IContentFile){
        super(file)
    }

    get templates(): unknown{
        const templates = this.getTemplates()
        const r = {}
        for(let i=0; i < templates.length; i++){
            const template = templates.get(i)
            const slot = template.getAttributeByName("slot")
            iftrue(!slot || !slot.value, `tag template hasn't contain required attribute slot`) 
            
            r[slot.value] = template.innerHTML
        }
        return r
    }

    get layoutName(): string{
        const layouts = this.getComments().filter(p=>p.startsWith("#layout="))
        if (!layouts){
            throw new Error(`#layout directive isn't defined`)
        }

        if (layouts.length > 1){
            throw new Error(`#layout is defined more than one time`)
        }

        let name = layouts[0].substring(8)  
        if (name.endsWith(".html")){
            name = name.substring(0, name.length - 5)
        }

        return name
    }

}

export class PageCollection extends BaseCollection<Page>{

    constructor(files: IContentFile[]){
        super(files)
    }

    createItem(file: IContentFile): Page {
        return new Page(file)
    }
}