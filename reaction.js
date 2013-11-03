var reactiveStore = require("./store")

module.exports = function (hoodie, fn) {
  var reaction = {}
    , store = reactiveStore(hoodie)

  function onStoreChange (e, doc) {
    var wasFound = store.wasFound(doc)
    // If the doc is found, or was found previously then react
    if (store.isFound(doc) || e == "update" && wasFound) {
      fn(store)
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