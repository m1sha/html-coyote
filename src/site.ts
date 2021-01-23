import {loadFiles, ls} from "./fs-utils"
import fs from "fs"
import path from "path"
import { PageCollection } from "./page"
import { LayoutCollection } from "./layout"
import { PartCollection } from "./part"
import { Content } from "./content"

export class Site{
    path: string

    constructor(baseDir: string){
        this.path = baseDir
    }

    get pages(): PageCollection{
        return new PageCollection(loadFiles(join(this.path, "pages")))
    }

    get parts(): PartCollection{
        return new PartCollection(loadFiles(join(this.path, "parts")))
    }

    get layouts(): LayoutCollection{
        return new LayoutCollection(loadFiles(join(this.path, "layouts")))
    }

    get content(): Content{
        return new Content(loadFiles(join(this.path, "content")))
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
        const assetsPath = join(this.path, "assets")
        Site.copy(assetsPath, publishPath, action)
    }

    static export(distDir: string, action: CallableFunction): void{
        const srcDir = path.resolve(__dirname, "../site")
        distDir = path.resolve(distDir, "site")
        mkdir(distDir)
        Site.copy(srcDir, distDir, action)
    }

    static copy(src: string, dist: string, action: CallableFunction): void{
        const files = ls(src, src)
        for(let i = 0; i < files.length; i++){
            const file = files[i]
            let distFilename = join(dist, file.name)
            let errorMessage = null;

            if (file.dir){
                try{
                    mkdir(join(dist, file.dir))
                } catch(e){
                    errorMessage = e.message
                }
               
               distFilename = join(dist, file.dir, file.name)
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