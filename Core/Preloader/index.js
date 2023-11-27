import STORE from "../Store"
import Emitter from "../Emitter"
import * as THREE from "three"
import piezo from "../Utils"
import { getHomeImages } from "../Utils/data"
import ImageMaterial from "../Canvas/materials/imageMaterial"

export default class Preloader {
  constructor({ el, pagesParent }) {
    this.preloader = el
    this.pageParent = pagesParent

    this.em = new Emitter()
    this.pageLoaded = false

    STORE.preloadTimeline = piezo.timeline({
      easing: "easeOutExpo",
      duration: 700,
    })

    STORE.preloadTimeline.add({
      targets: this.preloader,
      opacity: [1, 0],
      delay: 1000,
    })
    STORE.preloadTimeline.pause()

    this.load()
  }

  async load() {
    await this.loadPages().then(async () => {
      await STORE.router.inject().then(async () => {
        STORE.home.init()
        this.loaded()
      })
    })
  }

  loadPages() {
    return new Promise(async (resolve) => {
      if (STORE.router.pages["/"]) {
        STORE.home = STORE.router.pages["/"]
        const template = STORE.home.template
        const grid = template.querySelector(".home__grid")
        const row = document.createElement("li")
        row.classList.add("home__grid--row")
        const imgWrapper = document.createElement("div")
        imgWrapper.classList.add("home__grid--row__item")
        const imgEl = document.createElement("img")
        imgEl.classList.add("home__grid--row__item--img")

        const images = await getHomeImages()

        const meshArray = []
        const mediaArray = []

        for (let index = 0; index < images.length; index += 2) {
          const assetOne = images[index].image.asset
          const paletteOne = images[index].image.palette
          const dimensionsOne = images[index].image.dimensions
          const texOne = await this.loadTexture(assetOne)
          const elementOne = {
            tex: texOne,
            palette: paletteOne,
            dimensions: dimensionsOne,
          }
          const meshOne = this.loadMesh(elementOne)

          const wOne = imgWrapper.cloneNode()
          const wElOne = imgEl.cloneNode()
          wElOne.src = assetOne

          wElOne.addEventListener("click", () => {
            console.log(meshOne)
          })
          let gsOne = meshOne.material.uniforms.grayscale
          wElOne.addEventListener("mouseenter", () => {
            piezo({
              targets: gsOne,
              value: 1,
              duration: 700,
              easing: "easeOutExpo",
            })
          })
          wElOne.addEventListener("mouseleave", () => {
            piezo({
              targets: gsOne,
              value: 2,
              duration: 700,
              easing: "easeOutExpo",
            })
          })

          wOne.appendChild(wElOne)

          const u = row.cloneNode()

          u.appendChild(wOne)

          meshArray.push(meshOne)
          mediaArray.push(wOne)

          if (images[index + 1]) {
            const assetTwo = images[index + 1].image.asset
            const paletteTwo = images[index + 1].image.palette
            const dimensionsTwo = images[index + 1].image.dimensions
            const texTwo = await this.loadTexture(assetTwo)
            const elementTwo = {
              tex: texTwo,
              palette: paletteTwo,
              dimensions: dimensionsTwo,
            }
            const meshTwo = this.loadMesh(elementTwo)
            const wTwo = imgWrapper.cloneNode()
            const wElTwo = imgEl.cloneNode()
            wElTwo.src = assetTwo

            wElTwo.addEventListener("click", () => {
              console.log(meshTwo)
            })
            let gsTwo = meshTwo.material.uniforms.grayscale
            wElTwo.addEventListener("mouseenter", () => {
              piezo({
                targets: gsTwo,
                value: 1,
                duration: 700,
                easing: "easeOutExpo",
              })
            })
            wElTwo.addEventListener("mouseleave", () => {
              piezo({
                targets: gsTwo,
                value: 0,
                duration: 700,
                easing: "easeOutExpo",
              })
            })

            wTwo.appendChild(wElTwo)

            u.appendChild(wTwo)

            meshArray.push(meshTwo)
            mediaArray.push(wTwo)
          }

          grid.appendChild(u)
        }
        STORE.home.webgl = meshArray
        STORE.home.media = mediaArray
      }

      resolve()
    })
  }

  loadTexture(el) {
    const l = new THREE.TextureLoader()

    return new Promise((resolve, reject) => {
      l.load(
        el,
        function (tex) {
          resolve(tex)
        },
        undefined,
        function (err) {
          reject(err)
        }
      )
    })
  }

  loadMesh(element) {
    if (element) {
      const plane = new THREE.PlaneGeometry(1, 1)
      const material = new ImageMaterial({
        texture: element.tex,
        imageBounds: [element.dimensions.width, element.dimensions.height],
        scale: [element.dimensions.width, element.dimensions.height],
        grayscale: 0,
      })

      const mesh = new THREE.Mesh(plane, material.material)
      // mesh.position.set(1, 1)
      // mesh.scale.set(1, 1)
      STORE.scene.add(mesh)

      return mesh
    }
  }

  loaded() {
    this.em.emit("completed")
  }

  destroy() {
    this.preloader.remove()
  }
}
