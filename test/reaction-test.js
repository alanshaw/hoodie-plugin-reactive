var test = require("tape")
  , reaction = require("../reaction")

test("Reaction function should be called only once for multiple find filter matches", function (t) {

  var onStoreChange = null

  var doc = {
    type: "test",
    id: "nks7snca",
    title: "foo"
  }

  // Mock up a hoodie instance
  var hoodie = {
    store: {
      on: function (type, cb) {
        if (type == "change") {
          onStoreChange = cb
        }
      },
      find: function () {
        return {
          then: function (fn) {
            fn(doc)
          }
        }
      },
      findAll: function () {
        return {
          then: function (fn) {
            fn([doc])
          }
        }
      }
    }
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
  onStoreChange("update", doc)

  t.equal(invocations, 2, "Reaction function should have been invoked, once more")
  t.end()
})

test("Updating property that causes document to no longer match finders should cause reaction function to be invoked", function (t) {

  var onStoreChange = null

  var doc = {
    type: "test",
    id: "nks7snca",
    title: "foo"
  }

  // Mock up a hoodie instance
  var hoodie = {
    store: {
      on: function (type, cb) {
        if (type == "change") {
          onStoreChange = cb
        }
      },
      find: function () {
        return {
          then: function (fn) {
            if (doc.foo) {
              fn()
            } else {
              fn(doc)
            }
          }
        }
      },
      findAll: function () {
        return {
          then: function (fn) {
            if (doc.foo) {
              fn([])
            } else {
              fn([doc])
            }
          }
        }
      }
    }
  }

  var invocations = 0

  reaction(hoodie, function (store) {
    invocations++
    // When a doc.foo property is added, this findAll will no longer bring back doc
    // However, we still want the reaction function to be invoked!
    store.findAll(function (doc) {
      if (doc.type == "test" && !doc.foo) {
        return true
      }
    })
  })

  t.equal(invocations, 1, "Reaction function was not invoked initially")
  t.ok(onStoreChange, "onStoreChange event should have been registered with the mock store")

  // Simulate a doc change, and hoodie change event
  doc.foo = "foobar"
  onStoreChange("update", doc)

  t.equal(invocations, 2, "Reaction function should have been invoked, once more")

  doc.foo = "baz"
  onStoreChange("update", doc)

  t.equal(invocations, 2, "Reaction function should not have been invoked again")

  t.end()
})