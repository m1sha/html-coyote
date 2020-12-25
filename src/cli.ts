import chalk from 'chalk'
export default class cli{
    static err(message: string){
        console.error(chalk.redBright(message))    
    }

    static succ(message: string){
        console.log(chalk.greenBright(message))    
    }

    static info(message: string){
        console.log(chalk.whiteBright(message))    
    }
}