If you don't need a query engine or persistence, **identifiable** can help you store a set of objects referenced by unique IDs:

```javascript
var identifiable = require("identifiable")
var expect = require("chai").expect

var erik = {
  name: "Erik",
  likes: ["rollerblading", "cooking from scratch", "chickens"]
}

var people = {}

var get = identifiable.getFrom(people, "person")

var id = identifiable.assignId(people)
people[id] = erik
var result = get(id)

expect(result).to.equal(erik)
```

It does almost nothing. It generates unique IDs. It throws an error when it can't find an item with that id.

### Allowing getters to return undefined

If you pass `true` to a getter, it will just return undefined if the record isn't found. Otherwise an error gets thrown.

```javascript
var maybeErik = get(id, true)
```

### Providing a pre-existing ID

Sometimes, if you're maybe reseeding a store of items that already have IDs assigned and being used in the wild, you want to make sure you can keep using those same ids.

This works just fine, assignId will take an id:

```javascript
var id = identifiable.assignId(people, "gfa0")
```

This will throw an error if the ID is already in use, but otherwise it will use the provided ID. If you pass something `null`-like, it will assign a new, unused ID.


### Giving IDs a prefix

It can be nice to be able to tell different IDs for different purposes apart at a glance. The third parameter to assignId can be a prefix:

```javascript
var id = identifiable.assignId(people, null, "ppl")
// id is ppl-fjst
```

### Why

A database is overkill if you just need a hash of items. Not everything needs a persistence AI backing it up.

This module is basically boilerplate, but it's boilerplate that you pretty much always need when you're indexing something by ID. So it's kind of not worth copy/pasting.

IDs are kind of always a security concern. In the future, perhaps this module can provide some assurances about the entropy in an ID.
