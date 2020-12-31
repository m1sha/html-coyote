import {IContentFile} from "./fs-utils"
import DomProvider from "./dom-provider"
import { BaseCollection } from "./base-collection"

export class Layout extends DomProvider {
    constructor(file: IContentFile){
        super(file)
    }
}

export class LayoutCollection extends BaseCollection<Layout>{

    createItem(file: IContentFile): Layout {
        return new Layout(file)
    }

    constructor(files: IContentFile[]){
        super(files)
    }

    getLayout(name): Layout{
        const result = this.items.filter(p=>p.name === name)[0]
        if (!result) throw new Error(`Layout ${name} wasn't found`) 
        
        return result 
    }
}


