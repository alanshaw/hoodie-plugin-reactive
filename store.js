/**
 * Proxy for hoodie.store that remembers find/findAll filtering arguments on first run.
 */
module.exports = function (hoodie) {
  var store = {finders: [], firstRun: true}

  store.find = function (type, id) {
    if (store.firstRun) {
      store.finders.push(function (obj) {
        if (obj.type === type && obj.id === id) {
          return true
        }
      })
    }
    return hoodie.store.find(type, id)
  }

  store.findAll = function (fn) {
    if (store.firstRun) {
      if (fn === undefined) {

        store.finders.push(function () { return true })

      } else if (Object.prototype.toString.call(fn) == '[object String]') {

        store.finders.push(function (doc) {
          if (doc.type === fn) {
            return true
          }
        })

      } else {
        store.finders.push(fn)
      }
    }
    return hoodie.store.findAll.apply(hoodie.store, arguments)
  }

  return store
}