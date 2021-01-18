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
