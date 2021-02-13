import { Dictionary } from "./base-dictionary"
import { IDomAttribute, TemplateDomElement } from "./dom-provider"
import { iffalse, iftrue } from "./err"
import { ExpressionParser, ExpressionResolver } from "./expressions"
import { IContentFile } from "./fs-utils"
import { codeBlock } from "./msg"
import utils from "./utils"

export class TemplateProvider{
    readonly file: IContentFile
    readonly originalProvider: TemplateProvider
    
    constructor(file: IContentFile, originalProvider?: TemplateProvider){
        this.file = file
        this.originalProvider = originalProvider
    }
    
    resolveExpression(html: string, data: unknown): string{
        const parser = new ExpressionParser(/{{([\s\S]+?)}}/g)
        const resolver = new ExpressionResolver()

        for (const expr of parser.parse(html)){
            expr.replace(match => { 
                try{
                    return resolver.resolve(match.expression, data)
                } catch(e){
                    const filename = this.originalProvider ? this.originalProvider.file.name: this.file.name
                    const content = this.originalProvider ? this.originalProvider.file.content: this.file.content
                    codeBlock(html, content,  filename)
                    throw e
                }
            })
        }

        return parser.toString()
    }

    getTemplateInfo(template: TemplateDomElement): TemplateInfo{
    
        const attrs = new Dictionary<IDomAttribute>()
        const attrNames = ["if", "elif", "else", "loop", "slot", "markdown" ]
        for(const attrName of attrNames){
            const attrValue = template.getAttributeByName(attrName)
            attrs.add(attrName, attrValue)
        }
    
        return new TemplateInfo(this, attrs).validate()
    }
}

export class TemplateInfo {
    readonly hasIf: boolean
    readonly hasElif: boolean
    readonly hasElse: boolean
    readonly hasLoop: boolean
    readonly hasSlot: boolean
    readonly hasMarkdown: boolean
    readonly ifAttr: IDomAttribute
    readonly elifAttr: IDomAttribute
    readonly loopAttr: IDomAttribute
    readonly slotAttr: IDomAttribute
    readonly markdownAttr: IDomAttribute
    private provider: TemplateProvider
    private resolver = new ExpressionResolver()

    constructor(provider: TemplateProvider, attrs: Dictionary<IDomAttribute>) {
            this.provider = provider
            this.hasIf = attrs.exists("if")
            this.hasElif = attrs.exists("elif")
            this.hasElse = attrs.exists("else")
            this.hasLoop = attrs.exists("loop")
            this.hasSlot = attrs.exists("slot")
            this.hasMarkdown = attrs.exists("markdown")
            this.ifAttr = attrs.getValue("if")
            this.elifAttr = attrs.getValue("elif")
            this.loopAttr = attrs.getValue("loop")
            this.slotAttr = attrs.getValue("slot")
            this.markdownAttr = attrs.getValue("markdown")
    }

    validate(): TemplateInfo{
        iftrue(this.hasIf && (this.hasElif || this.hasElse), "Template has wrong statement 'if-elif-else'")
        iftrue(this.hasIf && (!this.ifAttr.value || !this.ifAttr.value.trim()), "Template hasn't contain 'if' condition")
        iftrue(this.hasLoop && (!this.loopAttr.value || !this.loopAttr.value.trim()), "Template hasn't contain 'loop' condition")

        return this
    }
    
    // eslint-disable-next-line
    getIfResult(data: unknown): boolean{
        iffalse(this.hasIf, "Template hasn't contain 'if' statement")
        
        let res = false
        try{
            res = this.resolver.resolve(this.ifAttr.value, data)
        }catch(e){
            const filename = this.provider.originalProvider ? this.provider.originalProvider.file.name:  this.provider.file.name
            const content = this.provider.originalProvider ? this.provider.originalProvider.file.content:  this.provider.file.content
            codeBlock(this.ifAttr.value, content,  filename)
            throw e
        }
        
        return !!res
    }

    // eslint-disable-next-line
    getLoopInfo(data: unknown){
        iffalse(this.hasLoop, "Template hasn't contain 'loop' statement")
        const info = utils.parseLoopStatement(this.loopAttr.value)
        let items = null
        try {
            items = this.resolver.resolve(info.items, data)
            if (!items) throw new Error(`${info.items} is null`)
        } catch (e) {
            const filename = this.provider.originalProvider ? this.provider.originalProvider.file.name:  this.provider.file.name
            const content = this.provider.originalProvider ? this.provider.originalProvider.file.content:  this.provider.file.content
            codeBlock(this.loopAttr.value, content,  filename)
            throw e
        }
        return {
            items,
            item: info.item
        }
    }

    get empty(): boolean {
        return !this.hasIf && !this.hasElif && !this.hasElse && !this.hasLoop && !this.hasSlot && !this.hasMarkdown
    }
}