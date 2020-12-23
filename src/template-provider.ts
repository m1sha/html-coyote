import * as _ from "lodash"

export default class TemplateProvider{

    constructor(){

    }

    applyTemplate(html, data){
        const comp =  _.template(html)
        return comp(data)
    }
}