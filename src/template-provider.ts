import _ from "lodash"
import { iffalse, iftrue } from "./err"
import utils from "./utils"

export class TemplateProvider{
    // eslint-disable-next-line
    applyTemplateData(html: string, data): string{
        _.templateSettings.interpolate = /{{([\s\S]+?)}}/g
        const comp =  _.template(html)
        return comp(data)
    }

    getTemplateInfo(template: HTMLTemplateElement): TemplateInfo{
        
        const ifAttr = template.attributes.getNamedItem("if")
        const elifAttr = template.attributes.getNamedItem("elif")
        const elseAttr = template.attributes.getNamedItem("else")
        const loopAttr = template.attributes.getNamedItem("loop")
        const slotAttr = template.attributes.getNamedItem("slot")
    
        return new TemplateInfo(ifAttr, elifAttr, elseAttr, loopAttr, slotAttr).validate()
    }
}

export class TemplateInfo {
    readonly hasIf: boolean
    readonly hasElif: boolean
    readonly hasElse: boolean
    readonly hasLoop: boolean
    readonly hasSlot: boolean
    readonly ifAttr: Attr
    readonly elifAttr: Attr
    readonly loopAttr: Attr
    readonly slotAttr: Attr

    constructor(
        ifAttr: Attr,
        elifAttr: Attr,
        elseAttr: Attr,
        loopAttr: Attr,
        slotAttr: Attr) {
            this.hasIf = !!ifAttr
            this.hasElif = !!elifAttr
            this.hasElse = !!elseAttr
            this.hasLoop = !!loopAttr
            this.hasSlot = !!slotAttr
            this.ifAttr = ifAttr
            this.elifAttr = elifAttr
            this.loopAttr = loopAttr
            this.slotAttr = slotAttr
    }

    validate(): TemplateInfo{
        iftrue(this.hasIf && (this.hasElif || this.hasElse), "Template has wrong statement 'if-elif-else'")
        iftrue(this.hasIf && (!this.ifAttr.nodeValue || !this.ifAttr.nodeValue.trim()), "Template hasn't contain 'if' condition")
        iftrue(this.hasLoop && (!this.loopAttr.nodeValue || !this.loopAttr.nodeValue.trim()), "Template hasn't contain 'loop' condition")

        return this
    }
    
    // eslint-disable-next-line
    getIfResult(data: unknown): boolean{
        iffalse(this.hasIf, "Template hasn't contain 'if' statement")

        const value = utils.preparing(this.ifAttr.nodeValue, "data")
        const res = eval(value)
        return !!res
    }

    // eslint-disable-next-line
    getLoopInfo(data: unknown){
        iffalse(this.hasLoop, "Template hasn't contain 'lopp' statement")
        
        return utils.parseLoopStatement(this.loopAttr.nodeValue)
    }

    get empty(): boolean {
        return !this.hasIf && !this.hasElif && !this.hasElse && !this.hasLoop && !this.hasSlot
    }
}