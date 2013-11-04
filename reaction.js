var reactiveStore = require("./store")
  , bind = require("./bind")

module.exports = function (hoodie, fn, opts) {
  opts = opts || {}

  var stores = []

  if (!opts.store) {
    stores = [reactiveStore(hoodie)]
  } else if (Object.prototype.toString.call(opts.store) == "[object Array]") {
    for (var i = 0; i < opts.store.length; i++) {
      stores.push(reactiveStore(hoodie, {store: opts.store[i]}))
    }
  } else {
    stores = [reactiveStore(hoodie, {store: opts.store})]
  }

  var reaction = {}

  function onStoreChange (e, doc) {
    var wasFound = this.wasFound(doc)
    // If the doc is found, or was found previously then react
    if (this.isFound(doc) || e == "update" && wasFound) {
      fn.apply(reaction, stores)
    }
  }

  var storeChangeListeners = []

  reaction.activate = function () {
    if (storeChangeListeners.length) return reaction

    // Attach on change listeners to each of the stores
    for (var i = 0; i < stores.length; i++) {
      var listener = bind(onStoreChange, stores[i])
      storeChangeListeners.push(listener)
      stores[i].on("change", listener)
    }

    fn.apply(reaction, stores)

    return reaction
  }

  reaction.deactivate = function () {
    if (!storeChangeListeners.length) return reaction

    for (var i = 0; i < stores.length; i++) {
      stores[i].off("change", storeChangeListeners[i])
    }

    storeChangeListeners = []

    return reaction
  }

  return reaction.activate()
}