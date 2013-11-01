var Ractive = require("ractive")

Hoodie.extend(function (hoodie) {

  var uuid = (function () {
    var id = 0
    return function () {
      return ++id
    }
  })()

  var ractives = {
    // uuid: ractive
  }

  var contexters = {
    // uuid: create template context function
  }

  var proxies = {
    // uuid: proxy hoodie.store
  }

  function ReactiveStore (id) {
    this.id = id
    this.finders = []
    this.firstRun = true
  }

  ReactiveStore.prototype.find = function (type, id) {
    if (this.firstRun) {
      this.finders.push(function (obj) {
        if (obj.type === type && obj.id === id) {
          return true
        }
      })
    }
    return hoodie.store.find(type, id)
  }

  ReactiveStore.prototype.findAll = function (fn) {
    if (this.firstRun) {
      if (fn === undefined) {

        this.finders.push(function () { return true })

      } else if (Object.prototype.toString.call(fn) == '[object String]') {

        this.finders.push(function (doc) {
          if (doc.type === fn) {
            return true
          }
        })

      } else {
        this.finders.push(fn)
      }
    }
    return hoodie.store.findAll.apply(hoodie.store, arguments)
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
      ractives[id].set(contexters[id](proxies[id]))
    })
  })

  hoodie.reactive = function (el, tpl, context, opts) {
    // Create new ractive UUID
    var id = uuid()
      , store = new ReactiveStore(id)

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