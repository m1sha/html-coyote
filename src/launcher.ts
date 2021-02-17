import { run } from "./main"

if (process.env.run){
    const port = parseInt(process.env.run)
    run(true, port)
}

if (process.env.publish){
    run(false, 0)
}