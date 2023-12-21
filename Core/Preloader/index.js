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

        // Main Grid
        const grid = template.querySelector('.home__grid')
        const item = document.createElement('li')
        item.classList.add('home__grid--item')
        const imgNode = document.createElement('img')
        imgNode.classList.add('home__grid--item__img')

        // Main Map
        const map = template.querySelector('.home__map')
        const mapItem = document.createElement('li')
        mapItem.classList.add('home__map--item')

        // Selected Grid
        // const selected = template.querySelector('.home__selected')
        // const selectedItem = document.createElement('li')
        // selectedItem.classList.add('home__selected--item')
        // const selectedImg = document.createElement('img')
        // selectedImg.classList.add('home__selected--item__img')

        // const row = document.createElement('li')
        // row.classList.add('home__grid--row')
        // const imgWrapper = document.createElement('div')
        // imgWrapper.classList.add('home__grid--row__item')
        // const imgEl = document.createElement('img')
        // imgEl.classList.add('home__grid--row__item--img')
        // const display = template.querySelector('.home__display--item')
        // const linkEl = template.querySelector('.home__display--link')
        // const linkTag = document.createElement('a')

        // const toggleRow = template.querySelector('.home__row')
        // const toggleItem = document.createElement('li')
        // toggleItem.classList.add('home__row--item')
        // linkTag.innerHTML = 'VIEW SITE'

        // const displayMesh = this.loadDisplay(display)
        // const displayMaterial = new THREE.MeshBasicMaterial({
        //   transparent: true,
        //   color: 0xf4f6f5,
        // })
        // displayMaterial.name = 'display__material'
        // displayMesh.material = displayMaterial

        const images = await getHomeImages()
        const IMG_TRANSFORM = `?auto=format&h=240&w=240`
        const textureLoader = new THREE.TextureLoader()

        const meshArray = []
        const mediaArray = []
        const mapArray = []
        this.materialArray = []

        images.forEach((image, i) => {
          const asset = image.image.asset
          const palette = image.image.palette
          const dimensions = image.image.dimensions
          const url = image.websiteUrl

          // Create Grid Node
          const itemNode = item.cloneNode()
          const img = imgNode.cloneNode()
          img.src = asset

          // Create Grid Node
          const mapNode = mapItem.cloneNode()
          mapArray.push(mapNode)

          // Append Grid Node
          itemNode.appendChild(img)
          grid.appendChild(itemNode)
          mediaArray.push(itemNode)

          // Append Map Node
          map.appendChild(mapNode)

          // Create WebGL
          const tex = textureLoader.load(asset + IMG_TRANSFORM)
          const element = {
            tex: tex,
            palette: palette,
            dimensions: dimensions,
            url: url,
          }

          const mesh = this.loadMesh(element)
          meshArray.push(mesh)
        })

        STORE.home.webgl = meshArray
        STORE.home.media = mediaArray
        STORE.home.mapMedia = mapArray

        const displayPlane = new THREE.PlaneGeometry(1, 1)
        const displayMaterial = new THREE.MeshBasicMaterial({
          opacity: 0,
          color: 0x000000,
        })
        const displayMesh = new THREE.Mesh(displayPlane, displayMaterial)

        displayMesh.frustumCulled = false
        STORE.scene.add(displayMesh)

        STORE.home.displayMesh = displayMesh

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
