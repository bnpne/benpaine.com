import Page from '../../Core/Page/Page'
import STORE from '../../Core/Store'
import piezo from '../../Core/Utils'
import * as THREE from 'three'
import VS from '../../Core/Allez/vs'
import R from '../../Core/R'
import {lerp} from '../../Core/Allez/math'

function homeHtml() {
  return (
    <section id="page" class="home">
      <div class="home__display"></div>
      <div class="home__container">
        <ul class="home__grid"></ul>
        <ul class="home__map"></ul>
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

    this.gridEl = this.template.querySelector('.home__grid')
    this.mapEl = this.template.querySelector('.home__map')
    this.nav = document.querySelector('#nav')
    this.display = this.template.querySelector('.home__display')
    this.display.style.display = 'none'

    // this.toggle = document.querySelector('.toggle')
    this.grid = true
    this.isDisplayed = false
  }

  init() {
    this.addListeners()
    this.getGridItemsPos()
    this.getMapItemsPos()

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
    this.createDisplayBounds()
    if (this.grid) {
      this.mapEl.style.display = 'none'
      this.gridEl.style.display = 'grid'
    } else {
      this.mapEl.style.display = 'block'
      this.gridEl.style.display = 'none'
    }
  }

  setAnimationPos() {
    this.animaArray = []
    STORE.animaPosY = []
    STORE.animaPosX = []
    this.updateScale()
    this.updateX()

    if (this.webgl) {
      this.webgl.forEach((w, i) => {
        const bounds = this.media[i].getBoundingClientRect()

        const y =
          STORE.viewport.height / 2 -
          w.scale.y / 2 -
          (bounds.top / STORE.screen.height) * STORE.viewport.height

        const x =
          -(STORE.viewport.width / 2) +
          w.scale.x / 2 +
          (bounds.left / STORE.screen.width) * STORE.viewport.width

        w.position.y = -STORE.viewport.height
        w.material.uniforms.opacity.value = 1

        this.animaArray.push(w.position)
        STORE.animaPosY.push(y)
        STORE.animaPosX.push(x)
      })
    }
  }

  getGridItemsPos() {
    this.gridItemPos = []
    this.media.forEach((m, i) => {
      const bounds = m.getBoundingClientRect()

      const width = (STORE.viewport.width * bounds.width) / STORE.screen.width
      STORE.scaleWidth = width
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

      const pos = {width: width, height: height, x: x, y: y}

      this.gridItemPos.push(pos)
    })
  }

  getMapItemsPos() {
    this.mapItemPos = []
    const GOLDEN_RATIO = 1.618
    // this.mapMedia.forEach((m, i) => {
    //   const t = Math.pow(GOLDEN_RATIO, i) * 0.005
    //   console.log(t)
    //   const r = Math.floor(Math.random() * 9)
    //   m.style.top = `${r}px`
    //   m.style.left = `${t}px`
    // })
  }

  updateScale() {
    if (this.media) {
      this.media.forEach((m, i) => {
        const bounds = m.getBoundingClientRect()

        const width = (STORE.viewport.width * bounds.width) / STORE.screen.width
        STORE.scaleWidth = width
        const height =
          (STORE.viewport.height * bounds.height) / STORE.screen.height

        this.webgl[i].scale.set(width, height)
        this.webgl[i].material.uniforms.scale.value = [width, height]
      })
    }
  }

  updateX(input) {
    this.media.forEach((m, i) => {
      let x
      if (input === undefined) {
        const bounds = m.getBoundingClientRect()
        x =
          -(STORE.viewport.width / 2) +
          this.webgl[i].scale.x / 2 +
          (bounds.left / STORE.screen.width) * STORE.viewport.width

        this.webgl[i].position.x = x
      } else {
        this.webgl[i].position.x = input
      }
    })
  }

  updateY() {
    this.media.forEach((m, i) => {
      let y
      const bounds = m.getBoundingClientRect()

      y =
        STORE.viewport.height / 2 -
        this.webgl[i].scale.y / 2 -
        (bounds.top / STORE.screen.height) * STORE.viewport.height

      this.webgl[i].position.y = y
    })
  }

  createBounds() {
    this.updateScale()
    this.updateX()
    this.updateY()
  }

  createDisplayBounds() {
    let scaleInPx = STORE.screen.width * 0.4
    if (window.mobileCheck()) {
      scaleInPx = STORE.screen.width - 16
    }

    const width = (STORE.viewport.width * scaleInPx) / STORE.screen.width
    const height = (STORE.viewport.height * scaleInPx) / STORE.screen.height

    this.displayMesh.scale.set(width, height)
  }

  addListeners() {
    this.media.forEach((m, i) => {
      m.addEventListener('click', () => {
        this.isDisplayed = true
        STORE.lenis.stop()
        this.display.style.display = 'block'
        this.nav.style.display = 'none'

        this.webgl.forEach((w, i) => {
          w.material.uniforms.opacity.value = 0
        })

        const clone = this.webgl[i].material.clone()
        const IMG_TRANSFORM = `?auto=format&h=1920&w=1920`
        const img = m.children[0].src

        this.displayMesh.material = clone
        this.displayMesh.material.uniforms.opacity.value = 1

        const l = new THREE.TextureLoader().load(img + IMG_TRANSFORM, tex => {
          this.displayMesh.material.uniforms.tex.value = tex
        })
      })
    })
    this.display.addEventListener('click', () => {
      this.isDisplayed = false
      STORE.lenis.start()
      this.display.style.display = 'none'
      this.nav.style.display = 'block'

      this.webgl.forEach((w, i) => {
        w.material.uniforms.opacity.value = 1
      })

      const displayMaterial = new THREE.MeshBasicMaterial({opacity: 0})
      this.displayMesh.material = displayMaterial
    })
    // this.gridEl.addEventListener('click', () => {
    //   if (this.isDisplayed) {
    //     console.log('out')
    //   }
    // })
    // this.toggle.addEventListener('click', () => {
    //   this.grid ? (this.grid = false) : (this.grid = true)
    //   this.toggleGrid()
    // })
  }

  toggleGrid() {
    if (this.grid) {
      this.toggle.innerHTML = 'Map'
    } else {
      this.toggle.innerHTML = 'Grid'
    }
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
    })
  }

  resize() {
    this.getGridItemsPos()
    this.createBounds()
    this.createDisplayBounds()
  }

  scroll(scroll) {
    this.updateY()
  }
}
