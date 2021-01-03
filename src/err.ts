export function err(message: string): void{
    throw new Error(message)
}

export function ifnull(value: unknown, message: string): void{
    if (!value) err(message)
}

export function ifdef(value: unknown, message: string): void{
    if (value) err(message)
}

export function ifeq(value1: unknown,value2: unknown, message: string): void{
    if (value1 === value2) err(message)
}

export function iftrue(value: boolean, message: string): void{
    if (value) err(message)
}

export function iffalse(value: boolean, message: string): void{
    if (!value) err(message)
}
