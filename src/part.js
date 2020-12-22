const TemplateProvider = require("./template-provider")
class Part extends TemplateProvider {
    constructor({name, content}){
        super()
        
        this.name = name
        this.attrs = []
        const lines = content.split("\n")
        let s = false
        let l = 0;
        for(let i=0; i<lines.length; i++){
           const line = lines[i].replace("\r", "")
           if (line.startsWith("--")){
               if (s){
                   l = i
                   break
               }

               s = true
               continue
           }
           const attr = line.trim();
           if (!attr){
               continue
           }

           this.attrs.push(attr)
        }

        this.template = lines.slice( l + 1).join("\n")
    }
}

class PartCollection {
    constructor(files){
        this.items = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            this.items.push(new Part(file))
        }
        this.length = this.items.length
    }

    [Symbol.iterator](){
        let index = 0;
        return {
          next: () => {
            if (index < this.items.length) {
              return {value: this.items[index++], done: false}
            } else {
              return {done: true}
            }
          }
        }
    }
}

module.exports = { Part, PartCollection }