const fs = require("fs")
const path = require("path")
const { PageCollection } = require("./page")
const { LayoutCollection } = require("./layout")
const { PartCollection } = require("./part")

class Site{
    constructor(basepath){
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

    publishPage(name, html){
        const publishPath = path.resolve(this.path, "../publish")
        mkdir(publishPath)
        const filename = join(publishPath, name + ".html")
        fs.writeFileSync(filename, html)
    }
}

const loadfiles = (dir) => { 
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

const rf = (filename) => fs.readFileSync(filename,'utf8')
const join = (...paths)=> path.join(...paths)
const ls = (dir) => fs.readdirSync(dir)
const if_f = (filename) => fs.lstatSync(filename).isFile()
const if_d = (dir) =>fs.lstatSync(dir).isDirectory()
const mkdir = (dir) => fs.mkdirSync(dir, { recursive: true })

class HtmlFile {
    constructor (name, fullName){
        this.name = name
        this.fullName = fullName
    }

    get content(){
        return rf(this.fullName)
    }
}

module.exports = Site