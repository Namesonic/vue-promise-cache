class CachedItem {
  constructor (id) {
    this._ready = false
    this._error = false
    this._errormsg = ''
    this._id = id
    this.data = {}
  }

  update (data) {
    this.data = data
    // Object.assign(this, {...data})
  }

  set ready (payload) {
    this._ready = payload ? true : false
  }

  set error (err) {
    if (err) {
      this._error = true
      this._errormsg = err
    }
  }

  get id () {
    return this._id
  }

  get isReady () {
    return this._ready
  }

  get error () {
    return this._errormsg
  }

  get hasError () {
    return this._error
  }
}
class Cache {
  constructor (callback) {
    this._items = []
    this._api = callback
  }

  list (ids) {
    let items = []
    ids.forEach((id) => {
      if (!this.has(id)) {
      this.find(id)
    }
    items.push(this.has(id))
  })
    return items
  }

  listData (ids) {
    let items = []
    ids.forEach((id) => {
      if (!this.has(id)) {
      this.find(id)
    }
    items.push(this.has(id).data)
  })
    return items
  }

  has (id) {
    return this._items.find((item) => item.id === id )
  }

  item (id) {
    return this._items.find((item) => item.id === id )
  }

  add (id) {
    if (Array.isArray(id)) {
      id.forEach((id) => {
        if (!this.has(id)) {
        this._items.push(new CachedItem(id))
      }
    })
    } else {
      this._items.push(new CachedItem(id))
    }
  }

  find(id) {
    if (Array.isArray(id)) {
      id.forEach(id => {
        this._find(id)
    })
    } else {
      this._find(id)
    }
  }

  _find (id) {
    let item = this.has(id)
    if (!item) {
      // Run API callback
      this._api(id)
        .then((resp) => {
        // get cache item
        let i = this.has(id)
        if (i) {
          // Update cache item with the response
          i.update(resp)

          // Set cache item ready state
          i.ready = true
        }
      })
    .catch((err) => {
        let i = this.has(id)
        if (i) {
          i.ready = true
          i.error = err
        }
      })
      return this.add(id)
    } else {
      return item
    }
  }

  get all () {
    return this._items
  }

  get num () {
    return this._items.length
  }

  remove (id) {
    this._items.splice(
      this._items.findIndex((item) =>
      item.id === id), 1)
  }

  reset () {
    this._items = []
  }
}

export default Cache
