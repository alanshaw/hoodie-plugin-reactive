var Ractive = require("ractive")
  , reaction = require("./reaction")
  , reactiveTemplate = require("./template")

Hoodie.extend(function (hoodie) {

  /**
   * @param {Element} el Parent element that the template should be attached to
   * @param {String} html The HTML template to use to construct DOM representation
   * @param {Function} createContext A function that creates a context object for the template
   * @param {Object} opts Options to pass to the Ractive instance
   * @param [opts.store] The store or stores to pass to the reaction function (default hoodie.store)
   * @returns {*}
   */
  hoodie.reactive = function (el, html, createContext, opts) {
    return reactiveTemplate(hoodie, el, html, createContext, opts)
  }

  /**
   * @param {Function} fn
   * @param {Object} [opts] Reaction options
   * @param [opts.store] The store(s) to use (default hoodie.store)
   * @returns {*} A new reaction object that re-runs fn when the data fn depends on changes.
   */
  hoodie.reaction = function (fn, opts) {
    return reaction(hoodie, fn, opts)
  }

  hoodie.Ractive = hoodie.Ractive || Ractive
})