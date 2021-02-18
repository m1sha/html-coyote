import { ContentInMemory } from "../src/fs-utils"
import {createContent} from "./helpers"

test("Content class", () => {
    const fileContent = `
#menu items
menu:
    - { name: 'index', href: 'index.html', text: 'Home' }
    - { name: 'about', href: 'about.html', text: 'About' }
    - { name: 'contacts', href: 'contacts.html', text: 'Contacts' }
`
    const fileContent2 = `
foo: true
`
    const content = createContent([
        new ContentInMemory("menu.yml", fileContent),
        new ContentInMemory("foo.yml", fileContent2)
    ])
    
    expect(content.data.menu).toBeDefined()
    expect(content.data.foo).toBeTruthy()
})

test("Content add data", () => {
    const content = createContent()
    content.add("__pageName", "foo")

    expect(content.data.__pageName).toEqual("foo")
})