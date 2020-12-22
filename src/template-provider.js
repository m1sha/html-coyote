const _ = require("lodash")

class TemplateProvider{
    applyTemplate(html, data){
        const comp =  _.template(html)
        return comp(data)
    }
}

module.exports = TemplateProvider