import * as _ from "lodash"


//_.templateSettings.evaluate =    /{{([\s\S]+?)}}/g
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g
//_.templateSettings.escape =      /{{-([\s\S]+?)}}/g

//a.evaluate = /{{([\\s\\S]+?)}}/g
const c = _.template("{{ name }}")
const h = c({__pageName: "n", name:"n"})
console.log(h)

const d = {__pageName: "n", name:"n"}
const r = eval("d.__pageName === d.name")
console.log(r)