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
<template loop="item of item">
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




### KNOWNBUGS 
1. header tags out of header. If those below than <slot> tag