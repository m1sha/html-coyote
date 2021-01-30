import {IContentFile} from "./fs-utils"
import DomProvider from "./dom-provider"
import { BaseCollection } from "./base-collection"
import { ifnull } from "./err"

export class Layout extends DomProvider {
    constructor(file: IContentFile){
        super(file)
    }

    findSlots(): HTMLCollectionOf<HTMLSlotElement>{
        return this.document.getElementsByTagName("slot")
    }
}

export class LayoutCollection extends BaseCollection<Layout>{

    createItem(file: IContentFile): Layout {
        return new Layout(file)
    }

    constructor(files: IContentFile[]){
        super(files)
    }

    getLayout(name: string): Layout{
        const result = this.items.filter(p=>p.name === name)[0]
        ifnull(result, `Layout ${name} wasn't found`) 
        return result 
    }
}


