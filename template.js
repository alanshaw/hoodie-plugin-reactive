var Ractive = require("ractive")
  , reaction = require("./reaction")

module.exports = function (hoodie, el, tpl, createContext, opts) {
  var template = {}
    , ractive = null

  template.reaction = reaction(hoodie, function (store) {
    createContext(store).done(function (data) {
      store.firstRun = false

      if (!ractive) {
        ractive = new Ractive({
          el: el,
          template: tpl,
          data: data
        })
      } else {
        ractive.set(data)
      }
    })
  })

  return template
}