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
        const value1 = data[i][0];
        const value2 = data[i][1];
        const value3 = data[i][2];
        expect(utils.preparing(value1, value2)).toEqual(value3)
    }
})

