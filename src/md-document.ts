import { ContentFile, IContentFile } from "./fs-utils";
import marked from "marked"
import { BaseCollection } from "./base-collection";
import { ifnull } from "./err";
import utils from "./utils";

export class  MdDocument {
    private file: IContentFile
    private tokens: marked.TokensList

    _meta: MdMeta

    constructor(file: IContentFile) {
        this.file = file    
        this._meta = null
    }

    open(): void{
        const content = cutMeta(this.file.content)
        this.tokens = marked.lexer(content)
    }

    get name(): string{
        return this.file.name
    }

    get headers(): IHeaderNode[]{
        const result = []
        const headers = this.tokens.filter(p=>p["type"] === 'heading' && p["depth"] > 1)
        for (let i = 0; i < headers.length; i++) {
            const name = headers[i]["text"] as string
            const href = "#" + name.replace(/ /g, "-").replace(/[.]/g, "").toLocaleLowerCase()
            result.push({name, href })
        }
        return result
    }

    get content(): string{
        return marked.parser(this.tokens)
    }

    get meta(): MdMeta{
        if (!this._meta){
            this.loadMeta()
        }
        return this._meta
    }

    private loadMeta(): void{
        const content = readMeta(this.file.content)
        ifnull(content, `Can't read meta from file ${this.file.name}`) 
        const data = utils.toJson(content)
        this._meta = new MdMeta(data)
    }
}

export interface IHeaderNode {
    name: string
    href: string
    items: IHeaderNode[]
}

export class MdDocumentCollection extends BaseCollection<MdDocument> {
    constructor(files: IContentFile[]) {
        super(files)
    }

    createItem(file: ContentFile): MdDocument {
        return new MdDocument(file)
    }

    find(pageName: string): MdDocument[] {
        return this.items.filter(p=>p.meta.pageName === pageName)
    }
}

export class MdMeta {

    pageName: string
    data: unknown

    constructor(data: unknown) {
        this.pageName = data["page"]
        this.data = data
    }

}

function cutMeta(value: string): string{
    const temp = []
    const lines = value.split("\n")
    let index = 0
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trimEnd() === "---"){
            ++index
            continue
        }
        
        if (index > 1){
            temp.push(line)
        }
    }

    return temp.length ? temp.join("\n") : value
}

function readMeta(value): string{
    const temp = []
    const lines = value.split("\n")
    let index = 0
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trimEnd() === "---"){
            ++index
            continue
        }
        
        if (index === 1){
            temp.push(line)
        }

        if (index > 1){
            break;
        }
    }

    return temp.join("\n")
}