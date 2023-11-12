export default class Emitter {
  constructor() {
    this.e = {}
  }

  // Subscribe to event
  on(name, callback, ctx) {
    let e = this.e || (this.e = {})

    ;(e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx,
    })

    return this
  }

  // Unsubscribe from event
  off(name) {
    // If event doesnt exist throw error
    // Remove object
    if (!this.e[name]) {
      console.error(`Event "${name}" does not exist.`)
      return
    } else {
      delete this.e[name]
      return
    }
  }

  // Emit an event
  emit(name) {
    let data = [].slice.call(arguments, 1)
    let evts = ((this.e || (this.e = {}))[name] || []).slice()
    evts.forEach((e) => e.fn.apply(e.ctx, data))
    return this
  }
}
