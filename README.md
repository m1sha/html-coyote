# Simple Static

Simple Static is a HTML static site generator

## Basic usage

layout.html
```html
<html>
    <head>
        <title>
            <slot name="title"></slot>
        </title>
    </head>
    <body>
        <slot name="content"></slot>
    </body>
</html>
```

index.html
```html
<template slot="title">
    This is Index page
</template>

<template slot="content">
    <h1>Index Page Header</h1>
    <p>Some content</p>
</template>
```