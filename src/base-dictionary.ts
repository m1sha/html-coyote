export class  Dictionary<TValue>  {
    
    items: KeyValuePairs<TValue>

    constructor() {
        this.items = {}
    }
    
    add(key: string, value: TValue): void{
        this.items[key] = value
    }

    assign(obj: any){
        Object.assign(this.items, obj)
    }

    getValue(key: string): TValue{
        return this.items[key]
    }

    exists(key: string): boolean{
        return !!this.items[key]
    }
}

export interface KeyValuePairs<TValue>{
    [key: string]: TValue
}

