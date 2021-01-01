import path from "path"
import fs from "fs"
import liveServer from "live-server"
import * as chokidar from "chokidar"

const assetsdir = path.resolve(__dirname, "../site/assets")
const rootdir = path.resolve(__dirname, "../publish")

function watchHandler (event, pth: string){
    
    if (fs.statSync(pth).isFile()) {
        const sub = pth.substr(assetsdir.length)
        const distFileName = path.join(rootdir, sub)
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


var params = {
	port: 7001, // Set the server port. Defaults to 8080.
	root: rootdir, // Set root directory that's being served. Defaults to cwd.
	open: true, // When false, it won't load your browser by default.
	ignore: 'scss,my/templates', // comma-separated string for paths to ignore
	file: "404.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
	wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
	logLevel: 2 // 0 = errors only, 1 = some, 2 = lots
};

export default class DevServer {
    start(){
        chokidar.watch(assetsdir).on("all", (event, pth)=> {
            console.log(pth)
            watchHandler(event, pth)
          })
        liveServer.start(params);
    }
}

