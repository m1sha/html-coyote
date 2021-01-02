# Templates

## The attributes
* slot - a name of slot the layout that'll placed content of the template
* if [elif, else] - to managed a condition displaying the template
* loop - to organizes a loop for duplication a content of the template
* markdown - puts in markdown content as html into the template

## The attribute-macros for the conditions
The attributes below can be used in layout and/or part files
* this-page - a template will be applied if the page is processing and the current page equal 
* same-page - a template will be applied if the page is processing and the template page equal (When used markdown files as content, see more [The Template Content](./content.md))
* that-page - a template will be applied if the page is processing and the current page mismatched
  
The attributes have a parameter the name of page. 

For example: The code below show us how we can to organize a condition where comparing a processing page with the specified page

layout.html

```html
...
<template if="__pageName==='index'">
    <p>This is index.html</p>
</template>
<template else>
    <p>This isn't index.html</p>
</template>
...
```
But you can use more "HTML-native" approach with this-page macros

layout.html

```html
...
<template this-page="index">
    <p>This is index.html</p>
</template>
<template else>
    <p>This isn't index.html</p>
</template>
...
```