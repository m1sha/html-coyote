import * as yaml from 'js-yaml'
import { Dictionary } from './base-dictionary';
import { IContentFile } from './fs-utils';

export class Content {
    protected dictionary: Dictionary<any>

    constructor(files: IContentFile[]) {
        this.dictionary = new Dictionary<any>()
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.name.endsWith('.yml')){
                this.dictionary.assign(toJson(file.content))
            }
        }
    }

    add(key: string, value: unknown){
        this.dictionary.add(key, value)
    }

    get data(){
        return this.dictionary.items
    }
}

function toJson(content: string): any{
   return yaml.safeLoad(content)
}