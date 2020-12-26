import * as _ from "lodash"

test("templateSettings.interpolate", ()=> {
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g
    const c = _.template("{{ name }}")
    const h = c({__pageName: "n", name:"n"})
    expect(h).toBe("n")
})

test("d.__pageName === d.name", ()=> {
    const d = {__pageName: "n", name:"n"}
    const r = eval("d.__pageName === d.name")
    expect(r).toBe(true)
})