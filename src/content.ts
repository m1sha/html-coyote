
import { Dictionary, KeyValuePairs } from './base-dictionary';
import { IContentFile } from './fs-utils';
import { MdDocumentCollection } from './md-document';
import utils from './utils';

export class Content {
    protected dictionary: Dictionary<unknown>
    readonly documents: MdDocumentCollection

    constructor(files: IContentFile[]) {
        this.dictionary = new Dictionary<unknown>()
        const mds = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.name.endsWith('.yml')){
                this.dictionary.assign(utils.toJson(file.content))
            }
            
            if (file.name.endsWith(".md") || file.name.endsWith(".markdown")){
                mds.push(file)
            }
        }
        this.documents = new MdDocumentCollection(mds)
    }

    add(key: string, value: unknown): void{
        this.dictionary.add(key, value)
    }

    get data(): KeyValuePairs<unknown>{
        return this.dictionary.items
    }
}