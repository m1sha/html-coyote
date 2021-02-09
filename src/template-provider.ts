import _ from "lodash"
import { IDomAttribute, TemplateDomElement } from "./dom-provider"
import { iffalse, iftrue } from "./err"
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

    // eslint-disable-next-line
    applyTemplateData(html: string, data): string{
        _.templateSettings.interpolate = /{{([\s\S]+?)}}/g
        const comp =  _.template(html)
        return comp(data)
    }

    getTemplateInfo(template: TemplateDomElement): TemplateInfo{
    
        const ifAttr = template.getAttributeByName("if")
        const elifAttr = template.getAttributeByName("elif")
        const elseAttr = template.getAttributeByName("else")
        const loopAttr = template.getAttributeByName("loop")
        const slotAttr = template.getAttributeByName("slot")
        const markdownAttr = template.getAttributeByName("markdown")
    
        return new TemplateInfo(this, ifAttr, elifAttr, elseAttr, loopAttr, slotAttr, markdownAttr).validate()
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

    constructor(
        provider: TemplateProvider,
        ifAttr: IDomAttribute,
        elifAttr: IDomAttribute,
        elseAttr: IDomAttribute,
        loopAttr: IDomAttribute,
        slotAttr: IDomAttribute,
        markdownAttr: IDomAttribute) {
            this.provider = provider
            this.hasIf = !!ifAttr
            this.hasElif = !!elifAttr
            this.hasElse = !!elseAttr
            this.hasLoop = !!loopAttr
            this.hasSlot = !!slotAttr
            this.hasMarkdown = !!markdownAttr
            this.ifAttr = ifAttr
            this.elifAttr = elifAttr
            this.loopAttr = loopAttr
            this.slotAttr = slotAttr
            this.markdownAttr = markdownAttr
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
        
        const value = utils.preparing(this.ifAttr.value, "data")
        let res = false
        try{
            res = eval(value)
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
            items = utils.getValueFromObject(data, info.items)
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