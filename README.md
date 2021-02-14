
[![Build Status](https://travis-ci.com/m1sha/html-coyote.svg?branch=main)](https://travis-ci.com/m1sha/html-coyote)

# ⚠️ Warning!!! ⚠️

The project is in active development and has a lot of bugs. Use it for informational purposes only. First working version will begin 0.1.x.
The release is scheduled for the first decade of April.

![HTML-Coyote](logo.png "HTML-Coyote")

# Introduction 

HTML-Coyote is a HTML static site generator

## Install

```bash
$ npm i -g html-coyote
```

## Getting Started

Create a directory for the site
```bash
$ mkdir html-coyote-example
$ cd html-coyote-example
```

Create the site from a default template and run it on development server
```bash
$ coyo new
$ coyo run

# Serving "./publish" at http://127.0.0.1:7001
```

Browse to http://127.0.0.1:7001

## Basic Usage

### Layouts
./site/layouts/layout.html
```html
<html>
    <head>
        <slot name="header"></slot>
    </head>
    <body>
        <nav>
            <template loop="item of menu">
                <menu-item name="{{item.name}}" url="{{item.url}}">
                    {{item.title}}
                </menu-item>
            </template>
        </nav>
        <slot name="content"></slot>
    </body>
</html>
```
### Pages
./site/pages/page.html
```html
<!--#layout=layout-->
<template slot="header">
    <title>{{ meta.title }}</title>
</template>

<template slot="content">
    <div>
        <template markdown></template>
    </div>
</template>
```
### Content
./site/content/index.md
```markdown
---
page: page
title: "HTML-Coyote: Home page"
---

# Home page
This is some content on the home page
```

./site/content/about.md
```markdown
---
page: page
title: "About page"
---

# About page
This is some content on the about page
```

./site/content/settings.yml
```yaml
menu:
    - { name: 'index', url: 'index.html', title: 'Home' }
    - { name: 'about', url: 'about.html', title: 'About' }
```

### Common Parts
./site/parts/menu-item.html
```html
<!--#
.name
.url
@content
-->

<template>
    <li>
        <template if="markdown.name === name">
            <span>{{content}}</span>
        </template>
        <template else>
            <a href="{{url}}">{{content}}</a>
        </template>
    </li>
</template>
```

## Build to Production

```bash
$ coyo publish
```

## Live Demo

[Go to Live Demo](https://html-coyote.github.io/demo/index.html)
