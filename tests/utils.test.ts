import utils from "../src/utils"

test("utils.preparing", ()=>{
    const data = [
        ["a===b", "data", "data.a===data.b"],
        ["foo===baz", "data", "data.foo===data.baz"],
        ["foo === baz", "data", "data.foo === data.baz"],
        ["__pageName===name && (date.day > 7)", "data", "data.__pageName===data.name && (data.date.day > 7)"],
        ["__pageName==='index'", "data", "data.__pageName==='index'"],
        [`__pageName==="index"`, "data", `data.__pageName==="index"`],
        [`__pageName=== "index"`, "data", `data.__pageName=== "index"`],
        ["!(bazz >= 0.001)", "data", "!(data.bazz >= 0.001)"],
    ]

    for (let i = 0; i < data.length; i++) {
        const value1 = data[i][0]
        const value2 = data[i][1]
        const value3 = data[i][2]
        expect(utils.preparing(value1, value2)).toEqual(value3)
    }
})

test("utils.parseLoopStatement. Loop = 'item of items'", () => {

    const value = utils.parseLoopStatement("item of items")
    expect(value).toEqual({
        item: "item",
        index: '',
        items: "items"
    })

    const value2 = utils.parseLoopStatement("key of   keys")
    expect(value2).toEqual({
        item: "key",
        index: '',
        items: "keys"
    })

})

test("utils.parseLoopStatement. Loop = '(item, index) of items'", () => {

    const value = utils.parseLoopStatement("(item, index) of items")
    expect(value).toEqual({
        item: "item",
        index: 'index',
        items: "items"
    })

    const value2 = utils.parseLoopStatement("(key, i) of  keys")
    expect(value2).toEqual({
        item: "key",
        index: 'i',
        items: "keys"
    })

})

test("getValueFromObjectSafely", ()=>{

    const data = {
        prop:{
            value: "value 1",
            sub: {
                count: 2
            }
        },
        propBool: true,
        propBool2: false
    }
    
    expect(utils.getValueFromObject(data, "prop.value")).toEqual("value 1")
    expect(utils.getValueFromObject(data, "prop.sub.count")).toEqual(2)
    expect(utils.getValueFromObject(data, "propBool")).toBeTruthy()
    expect(utils.getValueFromObject(data, "propBool2")).toBeFalsy()
})

test("getValueFromObject object undefine", ()=>{
    try {
        const data = {}
        utils.getValueFromObject(data, "items")
        expect(false).toBeTruthy()
    } catch (error) {
        expect(error.message).toEqual("Object items isn't define")
    }
})

test("getValueFromObject property undefine", ()=>{
    try {
        const data = {
            value:  {
                defineValue: true
            }
        }
        const define = utils.getValueFromObject(data, "value.defineValue")
        expect(define).toBeTruthy()
        utils.getValueFromObject(data, "value.undefineValue")
        expect(false).toBeTruthy()
    } catch (error) {
        expect(error.message).toEqual("Property undefineValue isn't define in value.undefineValue")
    }
})