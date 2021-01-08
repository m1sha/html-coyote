import path from "path"
import {ls,loadfiles} from "../src/fs-utils"
test("ls", ()=>{
    const dir = path.resolve(__dirname, "../site")
    const files = ls(dir, dir)
    expect(files.length > 0).toBeTruthy()
})

test("loadfiles", ()=>{
    const dir = path.resolve(__dirname, "../site/pages")
    const files = loadfiles(dir)
    expect(files.length > 0).toBeTruthy()
})