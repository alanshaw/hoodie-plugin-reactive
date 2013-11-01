hoodie-plugin-reactive
===

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