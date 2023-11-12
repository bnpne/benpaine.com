export default class Anima {
  constructor({ trigger, element }) {
    this.visible = false
    this.element = element
    this.trigger = trigger

    if ("IntersectionObserver" in window) {
      if (this.trigger) {
        this.createObserver()

        this.out()
      }
    } else {
      this.in()
    }
  }

  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!this.visible && e.isIntersecting) {
          this.in()
        }
      })
    }).observe(this.trigger)
  }

  in() {
    this.visible = true
  }

  out() {
    this.visible = false
  }
}
