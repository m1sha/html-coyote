import { Dictionary } from "../src/base-dictionary"

test("dictionary type. Add value", ()=> {
    const dic = new Dictionary<boolean>()
    dic.add("foo", true)
    dic.add("bar", false)
    expect(dic.items["foo"]).toBe(true)
    expect(dic.items["bar"]).toBe(false)
})

test("dictionary type. Exist value", ()=> {
    const dic = new Dictionary<unknown>()
    dic.add("foo", { bar: "bazz"})
    expect(dic.exists("foo")).toBeTruthy()
    expect(dic.exists("bar")).toBeFalsy()
})

test("dictionary type. Get value", ()=> {
    const dic = new Dictionary<unknown>()
    const foo = {bar: "bazz"}
    dic.add("foo", foo)
    expect(dic.getValue("foo")).toBe(foo)
    expect(dic.getValue("bar")).toBeUndefined()
})