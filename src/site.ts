import fs from "fs"
import path from "path"
import { PageCollection } from "./page"
import { LayoutCollection } from "./layout"
import { PartCollection } from "./part"

export class Site{
    path: string

    constructor(basepath: string){
        this.path = path.resolve(__dirname, basepath)
    }

    get pages(){
        return new PageCollection(loadfiles(join(this.path, "pages")))
    }

    get parts(){
        return new PartCollection(loadfiles(join(this.path, "parts")))
    }

    get layouts(){
        return new LayoutCollection(loadfiles(join(this.path, "layouts")))
    }

    publishPage(name: string, html: string){
        const publishPath = path.resolve(this.path, "../publish")
        mkdir(publishPath)
        const filename = join(publishPath, name + ".html")
        fs.writeFileSync(filename, html)
    }
}

const loadfiles = (dir: string) => { 
    var files = ls(dir)
    const result = []
    for (let index = 0; index < files.length; index++) {
        let filename = files[index]
        const fullFilename = join(dir, filename)
        
        if (if_f(fullFilename)){
            if (filename.endsWith(".html")){
                filename = filename.substring(0, filename.length - 5)
            }
            result.push(new HtmlFile(filename, fullFilename))
        }
        if (if_d(fullFilename)){
            loadfiles(fullFilename)
        }
    }

    return result
}

const rf = (filename: string) => fs.readFileSync(filename,'utf8')
const join = (...paths: string[])=> path.join(...paths)
const ls = (dir: string) => fs.readdirSync(dir)
const if_f = (filename: string) => fs.lstatSync(filename).isFile()
const if_d = (dir: string) =>fs.lstatSync(dir).isDirectory()
const mkdir = (dir: string) => fs.mkdirSync(dir, { recursive: true })

export class HtmlFile {
    name: string
    fullName: string

    constructor (name: string, fullName: string){
        this.name = name
        this.fullName = fullName
    }

    get content(){
        return rf(this.fullName)
    }
}

