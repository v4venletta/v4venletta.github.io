var runTest = require("run-test")
var Library = require("../").Library


runTest(
  "define a module and then use it",

  function(expect, done) {
    var library = new Library()

    library.define("foo", 
      function() { return "bar" }
    )

    library.using(["foo"], expectBar)

    function expectBar(foo) {
      expect(foo).to.equal("bar")
      done()
    }
  }
)



runTest(
  "getting individual singletons",
  function(expect, done) {
    var library = new Library()

    library.define("fred",
      function() {
        return "red"
      }
    )

    expect(library.get("fred")).to.equal("red")

    // And again to test cached path:

    expect(library.get("fred")).to.equal("red")

    done()
  }
)


runTest(
  "don't run the generator every time",

  function(expect, done) {
    var library = new Library()
    var total = {count: 0}

    library.define("foo", 
      function() {
        total.count++
        return {}
      }
    )

    library.using(["foo"], 
      function() {}
    )

    library.using(["foo"],
      function() {}
    )

    expect(total.count).to.equal(1)
    done()
  }
)



runTest(
  "definitions can have dependencies",

  function(expect, done) {
    var library = new Library()
    var count = 0

    library.define("turtle", 
      function() {
        return "in the sun"
      }
    )

    library.define(
      "rider",
      ["turtle"],
      function(turtle) {
        return "rider rides " + turtle
      }
    )

    library.using(["rider"], 
      function(rider) {
        expect(rider).to.equal("rider rides in the sun")
        done()
      }
    )
  }
)




