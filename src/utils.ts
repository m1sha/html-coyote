import * as yaml from 'js-yaml'
export default class utils {
  static parseLoopStatement(value: string): ILoopInfo { //TODO Rewrite method 'parseLoopStatement'
      if (!value){
        throw new Error(`Empty loop statement`)
      }
      
      if (value.indexOf(' of ') < 0 ){
        throw new Error(`loop statement must contain keyword 'of'`)
      }

      const params = value.split(" ").filter(p=>p)
      if (params.length === 3){
         return {
             item: params[0],
             index: '',
             items: params[2]
         }
      }

      if (params.length === 4){
        return {
            item: params[0].replace("(","").replace(",",""),
            index: params[1].replace(")",""),
            items: params[3]
        }
      }
     
      throw new Error(`Error parameters count`)
  }
    
  static preparing(value: string, objName: string): string{
    if (!value) return value
    let result = ""
    let wasLetter = false
    let scopOpen1 = false
    let scopOpen2 = false
    for (let i = 0; i < value.length; i++) {
        const chr = value.substr(i, 1)

        if (chr==="'"){
            scopOpen1 = !scopOpen1
            result += chr
            continue
        }

        if (chr==='"'){
            scopOpen2 = !scopOpen2
            result += chr
            continue
        }

        if (scopOpen1 || scopOpen2){
            result += chr
            continue
        }

        if ((chr >= 'a' && chr <= 'z') || (chr >= 'A' && chr <= 'Z') || chr === '_' ){
            if (!wasLetter){
                result += objName+ "." + chr
                wasLetter = true
                continue
            }

            result += chr
            continue
        }

        if (chr === '.'){
            result += chr
            continue
        }

        result += chr
        wasLetter = false
    }
    
    return result
  }

  static toJson(value: string): unknown{
    return yaml.safeLoad(value)
  }

  static getValueFromObjectSafely(obj: unknown, propName: string): unknown{
    const name = propName.trim()
    if (!name) throw new Error("null argument exception: utils.getValueFromObject(...,propName)")
    if (!obj) return null
    if (name.indexOf('.') < 0) return obj[name]
    const subprops = name.split(".")
    let result = obj[subprops[0]]
    if (subprops.length > 1) 
      for (let i = 1; i < subprops.length; i++) {
        if (!result) return null
        const prop = subprops[i];
        result = result[prop]
      }
    return result
  }
}

interface ILoopInfo{
  item: string
  index: string
  items: string
}