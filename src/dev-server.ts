import path from "path"
import fs from "fs"
import liveServer from "live-server"
import * as chokidar from "chokidar"

function watchHandler (event, pth: string, publishDir: string, assetsDir: string){
    
    if (fs.statSync(pth).isFile()) {
        const sub = pth.substr(assetsDir.length)
        const distFileName = path.join(publishDir, sub)
        const dirName = path.dirname(distFileName)
        const srcCtime = fs.statSync(pth).ctime
        const distCtime = fs.statSync(distFileName).ctime
        if ( srcCtime > distCtime ){
           // fs.mkdirSync(dirName)
            fs.copyFileSync(pth, distFileName)
        
          console.log(dirName)
          console.log(distFileName)
        }
    }
}

export default class DevServer {
    baseDir: string
    port: number

    constructor (baseDir: string, port: number){
        this.baseDir = baseDir
        this.port = port
    }

    start(): void{
        const assetsDir = path.resolve(this.baseDir, "/assets")
        const publishDir = path.resolve(this.baseDir, "../publish")

        chokidar.watch(assetsDir).on("all", (event, pth)=> {
            console.log(pth)
            watchHandler(event, pth, publishDir, assetsDir)
        })

        const params = {
            port: 7001, // Set the server port. Defaults to 8080.
            root: publishDir, // Set root directory that's being served. Defaults to cwd.
            open: true, // When false, it won't load your browser by default.
            ignore: 'scss,my/templates', // comma-separated string for paths to ignore
            file: "404.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
            wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
            logLevel: 2 // 0 = errors only, 1 = some, 2 = lots
        };

        params.port = this.port
        liveServer.start(params);
    }
}