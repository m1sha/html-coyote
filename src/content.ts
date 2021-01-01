import * as yaml from 'js-yaml'
import { Dictionary, KeyValuePairs } from './base-dictionary';
import { IContentFile } from './fs-utils';

export class Content {
    protected dictionary: Dictionary<unknown>

    constructor(files: IContentFile[]) {
        this.dictionary = new Dictionary<unknown>()
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.name.endsWith('.yml')){
                this.dictionary.assign(toJson(file.content))
            }
        }
    }

    add(key: string, value: unknown): void{
        this.dictionary.add(key, value)
    }

    get data(): KeyValuePairs<unknown>{
        return this.dictionary.items
    }
}

function toJson(content: string): unknown{
   return yaml.safeLoad(content)
}