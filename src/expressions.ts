import utils from "./utils"

export class ExpressionResolver{
    // eslint-disable-next-line
    resolve<T>(expression: string, data: unknown): T{
        const value = utils.preparing(expression, "data")
        try {
            return eval(value) as T
        }catch(e){
            throw new ExpressionError(e.message, expression)
        }
        
    }
}

export class ExpressionParser {
    readonly regex: RegExp
    private input: StringObject

    constructor(regex: RegExp){
        this.regex = regex
    }

    parse(input: string): ExpressionCollection{
        this.input = new StringObject(input)
        const result = new ExpressionCollection(this.regex, this.input)
        let match: RegExpExecArray
        
        while((match = this.regex.exec(this.input.value)) != null){
            result.add(match)
        }

        return result
    }

    toString(): string{
        return this.input.toString()
    }
}

class StringObject{
    value: string
    constructor(value: string){
        this.value = value
    }

    toString(): string{
        return this.value
    }
}

export class Expression{
    startPos: number
    endPos: number
    readonly value: string
    readonly expression: string
    readonly scopeLength: number
    readonly index: number
    readonly collection: ExpressionCollection

    constructor(match: RegExpExecArray, collection: ExpressionCollection, index: number){
        this.collection = collection
        this.scopeLength = match.length
        this.startPos = match.index
        this.endPos = collection.regex.lastIndex
        this.value = collection.input.value.substring(this.startPos, this.endPos)
        this.expression = collection.input.value.substring(this.startPos + this.scopeLength, this.endPos - this.scopeLength).trim()
        this.index = index
    }

    replace(action: ExpressionCallback): void{
        const value = action(this)
        const dx = (value ? value.length : 0) - this.value.length
        const leftPart = this.collection.input.value.substring(0, this.startPos)
        const rightPart = this.collection.input.value.substring(this.endPos, this.collection.input.value.length)
        this.collection.input.value = leftPart + value + rightPart
        this.collection.shift(this.index + 1, dx)
    }
}

export class ExpressionCollection {
    readonly regex: RegExp
    readonly input: StringObject
    private items: Expression[]
    private index: number
   

    constructor(regex: RegExp, input: StringObject){
        this.regex = regex
        this.input = input
        this.index = 0
        this.items = []
        
    }

    [Symbol.iterator](): IterableIterator<Expression>{
        let position = 0
        return {
            next: () =>{
                const can = position < this.items.length
                return {
                    done: !can,
                    value: can ? this.items[position++] : null
                } 
            }
        } as IterableIterator<Expression>
    }
    
    add(match: RegExpExecArray): void{
        this.items.push(new Expression(match, this, this.index++))
    }

    shift(index: number, dx: number): void{
        if (index >= this.items.length){
            return
        }

        for (let i = index; i< this.items.length; i++){
            this.items[i].startPos += dx
            this.items[i].endPos += dx
        }
    }
}

export class ExpressionError extends Error{
    readonly expression: string
    constructor(message: string, expression: string){
        super(message)
        this.expression = expression
    }
}

export type ExpressionCallback = (expression: Expression) => string