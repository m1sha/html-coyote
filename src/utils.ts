import * as yaml from 'js-yaml'
export default class utils {
  static parseLoopStatement(value: string): ILoopInfo {
      if (!value){
        throw new Error(`Empty loop statement`)
      }
      
      if (value.indexOf(' of ') < 0 ){
        throw new Error(`loop statement must contain keyword 'of'`)
      }

      let matches = /([a-zA-Z1-9]+?)\s+of\s+([a-zA-Z1-9.]+)\s*$/.exec(value)
      if (!matches){
        matches = /^\(\s*([a-zA-Z0-9]+)\s*,\s*([a-zA-Z0-9]+)\s*\)\s+of\s+([a-zA-Z0-9.]+)\s*$/.exec(value)
        if (!matches)
          throw new Error(`The loop '${value}' has a syntax error`)
      }
      
      if (matches.length === 3){
         return {
             item: matches[1],
             index: '',
             items: matches[2]
         }
      }

      if (matches.length === 4){
        return {
            item: matches[1],
            index: matches[2],
            items: matches[3]
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

  static getValueFromObject(obj: unknown, propName: string): unknown{
    const name = propName.trim()
    if (!name) throw new Error("null argument exception: utils.getValueFromObject(...,propName)")
    if (!obj) return null
    if (name.indexOf('.') < 0) {
      if (!Object.prototype.hasOwnProperty.call(obj, name)) 
        throw new Error(`Object ${name} isn't define`)
      return obj[name]
    }
    const keys = name.split(".")
    if (!Object.prototype.hasOwnProperty.call(obj, keys[0])) 
        throw new Error(`Object ${keys[0]} isn't define`)

    let result = obj[keys[0]]
    if (keys.length > 1) 
      for (let i = 1; i < keys.length; i++) {
        if (!result) return null

        const key = keys[i];
        if (!Object.prototype.hasOwnProperty.call(result, key)) 
          throw new Error(`Property ${key} isn't define in ${name}`)
          
        result = result[key]
      }
    return result
  }
}

interface ILoopInfo{
  item: string
  index: string
  items: string
}