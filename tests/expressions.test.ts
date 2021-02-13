import { ExpressionParser, ExpressionResolver } from "../src/expressions"

test("expression parser test", ()=>{
   const parser = new ExpressionParser(/{{([\s\S]+?)}}/g)
   const exprs = parser.parse("{{greet}}, {{   name   }} my name is {{ name2 }}. How do you do?.\n Sincerely, {{name2}}. ({{ 1 + 1}})")
   for (const expr of exprs){
        expr.replace(match => {
            switch(match.expression){
                case "greet": return "Hi!"
                case "name":  return "Bob"
                case "name2": return "Sam"
                case "1 + 1": return "2"
                default: throw new Error(`${match} isn't expected`)
            }
        })
   }
   const result = parser.toString()
   expect(result).toEqual("Hi!, Bob my name is Sam. How do you do?.\n Sincerely, Sam. (2)")
})

test("expression resolver test", ()=> {
    const resolver = new ExpressionResolver()
    const value = resolver.resolve("1 + 1", {})
    expect(value).toEqual(2)

    const value2 = resolver.resolve("1 + a.b", { a: { b: 2 }})
    expect(value2).toEqual(3)
})

test("expression resolver & parser test", ()=>{
    const parser = new ExpressionParser(/{{([\s\S]+?)}}/g)
    const exprs = parser.parse("{{greet}}, {{   name   }} my name is {{ name === 'Joe'? name2: '' }}. How do you do?.\n Sincerely, {{name2}}. ({{ 2 + 2 }})")
    const resolver = new ExpressionResolver()
    const data = {
        greet: "Hello!",
        name: "Joe",
        name2: "Samantha"
    }
    for (const expr of exprs){
        expr.replace(match => resolver.resolve(match.expression, data))
    }
    const result = parser.toString()
    expect(result).toEqual("Hello!, Joe my name is Samantha. How do you do?.\n Sincerely, Samantha. (4)")
})

