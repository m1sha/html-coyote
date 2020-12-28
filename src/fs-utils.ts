import fs from "fs"

export class ContentFile implements IContentFile{
    name: string
    fullName: string

    constructor (name: string, fullName: string){
        this.name = name
        this.fullName = fullName
    }

    get content(): string{
        return u.read(this.fullName)
    }
}

export class ContentInMemory implements IContentFile{
    name: string
    fullName: string
    content: string
    constructor (name: string, content: string){
        this.name = name
        this.fullName = name
        this.content = content
    }
}

export interface IContentFile {
    name: string
    fullName: string
    content: string
}

const u = {
    read: (filename: string) => fs.readFileSync(filename,'utf8')
}