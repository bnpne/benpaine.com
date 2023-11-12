import Emitter from "../Emitter"

const SCROLL = "vs"

export default class VS {
  constructor(options) {
    this.el = window
    if (options && options.el) {
      this.el = options.el
      delete options.el
    }
    this.hasWheelEvent = "onwheel" in document
    this.hasTouch = "ontouchstart" in document
    this.hasTouchWin =
      navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1
    this.hasMouseWheelEvent = "onmousewheel" in document

    this.options = Object.assign(
      {
        mouseMultiplier: 1,
        touchMultiplier: 2,
        firefoxMultiplier: 15,
        keyStep: 120,
        preventTouch: false,
        unpreventTouchClass: "vs-touchmove-allowed",
        useKeyboard: true,
        useTouch: true,
      },
      options
    )

    this.em = new Emitter()
    this.scroll = {
      x: 0,
      y: 0,
      deltaX: 0,
      deltaY: 0,
    }

    this.touchStart = {
      x: null,
      y: null,
    }

    this.bodyTouchAction = null
  }

  notify(e) {
    let v = this.scroll
    v.x += v.deltaX
    v.y += v.deltaY

    this.em.emit(SCROLL, {
      x: v.x,
      y: v.y,
      deltaX: v.deltaX,
      deltaY: v.deltaY,
      originalEvent: e,
    })
  }

  onWheel(e) {
    let options = this.options
    let v = this.scroll

    v.deltaX = e.wheelDeltaX || e.deltaX * -1
    v.deltaY = e.wheelDeltaY || e.deltaY * -1

    // TODO firefox

    v.deltaX *= options.mouseMultiplier
    v.deltaY *= options.mouseMultiplier

    this.notify(e)
  }

  onMouseWheel = (e) => {
    var v = this.scroll

    // In Safari, IE and in Chrome if 'wheel' isn't defined
    v.deltaX = e.wheelDeltaX ? e.wheelDeltaX : 0
    v.deltaY = e.wheelDeltaY ? e.wheelDeltaY : e.wheelDelta

    this.notify(e)
  }

  onTouchStart = (e) => {
    var t = e.targetTouches ? e.targetTouches[0] : e
    this.touchStart.x = t.pageX
    this.touchStart.y = t.pageY
  }

  onTouchMove = (e) => {
    var options = this.options
    if (
      options.preventTouch &&
      !e.target.classList.contains(options.unpreventTouchClass)
    ) {
      e.preventDefault()
    }

    var v = this.scroll

    var t = e.targetTouches ? e.targetTouches[0] : e

    v.deltaX = (t.pageX - this.touchStart.x) * options.touchMultiplier
    v.deltaY = (t.pageY - this.touchStart.y) * options.touchMultiplier

    this.touchStart.x = t.pageX
    this.touchStart.y = t.pageY

    this.notify(e)
  }

  bind() {
    if (this.hasWheelEvent) {
      this.el.addEventListener("wheel", this.onWheel.bind(this))
    }
    if (this.hasMouseWheelEvent) {
      this.el.addEventListener("mousewheel", this.onMouseWheel.bind(this))
    }
    if (this.hasTouch && this.options.useTouch) {
      this.el.addEventListener("touchstart", this.onTouchStart.bind(this))
      this.el.addEventListener("touchmove", this.onTouchMove.bind(this))
    }
  }

  unbind() {
    if (this.hasWheelEvent) {
      this.el.removeEventListener("wheel", this.onWheel.bind(this))
    }
    if (this.hasMouseWheelEvent) {
      this.el.removeEventListener("mousewheel", this.onMouseWheel.bind(this))
    }
    if (this.hasTouch) {
      this.el.removeEventListener("touchstart", this.onTouchStart.bind(this))
      this.el.removeEventListener("touchmove", this.onTouchMove.bind(this))
    }
  }

  on(callback, ctx) {
    this.em.on(SCROLL, callback, ctx)

    let events = this.em.e
    if (events && events[SCROLL] && events[SCROLL].length === 1) {
      this.bind()
    }
  }

  off() {
    this.em.off(SCROLL)

    let events = this.em.e
    if (!events[SCROLL] || events[SCROLL].length <= 0) {
      this.unbind()
    }
  }

  destroy() {
    this.em.off()
    this.unbind()
  }
}
