import VS from "./vs"
import { lerp } from "./math"
import Emitter from "../Emitter"

const defaults = {
  el: document,
  lerp: 0.2,
  sections: true,
  items: false,
  limitContainer: null,
}

export default class Allez {
  constructor(options = {}) {
    Object.assign(this, defaults, options)
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual"
    }
    window.scrollTo(0, 0)
    this.el = document.querySelector("[allez-scroll]")
    this.html = document.documentElement
    this.windowHeight = window.innerHeight
    this.windowWidth = window.innerWidth
    this.windowMiddle = {
      x: this.windowWidth / 2,
      y: this.windowHeight / 2,
    }
    this.elements = {}
    this.currentElements = {}
    this.isScrolling = false
    this.stop = false

    this.instance = {
      delta: 0,
      scroll: 0,
      limit: this.html.offsetHeight,
      currentElements: this.currentElements,
      direction: "D",
    }

    this.checkScroll = this.checkScroll.bind(this)
    this.resize = this.resize.bind(this)

    this.em = new Emitter()

    // Handle this on main thread
    this.checkResize()
    // window.addEventListener("resize", this.resize);

    // Start this shit
    this.init()
  }

  init() {
    // Set default styles
    this.html.style.overflow = "hidden"
    this.html.style.overscrollBehavior = "none"

    this.vs = new VS({
      el: this.el,
      touchMultiplier: 5,
    }).on((e) => {
      if (this.stop) {
        return
      }

      requestAnimationFrame(() => {
        this.updateDelta(e)
        !this.isScrolling && this.startScrolling()
      })
    })

    this.addElements()
    this.setScrollLimit()
    this.detectElements()
    this.checkScroll()
    this.transformElements()
  }

  addElements() {
    this.elements = {}

    if (this.sections) {
      // Get sections
      const sections = this.el.querySelectorAll("[allez-section]")
      let elIndex = 0
      // Iterate through sections and add children
      sections.forEach((section) => {
        Array.from(section.children).forEach((el) => {
          const rect = el.getBoundingClientRect()
          const speed = el.dataset.speed || 1

          const centering = this.windowHeight / 2 - rect.height / 2
          const offset =
            rect.top < this.windowHeight
              ? 0
              : (rect.top - centering) * speed - (rect.top - centering)
          // let top = rect.top + this.instance.scroll - this.getTranslate(el);
          let top = rect.top + offset
          let bottom = rect.bottom + offset
          let progress = 0
          el.style.transform = `translate3d(0, 0, 0)`

          const mapped = {
            id: elIndex,
            el,
            top,
            bottom,
            offset,
            progress,
            inView: false,
          }
          this.elements[elIndex] = mapped

          elIndex++
        })
      })
    }

    if (this.items) {
      // Get sections
      const items = this.el.querySelectorAll("[allez-item]")
      let elIndex = 0
      // Iterate through sections and add children
      items.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const speed = el.dataset.speed || 1

        const centering = this.windowHeight / 2 - rect.height / 2
        const offset =
          rect.top < this.windowHeight
            ? 0
            : (rect.top - centering) * speed - (rect.top - centering)
        // let top = rect.top + this.instance.scroll - this.getTranslate(el);
        let top = rect.top + offset
        let bottom = rect.bottom + offset
        let progress = 0
        el.style.transform = `translate3d(0, 0, 0)`

        const mapped = {
          id: elIndex,
          el,
          top,
          bottom,
          offset,
          progress,
          inView: false,
        }
        this.elements[elIndex] = mapped

        elIndex++
      })
    }
  }

  setScrollLimit() {
    if (!this.limitContainer) {
      this.instance.limit = this.el.offsetHeight - this.windowHeight
    } else {
      this.instance.limit = this.limitContainer.offsetHeight - this.windowHeight
    }
  }

  startScrolling() {
    this.deltaTime = Date.now()

    this.isScrolling = true
    this.checkScroll()
    this.html.classList.add("is-scrolling")
  }

  stopScrolling() {
    cancelAnimationFrame(this.scrollLoop)
    this.deltaTime = undefined

    this.isScrolling = false
    this.instance.scroll = Math.round(this.instance.scroll)
    this.html.classList.remove("is-scrolling")
  }

  checkScroll() {
    if (this.isScrolling) {
      this.scrollLoop = requestAnimationFrame(() => this.checkScroll())
      this.updateScroll()
      const distance = Math.abs(this.instance.delta - this.instance.scroll)
      const timestamp = Date.now() - this.deltaTime
      if (
        timestamp > 100 &&
        ((distance < 0.5 && this.instance.delta !== 0) ||
          (distance < 0.5 && this.instance.delta === 0))
      ) {
        this.stopScrolling()
      }

      if (this.instance.delta >= this.instance.scroll) {
        this.instance.direction = "D"
      } else {
        this.instance.direction = "U"
      }

      const progress = this.instance.scroll / this.instance.limit

      this.em.emit("tick", {
        progress: progress,
        lerp: this.instance.scroll,
        target: this.instance.delta,
        limit: this.instance.limit,
        currentElements: this.instance.currentElements,
        direction: this.instance.direction,
      })

      this.detectElements()
      this.transformElements()
    }
  }

  updateDelta(e) {
    let delta = e.deltaY

    this.instance.delta -= delta * 0.5
    if (this.instance.delta < 0) this.instance.delta = 0
    if (this.instance.delta > this.instance.limit) {
      this.instance.delta = this.instance.limit
    }
  }

  updateScroll(e) {
    if (this.isScrolling) {
      this.instance.scroll = lerp(
        this.instance.scroll,
        this.instance.delta,
        this.lerp
      )
    } else {
      if (this.instance.scroll > this.instance.limit) {
        this.setScroll(this.instance.limit)
      } else if (this.instance.scroll < 0) {
        this.setScroll(0)
      } else {
        this.setScroll(this.instance.scroll)
      }
    }
  }

  setScroll(y) {
    this.instance = {
      ...this.instance,
      scroll: y,
      delta: y,
    }
  }

  detectElements() {
    const scrollTop = this.instance.scroll
    const scrollBottom = this.instance.scroll + this.windowHeight

    Object.values(this.elements).forEach((el) => {
      const { top, bottom } = el

      if (el && !el.inView) {
        if (scrollTop < bottom && scrollBottom >= top) {
          this.setInView(el, el.id)
        }
      }

      if (el && el.inView) {
        let height = bottom - top
        el.progress =
          (this.instance.scroll - (top - this.windowHeight)) /
          (height + this.windowHeight)

        if (scrollTop > bottom || scrollBottom < top) {
          this.setOutOfView(el, el.id)
        }
      }
    })
  }

  setInView(element, index) {
    this.elements[index].inView = true
    this.currentElements[index] = element

    this.elements[index].el.style.opacity = "1"
  }

  setOutOfView(element, index) {
    this.elements[index].inView = false

    Object.keys(this.currentElements).forEach((el) => {
      el === index && delete this.currentElements[el]
    })

    this.elements[index].el.style.opacity = "0"
  }

  transformElements() {
    Object.entries(this.instance.currentElements).forEach(
      ([index, element]) => {
        // add speed option maybe
        let distance = -this.instance.scroll

        if (element.inView) {
          if (distance) {
            let transform = `translate3d(0,${distance}px,0)`

            element.el.style.transform = transform
          }
        }
      }
    )
  }

  transform(el, transformValue) {
    el.style.transform = transformValue
  }

  getTranslate(el) {
    let translate
    if (!window.getComputedStyle) return

    const style = getComputedStyle(el)
    const transform = style.transform

    let mat = transform.match(/^translate3d\((.+)\)$/)
    if (mat) {
      translate = mat ? parseFloat(mat[1].split(", ")[1]) : 0
    } else {
      mat = transform.match(/^translate\((.+)\)$/)
      translate = mat ? parseFloat(mat[1].split(", ")[1]) : 0
    }
    return translate
  }

  on(event, cb) {
    return this.em.on(event, cb)
  }

  reset() {
    this.setScroll(0)
    this.checkResize()
  }

  checkResize() {
    if (!this.resizeTick) {
      this.resizeTick = true
      requestAnimationFrame(() => {
        this.resize()
        this.resizeTick = false
      })
    }
  }

  resize() {
    this.windowWidth = window.innerWidth
    this.windowHeight = window.innerHeight

    this.windowMiddle = {
      x: this.windowWidth / 2,
      y: this.windowHeight / 2,
    }
    this.update()
  }

  update() {
    this.setScrollLimit()
    this.addElements()
    this.detectElements()
    // this.updateScroll();
    this.transformElements()
    this.checkScroll()

    // this.addElements();
    // this.setScrollLimit();
    // this.detectElements();
    // this.checkScroll();
    // this.transformElements();
  }

  destroy() {
    this.stopScrolling()
    this.vs.destroy()
    window.removeEventListener("resize", this.checkResize, false)
  }
}
