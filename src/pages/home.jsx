import Page from "../../Core/Page/Page"
import STORE from "../../Core/Store"

function homeHtml() {
  return (
    <section id="page" class="home">
      <div class='home__container'>
        <ul class="home__grid">

        </ul>
      </div>
    </section>
  )
}

export default class Home extends Page {
  constructor() {
    super({ html: homeHtml(), path: "/" })
  }

  create() {
    super.create()
  }

  init() {

    this.createBounds()
  }

  updateScale() {
    if (this.media) {
      this.media.forEach((m, i) => {
        const bounds = m.getBoundingClientRect()

        const width = STORE.viewport.width * bounds.width / STORE.screen.width
        const height = STORE.viewport.height * bounds.height / STORE.screen.height

        this.webgl[ i ].scale.set(width, height)
        this.webgl[ i ].material.uniforms.scale.value = [ width, height ]
      })
    }
  }

  updateX() {
    if (this.media) {
      this.media.forEach((m, i) => {
        const bounds = m.getBoundingClientRect()

        const x = -(STORE.viewport.width / 2) + (this.webgl[ i ].scale.x / 2) + (bounds.left / STORE.screen.width) * STORE.viewport.width

        this.webgl[ i ].position.x = x
      })
    }
  }

  updateY() {
    if (this.media) {
      this.media.forEach((m, i) => {
        const bounds = m.getBoundingClientRect()

        const y = (STORE.viewport.height / 2) - (this.webgl[ i ].scale.y / 2) - (bounds.top / STORE.screen.height) * STORE.viewport.height

        this.webgl[ i ].position.y = y
      })
    }
  }

  createBounds() {
    this.updateScale()
    this.updateX()
    this.updateY()
  }

  resize() {
    this.createBounds()
  }

  scroll() {
    this.updateY()
  }
}

