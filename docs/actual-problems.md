# Actual Problem List

## 1. Elements Nested Problem

In layouts
```html
<ul>
    <template loop="item of items">
        <li>
            {{item.name}}
            <slot name="some-slot"></slot>
        </li>
    </template>
</ul>
```

In pages
```html
<ul>
    <template loop="item of items">
        <li>
            <template this-page="{{item.name}}">
               {{item.name}}
            </template>
            <template else>
               <a href="{{item.url}}">{{item.name}}</a>
            </template>
        </li>
    </template>
</ul>
```

In parts
```html
<template>
    <another-part>
       content of an another part
    </another-part>         
</template>
```