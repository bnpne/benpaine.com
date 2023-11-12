import Anima from ".."
import piezo from "../../Utils"

export default class FadeIn extends Anima {
  constructor({ trigger: trigger, element: element }) {
    super({ trigger: trigger, element: element })

    if ("IntersectionObserver" in window) {
      this.out()
    }
  }

  in() {
    super.in()

    piezo({
      targets: this.element,
      translateY: ["100%", "0%"],
      delay: 5,
      opacity: [0, 1],
      easing: "easeOutExpo",
    })
  }

  out() {
    super.out()

    piezo({
      target: this.element,
      translateY: "100%",
      opacity: 0,
      easing: "easeOutExpo",
    })
  }
}
