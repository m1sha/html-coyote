# The Parts

The parts are fragments of HTML code that placed in separate files.

The calling object uses this part as a HTML tag.

For example we have the part of code that repeated on an each page. We can placed that part in separate file and using it in page files as HTML tag.

./parts/**ad-block**.html

```html
<template>
    <div>
        <h1>Sale 95%</h1>
        <p>This is place for your ad</p>
    </div>
</template>
```

./pages/page.html
```html
...
<template slot="top-ad-placeholder">
    <ad-block></ad-block>
</template>
...
```

We also can use parameters for the Part.

A little bit rewrite the code above.

./parts/**ad-block**.html

```html
<!--#
.percent
@content
-->
<template>
    <div>
        <h1>Sale {{percent}%</h1>
        <p>{{content}}</p>
    </div>
</template>
```

./pages/page.html
```html
...
<template slot="top-ad-placeholder">
    <ad-block percent="95">This is place for your ad</ad-block>
</template>
...
```

## Using dynamic parameters

For example we have a block of YAML code that we want to showing in our part file.

./content/post-2020-06-01.md
```markdown
---

author:
    name: 'Paul Smith'
    age: 44
    location: 'New York'
    image: /img/paulsmith.jpg

---

# The Blog Text
```

./parts/author-info.html
```html
<!--#
.name
.age
.location
.image
-->
<template>
    <div>
        <img src="{{image}}" title="{{name}}">
        <p>{{name}}, <span>{{age}}</span></p>
        <p>{{location}}</p>
    <div>
</template>
```


./pages/blog.html
```html
<template slot="content">
    <template markdown></template>
    <author-info
        name="{{md.author.name}}"
        age="{{md.author.age}}"
        location="{{md.author.location}}"
        image="{{md.author.image}}">
    </author-info>
</template>
```

For get a dynamic variant a little bit rewrite the code above.

./parts/author-info.html
```html
<!--#
.author
-->
<template>
    <div>
        <img src="{{author.image}}" title="{{author.name}}">
        <p>{{author.name}}, <span>{{author.age}}</span></p>
        <p>{{author.location}}</p>
    <div>
</template>
```


./pages/blog.html
```html
<template slot="content">
    <template markdown></template>
    <author-info :author="md.author">
    </author-info>
</template>
```