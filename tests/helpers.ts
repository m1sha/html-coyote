import { Layout } from "../src/layout"
import { ContentInMemory, IContentFile } from "../src/fs-utils"
import { Part, PartCollection } from "../src/part"
import { Page } from "../src/page"
import { Content } from "../src/content"
import { TemplateResolver } from "../src/template-resolver"
import { MdDocument } from "../src/md-document"

export function createLayout(name: string, content: string ): Layout{
    return new Layout(createFile(name, content))
}

export function createPage(name: string, content: string ): Page{
    return new Page(createFile(name, content))
}

export function createPart(name: string, content: string ): Part{
    return new Part(createFile(name, content))
}

export function createFile(name: string, content: string): IContentFile{
    return new ContentInMemory(name, content)
}

export function createParts(parts? : IContentFile[]): PartCollection{
    return new PartCollection(!parts ? []: parts)
}

export function createContent(files?: IContentFile[]): Content{
    return new Content(!files ? []: files)
}

export function createResolver(layout: Layout, page: Page, parts: PartCollection, content: Content):TemplateResolver{
    return new TemplateResolver(layout, page, parts, content)
}

export function createMd(name: string, content: string): MdDocument {
    return new MdDocument(createFile(name, content))
}