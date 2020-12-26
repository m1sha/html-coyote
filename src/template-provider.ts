import * as _ from "lodash"

export default class TemplateProvider{

    constructor(){

    }

    applyTemplate(html, data){
        _.templateSettings.interpolate = /{{([\s\S]+?)}}/g
        const comp =  _.template(html)
        return comp(data)
    }
}