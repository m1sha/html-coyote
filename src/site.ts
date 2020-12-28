import {ContentFile} from "./fs-utils"
import fs from "fs"
import path from "path"
import { PageCollection } from "./page"
import { LayoutCollection } from "./layout"
import { PartCollection } from "./part"
import { Content } from "./content"

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

    get content(){
        return new Content(loadfiles(join(this.path, "content")))
    }

    get publishPath(){
        return path.resolve(this.path, "../publish")
    }

    publishPage(name: string, html: string){
        const publishPath = this.publishPath
        mkdir(publishPath)
        const filename = join(publishPath, name + ".html")
        fs.writeFileSync(filename, html)
    }

    publishAssets(action: Function){
        const publishPath = this.publishPath
        const asstesPath = join(this.path, "assets")
        const files = []
        loadfilenames(files, asstesPath, asstesPath)
        for(let i = 0; i < files.length; i++){
            const file = files[i]
            let distFilename = join(publishPath, file.filename)
            let errorMessage = null;

            if (file.dir){
                try{
                    mkdir(join(publishPath, file.dir))
                } catch(e){
                    errorMessage = e.message
                }
               
               distFilename = join(publishPath, file.dir, file.filename)
            }

            try {
                cpy(file.fullFilename, distFilename)
            }
            catch(e){
                errorMessage = e.message
            }
            
            if (action){
                action(file.fullFilename, distFilename, errorMessage)
            }
        }
    }
}

const loadfiles = (dir: string): ContentFile[] => { 
    var files = ls(dir)
    const result = []
    for (let index = 0; index < files.length; index++) {
        let filename = files[index]
        const fullFilename = join(dir, filename)
        
        if (if_f(fullFilename)){
            if (filename.endsWith(".html")){
                filename = filename.substring(0, filename.length - 5)
            }
            result.push(new ContentFile(filename, fullFilename))
        }
        if (if_d(fullFilename)){
            loadfiles(fullFilename)
        }
    }

    return result
}

const loadfilenames = (items: any[], dir: string, root: string)=>{
    var files = ls(dir)
   
    for (let index = 0; index < files.length; index++) {
        const filename = files[index]
        const fullFilename = join(dir, filename)
        if (if_f(fullFilename)){
            items.push({filename, fullFilename, dir: root ? dir.substring(root.length) : dir})
        }

        if (if_d(fullFilename)){
            loadfilenames(items, fullFilename, root)
        }
    }
    
}


const join = (...paths: string[])=> path.join(...paths)
const ls = (dir: string) => fs.readdirSync(dir)
const if_f = (filename: string) => fs.lstatSync(filename).isFile()
const if_d = (dir: string) =>fs.lstatSync(dir).isDirectory()
const mkdir = (dir: string) => fs.mkdirSync(dir, { recursive: true })
const cpy = (src: string, dist: string) => fs.copyFileSync(src, dist)

