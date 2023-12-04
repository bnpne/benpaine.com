import Page from '../../Core/Page/Page'
import STORE from '../../Core/Store'
import piezo from '../../Core/Utils'
import * as THREE from 'three'

function homeHtml() {
  return (
    <section id="page" class="home">
      <div class="home__container">
        <ul class="home__grid"></ul>
        <div class="home__display">
          <div class="home__display--item"></div>
        </div>
      </div>
    </section>
  )
}

export default class Home extends Page {
  constructor() {
    super({html: homeHtml(), path: '/'})
  }

  create() {
    super.create()
  }

  init() {
    STORE.preloadTimeline.add(
      {
        targets: this.animaArray,
        delay: piezo.stagger(30),
        y: function (el, i) {
          return STORE.animaPosY[i]
        },
      },
      '-=600',
    )
  }

  onInject() {
    this.setAnimationPos()
  }

  setAnimationPos() {
    this.animaArray = []
    STORE.animaPosY = []
    this.updateDisplay()
    this.addListeners()
    this.updateScale()
    this.updateX()

    if (this.webgl) {
      this.webgl.forEach((w, i) => {
        const bounds = this.media[i].getBoundingClientRect()

        const y =
          STORE.viewport.height / 2 -
          w.scale.y / 2 -
          (bounds.top / STORE.screen.height) * STORE.viewport.height

        w.position.y = -STORE.viewport.height
        w.material.uniforms.opacity.value = 1

        this.animaArray.push(w.position)
        STORE.animaPosY.push(y)
      })
    }
  }

  updateDisplay() {
    if (this.displayMesh) {
      const bounds = this.displayMesh.element.getBoundingClientRect()

      const width = (STORE.viewport.width * bounds.width) / STORE.screen.width
      const height =
        (STORE.viewport.height * bounds.height) / STORE.screen.height

      const x =
        -(STORE.viewport.width / 2) +
        width / 2 +
        (bounds.left / STORE.screen.width) * STORE.viewport.width
      const y =
        STORE.viewport.height / 2 -
        height / 2 -
        (bounds.top / STORE.screen.height) * STORE.viewport.height

      this.displayMesh.mesh.scale.set(width, height)
      this.displayMesh.mesh.position.set(x, y)

      this.displayMesh.mesh.material = new THREE.MeshBasicMaterial({
        transparent: true,
        color: 0xf4f6f5,
      })
    }
  }

  updateScale() {
    if (this.media) {
      this.media.forEach((m, i) => {
        const bounds = m.getBoundingClientRect()

        const width = (STORE.viewport.width * bounds.width) / STORE.screen.width
        const height =
          (STORE.viewport.height * bounds.height) / STORE.screen.height

        this.webgl[i].scale.set(width, height)
        this.webgl[i].material.uniforms.scale.value = [width, height]
      })
    }
  }

  updateX() {
    if (this.media) {
      this.media.forEach((m, i) => {
        const bounds = m.getBoundingClientRect()

        const x =
          -(STORE.viewport.width / 2) +
          this.webgl[i].scale.x / 2 +
          (bounds.left / STORE.screen.width) * STORE.viewport.width

        this.webgl[i].position.x = x
      })
    }
  }

  updateY() {
    if (this.media) {
      this.media.forEach((m, i) => {
        const bounds = m.getBoundingClientRect()

        const y =
          STORE.viewport.height / 2 -
          this.webgl[i].scale.y / 2 -
          (bounds.top / STORE.screen.height) * STORE.viewport.height

        this.webgl[i].position.y = y
      })
    }
  }

  createBounds() {
    this.updateDisplay()
    this.updateScale()
    this.updateX()
    this.updateY()
  }

  handleMouseMove(e) {
    const {clientX, clientY} = e

    const x = (clientX / STORE.screen.width) * 2 - 1
    const y = -(clientY / STORE.screen.height) * 2 + 1

    this.webgl.forEach(w => {
      w.material.uniforms.mousePos.value = [clientX, clientY]
    })
  }

  addListeners() {
    this.media.forEach((m, i) => {
      m.addEventListener('click', () => {
        this.displayMesh.mesh.material = this.webgl[i].material.clone()
        const t = this.webgl[i].material.uniforms.tex.value.clone()
        this.displayMesh.mesh.material.uniforms.tex.value = t
      })
    })
  }

  in() {
    return new Promise(resolve => {
      piezo
        .timeline({
          easing: function () {
            return function (x) {
              return Math.sqrt(1 - Math.pow(x - 1, 2))
            }
          },
          duration: 700,
          complete: () => {
            resolve()
          },
        })
        .add({
          targets: this.animaArray,
          delay: piezo.stagger(30),
          y: function (el, i) {
            return STORE.animaPosY[i]
          },
        })
    })
  }

  out() {
    return new Promise(resolve => {
      const animaDisplay = this.displayMesh.mesh.material.uniforms
        ? this.displayMesh.mesh.material.uniforms?.opacity
        : this.displayMesh.mesh.material
      piezo
        .timeline({
          easing: function () {
            return function (x) {
              return x * x * x
            }
          },
          duration: 700,
          complete: () => {
            resolve()
          },
        })
        .add({
          targets: this.animaArray,
          delay: piezo.stagger(30, {from: 'last'}),
          y: -STORE.viewport.height,
        })
        .add(
          {
            targets: animaDisplay,
            complete: () => {
              if (animaDisplay.opacity) {
                animaDisplay.opacity = 0
              }
            },
            duration: 300,
            value: 0,
          },
          100,
        )
    })
  }

  resize() {
    this.createBounds()
  }

  scroll() {
    this.updateY()
  }
}
