import {ContentFile} from "./fs-utils"

export abstract class BaseCollection<T> {

    items: T[]
    length: number

    constructor(files: ContentFile[]){
        this.items = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            this.items.push(this.createItem(file))
        }
        this.length = this.items.length
    }

    abstract createItem(file: ContentFile): T

    [Symbol.iterator](): IterableIterator<T>{
        let index = 0;
        return  {
          next: () => {
            if (index < this.items.length) {
              return {value: this.items[index++], done: false}
            } else {
              return {done: true}
            }
          }
        } as IterableIterator<T>
    }
    
    add(item: T): this & BaseCollection<T>{
      this.items.push(item)
      return this;
    }
}