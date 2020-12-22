const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class Layout{
    constructor({name, content}){
        this.name = name
        this.content = content
    }

    init(){
        this.dom = new JSDOM(this.content)
        const { document } = this.dom.window
        this.document = document
        return this
    }

    data(data){
        this._data = data
        return this
    }

    applyPage({templates}){
        const slots = this.document.getElementsByTagName("slot")
        while(slots.length > 0){
            const slot = slots[0]
            const frag = templates[slot.name]
            slot.replaceWith(JSDOM.fragment(frag))
        }
        
        return this
    }

    applyParts(parts){

        for(const part of parts){
           const elems = this.document.getElementsByTagName(part.name)
           const attrs = part.attrs
           while  (elems.length > 0){
            const elem = elems[0]
            const data = {... this._data}
            for(let a = 0; a< attrs.length; a++){
                const attr = attrs[a]
                const value = attr.startsWith("@") ? elem.innerHTML : elem.attributes[attr].nodeValue
                if (!value){
                    continue
                }

                const attrName = attr.startsWith("@") ? attr.substring(1) : attr

                data[attrName] = value
            }

            const partHtml = part.applyTemplate(part.template, data)

            elem.replaceWith(JSDOM.fragment(partHtml))

           }
        }
        
        return this
    }

    build(){
        return this.dom.serialize()
    }

}

class LayoutCollection{
    constructor(files){
        this.items = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            this.items.push(new Layout(file))
        }
        this.length = this.items.length
    }

    getLayout(name){
        const result = this.items.filter(p=>p.name === name)[0]
        if (!result) throw new Error(`Layout ${name} wasn't found`) 
        
        return result // new Layout(result) //As copy
    }

}


module.exports = {Layout, LayoutCollection}