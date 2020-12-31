import * as _ from "lodash"
import utils from "./utils"

export class TemplateProvider{

    applyTemplateData(html, data){
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

    validate(){
        if (this.hasIf && (this.hasElif || this.hasElse)){
            throw new Error("Template has wrong statement 'if-elif-else'")
        }

        if (this.hasIf && (!this.ifAttr.nodeValue || !this.ifAttr.nodeValue.trim())){
            throw new Error("Template hasn't contain 'if' condition")
        }

        if (this.hasLoop && (!this.loopAttr.nodeValue || !this.loopAttr.nodeValue.trim())){
            throw new Error("Template hasn't contain 'loop' condition")
        }

        return this
    }

    getIfResult(data: unknown): Boolean{
        if (!this.hasIf) throw new Error("Template hasn't contain 'if' statement")

        const value = utils.preparing(this.ifAttr.nodeValue, "data")
        const res = eval(value)
        return !!res
    }

    getLoopInfo(data: unknown){
        if (!this.hasLoop) throw new Error("Template hasn't contain 'lopp' statement")
        
        return utils.parseLoopStatement(this.loopAttr.nodeValue)
    }

    get empty() {
        return !this.hasIf && !this.hasElif && !this.hasElse && !this.hasLoop && !this.hasSlot
    }
}