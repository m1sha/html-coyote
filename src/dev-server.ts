import path from "path"
import liveServer from "live-server"
import * as chokidar from "chokidar"

export default class DevServer {
    baseDir: string
    port: number

    constructor (baseDir: string, port: number){
        this.baseDir = baseDir
        this.port = port
    }

    start(changed: OnFileChanged): void{
        const watchItems = [
            { catalog: "assets", dir: path.join(this.baseDir, "/assets")},
            { catalog: "content", dir: path.join(this.baseDir, "/content")},
            { catalog: "layouts", dir: path.join(this.baseDir, "/layouts")},
            { catalog: "pages", dir: path.join(this.baseDir, "/pages")},
            { catalog: "parts", dir: path.join(this.baseDir, "/parts")}
        ]
        const publishDir = path.join(this.baseDir, "../publish")

        for(const item of watchItems){
            chokidar.watch(item.dir).on("all", (event, pth)=> {
                changed(new ChangeEvent(item.catalog, event, pth, publishDir, item.dir))
            })
        }

        const params = {
            port: 7001, // Set the server port. Defaults to 8080.
            root: publishDir, // Set root directory that's being served. Defaults to cwd.
            open: true, // When false, it won't load your browser by default.
            ignore: 'scss,my/templates', // comma-separated string for paths to ignore
            file: "404.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
            wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
            logLevel: 2 // 0 = errors only, 1 = some, 2 = lots
        } as liveServer.LiveServerParams;

        params.port = this.port
        liveServer.start(params);
    }
}

export type OnFileChanged = (e: ChangeEvent) => void

export class ChangeEvent {
    readonly catalog: string
    readonly event: string
    readonly pth: string
    readonly publishDir: string
    readonly assetsDir: string

    constructor (catalog: string, event: string, pth: string, publishDir: string, assetsDir: string){
        this.catalog = catalog
        this.event = event
        this.pth = pth
        this.publishDir = publishDir
        this.assetsDir = assetsDir
    }
}