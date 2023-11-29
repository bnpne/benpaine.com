export default class Page {
  constructor({ parent, webgl, html, path }) {
    this.webgl = webgl ?? null
    this.html = html ?? null
    this.parent = parent ?? null
    this.active = false
    this.path = path ?? null
    this.animas = []
    this.template = null

    this.create()
  }

  create() {
    // Load HTML
    if (this.html) {
      this.template = render(this.html)
    } else {
      return
    }
    // Load GL
    if (this.webgl) {
      this.loadGl()
    }

    // Create In and Out
    // this.createAnima()

    this.created = true
    // this.createAnima()
  }


  init() { }

  onInject() {
    // This function is fired after injection onto the dom
  }

  in() {
    return Promise.resolve()
  }

  out() {
    return Promise.resolve()
  }

  updatePath(path) {
    this.path = path
  }

  resize() { }

  scroll() { }
}
