[![Build Status](https://travis-ci.org/alanshaw/hoodie-plugin-reactive.png?branch=master)](https://travis-ci.org/alanshaw/hoodie-plugin-reactive) [![Dependency Status](https://david-dm.org/alanshaw/hoodie-plugin-reactive.png)](https://david-dm.org/alanshaw/hoodie-plugin-reactive) [![devDependency Status](https://david-dm.org/alanshaw/hoodie-plugin-reactive/dev-status.png)](https://david-dm.org/alanshaw/hoodie-plugin-reactive#info=devDependencies)

[![browser support](https://ci.testling.com/alanshaw/hoodie-plugin-reactive.png)](https://ci.testling.com/alanshaw/hoodie-plugin-reactive)

hoodie-plugin-reactive
===
Simple reactive mustache based templating for hoodie using [ractive.js](http://www.ractivejs.org/).

Create a [mustache](http://mustache.github.io/) template, and pass it as a parameter to `hoodie.reactive` along with the DOM element to attach the template to, and a function that retrieves data from the `hoodie.store` for the template to render. For example:

```javascript
var html = '<ul>{{#todos}}<li>{{title}}</li>{{/todos}}</ul>'

hoodie.reactive($('#todolist'), html, function (store) {
  var defer = hoodie.defer()

  store.findAll('todo').done(function (todos) {
    todos.sort(function (a, b) {
      return a.createdAt > b.createdAt
    })
    defer.resolve({todos: todos})
  })

  return defer.promise()
})
```

When you `add`, `update` or `remove` todos from the `hoodie.store` the DOM will automatically update to reflect your changes.


Reaction
---
Use `hoodie.reaction` to setup a reaction function that is run when it's dependencies on `hoodie.store` documents change - for when you need to perform non-DOM based computations.

```javascript
hoodie.reaction(function (store) {
  store.findAll("things").done(function (done) {
    // Do some d3, plot some points on a LeafletJS map, drawn on a canvas
    // etc. etc.
  })
})
```
