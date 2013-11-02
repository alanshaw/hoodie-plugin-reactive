var Ractive = require("ractive")
  , reaction = require("./reaction")
  , extend = require("extend")

module.exports = function (hoodie, el, html, createContext, opts) {
  var template = new Ractive(extend({el: el, template: html, data: {}}, opts))

  template.reaction = reaction(hoodie, function (store) {
    createContext(store).done(function (data) {
      store.firstRun = false
      if (data !== undefined && data !== null) {
        template.set(data)
      }
    })
  })

  return template
}