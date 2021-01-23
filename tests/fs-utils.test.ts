import path from "path"
import {ls,loadFiles} from "../src/fs-utils"
test("ls", ()=>{
    const dir = path.resolve(__dirname, "../site")
    const files = ls(dir, dir)
    expect(files.length > 0).toBeTruthy()
})

test("loadFiles", ()=>{
    const dir = path.resolve(__dirname, "../site/pages")
    const files = loadFiles(dir)
    expect(files.length > 0).toBeTruthy()
})