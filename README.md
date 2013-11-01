hoodie-plugin-reactive
===

Simple reactive mustache based templating for hoodie using [ractive.js](http://www.ractivejs.org/).

Create a [mustache](http://mustache.github.io/) template, and pass it as a parameter to `hoodie.reactive` along with the DOM element to attach the template to, and a function that retrieves data from the `hoodie.store` for the template to render. For example:

```javascript
var template = '<ul>{{#todos}}<li>{{title}}</li>{{/todos}}</ul>'

hoodie.reactive($('#todolist'), template, function (store) {
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

When you perform some of the following operations, your DOM will automatically update to reflect the changes:

```javascript
// Add to the list
hoodie.store.add("todo", {title: "Take out the trash"})

// Later...

// Update
hoodie.store.findAll(function (doc) {
  if (doc.title == "Take out the trash") return true
}).done(function (docs) {
  hoodie.store.update('todo', docs[0].id, {title: "Take out the kids"})
})

// Even later...

// Remove from the list
hoodie.store.removeAll(function (doc) {if (doc.title == "Take out the kids") return true})
```