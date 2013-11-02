var reaction = require("./reaction")
  , reactiveTemplate = require("./template")

Hoodie.extend(function (hoodie) {

  hoodie.reactive = function (fn) {
    return reaction(hoodie, fn)
  }

  hoodie.reactive.template = function (el, tpl, createContext, opts) {
    return reactiveTemplate(hoodie, el, tpl, createContext, opts)
  }
})