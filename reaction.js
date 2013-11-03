var reactiveStore = require("./store")

module.exports = function (hoodie, fn) {
  var reaction = {}
    , store = reactiveStore(hoodie)

  function onStoreChange (e, doc) {
    for (var i = 0; i < store.finders.length; i++) {
      if (store.finders[i](doc)) {
        return fn(store)
      }
    }
  }

  reaction.activate = function () {
    hoodie.store.on("change", onStoreChange)
    fn(store)
    return reaction
  }

  reaction.deactivate = function () {
    hoodie.store.off("change", onStoreChange)
    return reaction
  }

  return reaction.activate()
}