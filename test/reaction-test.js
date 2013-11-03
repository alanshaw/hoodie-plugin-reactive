var test = require("tape")
  , reaction = require("../reaction")

test("Reaction function should be called only once for multiple find filter matches", function (t) {

  var onStoreChange = null

  // Mock up a hoodie instance
  var hoodie = {
    store: {
      on: function (type, cb) {
        if (type == "change") {
          onStoreChange = cb
        }
      },
      find: function () {},
      findAll: function () {}
    }
  }

  var doc = {
    type: "test",
    id: "nks7snca",
    title: "foo"
  }

  var invocations = 0

  // Create a reaction function that generates two filter functions that match our document
  reaction(hoodie, function (store) {
    invocations++
    store.find(doc.type, doc.id)
    store.findAll()
  })

  t.equal(invocations, 1, "Reaction function was not invoked initially")
  t.ok(onStoreChange, "onStoreChange event should have been registered with the mock store")

  // Simulate a doc change, and hoodie change event
  doc.title = "foobar"
  onStoreChange(null, doc)

  t.equal(invocations, 2, "Reaction function should have been invoked, once more")
  t.end()
})