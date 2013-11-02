var reactiveStore = require("./store")

module.exports = function (hoodie, fn) {
  var reaction = {}
    , store = reactiveStore(hoodie)

  function onStoreChange (e, doc) {
    store.finders.forEach(function (finder) {
      if (finder(doc)) {
        fn(store)
      }
    })
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