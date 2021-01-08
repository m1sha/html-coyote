import {loadfiles, ls} from "./fs-utils"
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

    get pages(): PageCollection{
        return new PageCollection(loadfiles(join(this.path, "pages")))
    }

    get parts(): PartCollection{
        return new PartCollection(loadfiles(join(this.path, "parts")))
    }

    get layouts(): LayoutCollection{
        return new LayoutCollection(loadfiles(join(this.path, "layouts")))
    }

    get content(): Content{
        return new Content(loadfiles(join(this.path, "content")))
    }

    get publishPath(): string{
        return path.resolve(this.path, "../publish")
    }

    publishPage(name: string, html: string): void{
        const publishPath = this.publishPath
        mkdir(publishPath)
        const filename = join(publishPath, name + ".html")
        fs.writeFileSync(filename, html)
    }

    publishAssets(action: CallableFunction): void{
        const publishPath = this.publishPath
        const asstesPath = join(this.path, "assets")
        const files = ls(asstesPath, asstesPath)
        for(let i = 0; i < files.length; i++){
            const file = files[i]
            let distFilename = join(publishPath, file.name)
            let errorMessage = null;

            if (file.dir){
                try{
                    mkdir(join(publishPath, file.dir))
                } catch(e){
                    errorMessage = e.message
                }
               
               distFilename = join(publishPath, file.dir, file.name)
            }

            try {
                cpy(file.fullName, distFilename)
            }
            catch(e){
                errorMessage = e.message
            }
            
            if (action){
                action(file.fullName, distFilename, errorMessage)
            }
        }
    }
}

const join = (...paths: string[])=> path.join(...paths)
const mkdir = (dir: string) => fs.mkdirSync(dir, { recursive: true })
const cpy = (src: string, dist: string) => fs.copyFileSync(src, dist)