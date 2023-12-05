import STORE from '../Store'
import Emitter from '../Emitter'
import * as THREE from 'three'
import piezo from '../Utils'
import {getHomeImages} from '../Utils/data'
import ImageMaterial from '../Canvas/materials/imageMaterial'

export default class Preloader {
  constructor({el, pagesParent}) {
    this.preloader = el
    this.pageParent = pagesParent

    this.navWords = Array.prototype.slice.call(
      document.querySelectorAll('[data-word]'),
    )
    this.em = new Emitter()
    this.pageLoaded = false

    STORE.preloadTimeline = piezo
      .timeline({
        easing: function () {
          return function (x) {
            return Math.sqrt(1 - Math.pow(x - 1, 2))
          }
        },
        autoplay: false,
        duration: 700,
      })
      .add({
        targets: this.preloader,
        opacity: [1, 0],
        delay: 1000,
      })
      .add({
        targets: this.navWords,
        delay: piezo.stagger(20),
        translateY: ['100%', '0%'],
      })

    this.load()
  }

  async load() {
    await this.loadPages().then(async () => {
      await STORE.router.inject().then(async () => {
        STORE.router.tree.currentPage.init()
        this.loaded()
      })
    })
  }

  loadPages() {
    return new Promise(async resolve => {
      if (STORE.router.pages['/']) {
        STORE.home = STORE.router.pages['/']
        const template = STORE.home.template
        const grid = template.querySelector('.home__grid')
        const row = document.createElement('li')
        row.classList.add('home__grid--row')
        const imgWrapper = document.createElement('div')
        imgWrapper.classList.add('home__grid--row__item')
        const imgEl = document.createElement('img')
        imgEl.classList.add('home__grid--row__item--img')
        const display = template.querySelector('.home__display--item')
        const linkEl = template.querySelector('.home__display--link')
        const linkTag = document.createElement('a')
        linkTag.innerHTML = 'VIEW SITE'

        const displayMesh = this.loadDisplay(display)
        const displayMaterial = new THREE.MeshBasicMaterial({
          transparent: true,
          color: 0xf4f6f5,
        })
        displayMaterial.name = 'display__material'
        displayMesh.material = displayMaterial

        const images = await getHomeImages()
        const IMG_TRANSFORM = `?auto=format&h=240&w=240`
        const textureLoader = new THREE.TextureLoader()

        const meshArray = []
        const mediaArray = []
        this.materialArray = []

        for (let index = 0; index < images.length; index += 2) {
          const assetOne = images[index].image.asset + IMG_TRANSFORM
          const paletteOne = images[index].image.palette
          const dimensionsOne = images[index].image.dimensions
          const urlOne = images[index].websiteUrl

          const texOne = textureLoader.load(assetOne)
          const elementOne = {
            tex: texOne,
            palette: paletteOne,
            dimensions: dimensionsOne,
            url: urlOne,
          }

          const meshOne = this.loadMesh(elementOne)

          const wOne = imgWrapper.cloneNode()
          const wElOne = imgEl.cloneNode()
          wElOne.src = assetOne

          wOne.appendChild(wElOne)
          const u = row.cloneNode()
          u.appendChild(wOne)

          meshArray.push(meshOne)
          mediaArray.push(wOne)

          if (images[index + 1]) {
            const assetTwo = images[index + 1].image.asset + IMG_TRANSFORM
            const paletteTwo = images[index + 1].image.palette
            const dimensionsTwo = images[index + 1].image.dimensions
            const urlTwo = images[index + 1].websiteUrl

            const texTwo = textureLoader.load(assetTwo)
            const elementTwo = {
              tex: texTwo,
              palette: paletteTwo,
              dimensions: dimensionsTwo,
              url: urlTwo,
            }
            const meshTwo = this.loadMesh(elementTwo)

            const wTwo = imgWrapper.cloneNode()
            const wElTwo = imgEl.cloneNode()
            wElTwo.src = assetTwo

            wTwo.appendChild(wElTwo)

            u.appendChild(wTwo)

            meshArray.push(meshTwo)
            mediaArray.push(wTwo)
          }

          grid.appendChild(u)
        }
        STORE.home.webgl = meshArray
        STORE.home.media = mediaArray
        STORE.home.materialArray = this.materialArray
        STORE.home.displayMesh = {element: display, mesh: displayMesh}
        STORE.scene.add(displayMesh)

        this.loadNav()
        STORE.home.setAnimationPos()
      }

      if (STORE.router.pages['/info']) {
        const template = STORE.router.pages['/info'].template
      }

      resolve()
    })
  }

  loadMesh(element) {
    if (element) {
      const plane = new THREE.PlaneGeometry(1, 1)
      const material = new ImageMaterial({
        texture: element.tex,
        imageBounds: [element.dimensions.width, element.dimensions.height],
        scale: [element.dimensions.width, element.dimensions.height],
      })

      material.material.userData.palette = element.palette
      material.material.userData.url = element.url

      this.materialArray.push(material)
      const mesh = new THREE.Mesh(plane, material.material)
      mesh.frustumCulled = false
      STORE.scene.add(mesh)

      return mesh
    }
  }

  loadDisplay(element) {
    if (element) {
      const displayPlane = new THREE.PlaneGeometry(1, 1)
      const displayMesh = new THREE.Mesh(displayPlane)

      return displayMesh
    }
  }

  loadNav() {
    if (this.navWords) {
      this.navWords.forEach(n => {
        n.parentElement.style.overflow = 'hidden'
      })
    }
  }

  loaded() {
    this.em.emit('completed')
  }

  destroy() {
    this.preloader.remove()
  }
}
