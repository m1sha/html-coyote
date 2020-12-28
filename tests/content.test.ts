import { ContentInMemory } from "../src/fs-utils"
import { Content } from "../src/Content"

test("Content class", () => {
    const filecontent = `
#menu items
menu:
    - { name: 'index', href: 'index.html', text: 'Home' }
    - { name: 'about', href: 'about.html', text: 'About' }
    - { name: 'contacts', href: 'contacts.html', text: 'Contacts' }
    - { name: 'galary', href: 'galary.html', text: 'Galary' }
`
    const filecontent2 = `
foo: true
`
    const content = new Content([
        new ContentInMemory("menu.yml", filecontent),
        new ContentInMemory("foo.yml", filecontent2)
    ])
    
    expect(content.data.menu).toBeDefined();
    expect(content.data.foo).toBeTruthy();
})

test("Content add data", () => {
    const content = new Content([])
    content.add("__pageName", "foo")

    expect(content.data.__pageName).toEqual("foo")
})