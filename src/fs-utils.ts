import * as fs from "fs"
import path from "path"

abstract class ContentFileBase implements IContentFile {
    readonly name: string
    fullName: string
    readonly type: ContentType

    constructor(name: string) {
        const ext = path.extname(name)
        this.name = name.substring(0, name.length - ext.length)
        this.fullName = name
        switch(ext){
            case ".html":
                this.type = ContentType.HTML
                break
            case ".yml":
                this.type = ContentType.YAML
                break
            case ".markdown":
            case ".md":
                this.type = ContentType.MD
                break
            case ".css":
                this.type = ContentType.CSS
                break
            case ".less":
                this.type = ContentType.LESS
                break
            case ".scss":
                this.type = ContentType.SCSS
                break
            case ".js": 
                this.type = ContentType.JS
                break
            case ".json": 
                this.type = ContentType.JSON
                break
            default:
                this.type = ContentType.RAW
                break
        }
    }
    
    public get content(): string {
        throw new Error("Not Implemented")
    }
}

export class ContentFile extends ContentFileBase{
    constructor (name: string, fullName: string){
        super(name)
        this.fullName = fullName
    }

    get content(): string{
        return read(this.fullName)
    }
}

export class ContentInMemory extends ContentFileBase{
    _content: string

    constructor (name: string, content: string){
        super(name)
        this._content = content
    }

    get content(): string{
        return this._content
    }
}

export interface IContentFile {
    readonly name: string
    readonly fullName: string
    readonly content: string
    readonly type: ContentType
}

export enum ContentType {
    UNDEFINED = 0,
    HTML,
    YAML,
    MD,
    CSS,
    LESS,
    SCSS,
    JS,
    JSON,
    RAW //For other assets files like images and etc.
}

export interface IFile {
    name: string
    fullName: string
    dir: string
}

export function ls(dir: string, root: string): IFile[]{
    const files = readdir(dir)
    let result = []

    for (let index = 0; index < files.length; index++) {
        const name = files[index]
        const fullName = join(dir, name)
        
        if (if_f(fullName)){
            result.push({ 
                name, 
                fullName, 
                dir: root ? dir.substring(root.length) : dir
            })
        }

        if (if_d(fullName)){
            result = result.concat(ls(fullName, root))
        }
    }

    return result
}

export function loadfiles (dir: string): ContentFile[]  { 
    const files = ls(dir, dir)
    const result = []
    for (let index = 0; index < files.length; index++) {
        const file = files[index]
        result.push(new ContentFile(file.name, file.fullName))
    }

    return result
}

const read = (filename: string) => fs.readFileSync(filename,'utf8')
const readdir = (dir: string) => fs.readdirSync(dir)
const join = (...paths: string[])=> path.join(...paths)
const if_f = (filename: string) => fs.lstatSync(filename).isFile()
const if_d =(dir: string) =>fs.lstatSync(dir).isDirectory()
