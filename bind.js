module.exports = function (fn, ctx) {
  return function () { return fn.apply(ctx, arguments) }
}