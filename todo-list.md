### FEATURES
1. Add CSCC and LESS preprocessors

### UNRESOLVEDBUGS

BUG #2 pass collection in attribute value

layout.html
```html
<html>
    <body>
        <custom-component items="values">
    </body>
</html>
```

custom-component.html
```html
<!--#.items-->
<template loop="item of items">
    <p>{{item.name}}</p>
</template>
```

*.yml
```yaml
values: 
    - { name: 'item1' } 
    - { name: 'item2' } 
    - { name: 'item3' }
```
or

*.js
```javascript

content.add("values", [{name: "item1"}, {name: "item2"}, {name: "item3"}])

```

BUG #3 Template in template

layout.html
```html
<html>
    <body>
        <custom-component>
    </body>
</html>
```

custom-component.html
```html
<template>
    <ul>
    <template loop="item of items">
        <li>{{item.name}}</li>
    </template>
    <ul>
</template>
```

*.yml
```yaml
items: 
    - { name: 'item1' } 
    - { name: 'item2' } 
    - { name: 'item3' }
```


### KNOWNBUGS 
1. header tags out of header. If those below than <slot> tag