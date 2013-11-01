var Ractive = require("ractive")
var reactiveStore = require("./store")

Hoodie.extend(function (hoodie) {

  var uuid = (function () {
    var id = 0
    return function () {
      return ++id
    }
  })()

  // Ractive instances
  var ractives = {
    // uuid: ractive
  }

  // Functions that create data for a template
  var contexters = {
    // uuid: create template context function
  }

  // ReactiveStore's that remember find/findAll reduction queries
  var proxies = {
    // uuid: proxy hoodie.store
  }

  hoodie.store.on("change", function (e, doc) {
    var affectedIds = Object.keys(proxies).reduce(function (ids, id) {
      proxies[id].finders.forEach(function (finder) {
        if (finder(doc)) {
          ids.push(id)
        }
      })
      return ids
    }, [])

    affectedIds.forEach(function (id) {
      contexters[id](proxies[id]).done(function (data) {
        ractives[id].set(data)
      })
    })
  })

  hoodie.reactive = function (el, tpl, context, opts) {
    // Create new ractive UUID
    var id = uuid()
      , store = reactiveStore(hoodie)

    context(store).done(function (data) {
      store.firstRun = false

      // Create new ractive instance
      var ractive = new Ractive({
        el: el,
        template: tpl,
        data: data
      })

      ractives[id] = ractive
      contexters[id] = context
      proxies[id] = store
    })
  }
})