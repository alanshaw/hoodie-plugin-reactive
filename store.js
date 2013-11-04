/**
 * Proxy for hoodieStore that remembers find/findAll filtering arguments on first run.
 */
module.exports = function (hoodie, opts) {
  opts = opts || {}
  
  var hoodieStore = opts.store || hoodie.store
    , finders = []
    , foundDocs = {}
    , store = {collectFinders: true}

  store.find = function (type, id) {
    if (store.collectFinders) {
      finders.push(function (obj) {
        if (obj.type === type && obj.id === id) {
          return true
        }
      })
    }
    return hoodieStore.find(type, id).then(function (doc) {
      if (doc) {
        foundDocs[doc.type] = foundDocs[doc.type] || {}
        foundDocs[doc.type][doc.id] = true
      }
      return doc
    })
  }

  store.findAll = function (fn) {
    if (store.collectFinders) {
      if (fn === undefined) {

        finders.push(function () { return true })

      } else if (Object.prototype.toString.call(fn) == "[object String]") {

        finders.push(function (doc) {
          if (doc.type === fn) {
            return true
          }
        })

      } else {
        finders.push(fn)
      }
    }
    return hoodieStore.findAll.apply(hoodieStore, arguments).then(function (docs) {
      for (var i = 0; i < docs.length; i++) {
        foundDocs[docs[i].type] = foundDocs[docs[i].type] || {}
        foundDocs[docs[i].type][docs[i].id] = true
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
    return foundDocs[doc.type] ? foundDocs[doc.type][doc.id] : false
  }

  /**
   * Evaluate against finders whether doc is still found.
   * __If no longer found, update the cache of found doc IDs.__
   * @param doc
   * @returns {boolean}
   */
  store.isFound = function (doc) {
    for (var i = 0; i < finders.length; i++) {
      if (finders[i](doc)) {
        return true
      }
    }

    // Was found previously, but now not.
    if (foundDocs[doc.type] && foundDocs[doc.type][doc.id]) {
      foundDocs[doc.type] = foundDocs[doc.type] || {}
      foundDocs[doc.type][doc.id] = false
    }

    return false
  }

  // Proxy the rest of the store API...just in case

  var passThrus = "add,update,remove,removeAll,bind,on,one,trigger,unbind,off".split(",")

  function createPassThru (name) {
    return function () {
      return hoodieStore[name].apply(hoodieStore, arguments)
    }
  }

  for (var i = 0; i < passThrus.length; i++) {
    store[passThrus[i]] = createPassThru(passThrus[i])
  }

  return store
}