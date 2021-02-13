import chalk from 'chalk'

export function fail(message: string): void{
    console.error(chalk.redBright(message))    
}

export function succ(message: string): void{
    console.log(chalk.greenBright(message))    
}

export function info(message: string): void{
    console.log(chalk.whiteBright(message))    
}

export function log(obj: unknown, message: string): void{
    console.log(chalk.blueBright(message))    
    console.dir(obj)
}

export function debug(message: string): void{
    console.log(chalk.blueBright(message))    
}

export function codeBlock(fragment: string, code: string, filename: string): void{
    const num = getLineNumberInCode(fragment, code)
    const output = `
filename: ${filename} line: ${chalk.yellowBright(num)}
${chalk.whiteBright('-->')}
${chalk.yellowBright(fragment)} 
${chalk.whiteBright('<--')}`

    console.log(output)
}

function getLineNumberInCode(fragment: string, code: string): number{
    const lines = code.split("\n")
    let result = -1
    for(let i=0; i<lines.length; i++){
        const line = lines[i]
        if (line.indexOf(fragment)){
            result = i
        }
    } 
    return result
}
