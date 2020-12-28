export default class utils {
    
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
}