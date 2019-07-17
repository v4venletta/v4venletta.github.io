var library = require("module-library")(require)

module.exports = library.export(
  "identifiable",
  function() {

    function assignId(collection, id, prefix) {
      if (id != null) {
        demandId(collection, id)
        return id
      }

      do {
        var id = rand(prefix)
      } while (collection[id])

      return id
    }

    function valid(prefix, id) {
      if (typeof id != "string") {
        throw new Error("You have to pass a string id to identifiable.valid. You passed "+id)
      } else if (id.substr(0, prefix.length) != prefix) {
        throw new Error("Whatever "+id+" represents, it is supposed to have a -"+prefix+" prefix!")
      }
    }

    function rand(prefix) {
      var code = Math.random().toString(36).split(".")[1].substr(0,4)

      if (prefix) {
        return prefix+"-"+code
      } else {
        return code
      }
    }

    function assignLike(collection, id) {
      var base = id
      var suffix = 2
      while(collection[id]) {
        id = base+"-"+suffix
        suffix++
      }

      return id
    }

    function demandId(collection, id) {
      if (!id || id.length < 1) {
        throw new Error("identifiable.demandId needs to know what id you're demanding")
      }

      if (typeof collection[id] != "undefined") {
        throw new Error("Collection already contains a reference to "+id)
      }
    }

    function get(collection, description, ref, allowUndefined) {
      if (!ref && allowUndefined) {
        throw new Error("Tried to find a "+description+" but you didn't provide an id.")
      }

      if (typeof ref == "string") {
        var item = collection[ref]
      } else {
        var item = ref
      }

      if (!item && allowUndefined) {
        return undefined

      } else if (!item) {
        throw new Error("No "+description+" with id "+ref+" in collection")

      } else {
        return item
      }
    }

    function getFrom(collection, description) {
      if (typeof description != "string") {
        throw new Error("2nd argument to identifiable.getFrom should be a string describing what's coming out of the collection. You passed "+JSON.stringify(description))
      }
        
      return get.bind(null, collection, description)
    }

    function mapList(id, lists, callback) {
      if (!lists[id]) {
        return []
      }

      return lists[id].map(callback)
    }

    function addToList(id, lists, newItem) {
      var list = lists[id]
      if (!list) {
        list = lists[id] = []
      }
      list.push(newItem)
    }
    
    return {
      assignId: assignId,
      demandId: demandId,
      valid: valid,
      assignLike: assignLike,
      getFrom: getFrom,
      list: {
        add: addToList,
        map: mapList,
      },
    }
  }
)
