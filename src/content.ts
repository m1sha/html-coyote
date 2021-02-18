
import { Dictionary, KeyValuePairs } from './base-dictionary'
import { ContentType, IContentFile } from './fs-utils'
import { MdDocumentCollection } from './md-document'
import utils from './utils'

export class Content {
    protected dictionary: Dictionary<unknown>
    readonly documents: MdDocumentCollection

    constructor(files: IContentFile[]) {
        this.dictionary = new Dictionary<unknown>()
        const mds = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            if (file.type === ContentType.YAML){
                this.dictionary.assign(utils.toJson(file.content))
            }
            
            if (file.type === ContentType.MD){
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