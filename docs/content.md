# The Content

The content may contain a YAML and/or Markdown documents.

Data from YAML files loaded to memory and accessible all time however a Markdown document used as template for the specific page.

For example the code bellow show us how we can create a menu using the YAML.

./content/menu.yml
```yaml
menu:
    - { text: 'Home',  url: 'index.html' }
    - { text: 'Blog',  url: 'blog.html' }
    - { text: 'About', url: 'about.html' }
```

./layouts/layout.html
```html
<html>
    <body>
        <nav>
            <ul>
                <template loop="item of menu">
                    <li>
                        <a href="{{item.url}}">{{item.text}}</a>
                    </li>
                </template>
            </ul>
        </nav>
    </body>
</html>
```

## Using Markdown files as a template for same pages generation

./content/post-2021-06-01.md
```markdown
---
page: post
title: 'Post 1'

---

# Post 1
## sub 1
The text text 
## sub 2
```

./pages/post.html
```html
<template slot="header">
    <title>{{md.title}}</title>
    <link rel="stylesheet" href="css/github-markdown.css">
</template>
<template slot="content">
    <div class="markdown-body">
        <template markdown></template>
    </div>
</template>
```