import chalk from 'chalk'
export default class cli{
    static err(message: string): void{
        console.error(chalk.redBright(message))    
    }

    static succ(message: string): void{
        console.log(chalk.greenBright(message))    
    }

    static info(message: string): void{
        console.log(chalk.whiteBright(message))    
    }
}