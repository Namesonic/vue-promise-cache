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

export default CachedItem
