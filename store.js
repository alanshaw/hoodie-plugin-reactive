/**
 * Proxy for hoodie.store that remembers find/findAll filtering arguments on first run.
 */
module.exports = function (hoodie) {
  var store = {finders: [], foundDocs: {}, firstRun: true}

  store.find = function (type, id) {
    if (store.firstRun) {
      store.finders.push(function (obj) {
        if (obj.type === type && obj.id === id) {
          return true
        }
      })
    }
    return hoodie.store.find(type, id).then(function (doc) {
      if (doc) {
        store.foundDocs[doc.type] = store.foundDocs[doc.type] || {}
        store.foundDocs[doc.type][doc.id] = true
      }
      return doc
    })
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
    return hoodie.store.findAll.apply(hoodie.store, arguments).then(function (docs) {
      for (var i = 0; i < docs.length; i++) {
        store.foundDocs[docs[i].type] = store.foundDocs[docs[i].type] || {}
        store.foundDocs[docs[i].type][docs[i].id] = true
      }
      return docs
    })
  }

  /**
   * Was the document previously found
   * @param doc
   * @returns {*}
   */
  store.wasFound = function (doc) {
    return store.foundDocs[doc.type] ? store.foundDocs[doc.type][doc.id] : false
  }

  /**
   * Evaluate against store.finders whether doc is still found.
   * __If no longer found, update the cache of found doc IDs.__
   * @param doc
   * @returns {boolean}
   */
  store.isFound = function (doc) {
    for (var i = 0; i < store.finders.length; i++) {
      if (store.finders[i](doc)) {
        return true
      }
    }

    // Was found previously, but now not.
    if (store.foundDocs[doc.type] && store.foundDocs[doc.type][doc.id]) {
      store.foundDocs[doc.type] = store.foundDocs[doc.type] || {}
      store.foundDocs[doc.type][doc.id] = false
    }

    return false
  }

  return store
}