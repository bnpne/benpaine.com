import STORE from "../Store"
import Emitter from "../Emitter"
import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

import piezo from "../Utils"

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
    await STORE.router.inject().then(() => {
      this.loaded()
    })
  }

  // loadPage(pageList) {
  //   return new Promise((resolve) => {
  //     for (const page of pageList) {
  //       if (page.path) {
  //         let p = new page.component({
  //           html: page.html,
  //           parent: this.pageParent,
  //         })
  //         STATE.dispatch("addPages", [[page.path, p]])
  //       } else {
  //         let n = new page.component({
  //           html: page.html,
  //           parent: this.pageParent,
  //         })
  //         STATE.dispatch("addNav", [n])
  //       }
  //     }
  //     resolve()
  //   })
  // }

  // loadTexture(el) {
  //   const l = new THREE.TextureLoader()

  //   return new Promise((resolve, reject) => {
  //     l.load(
  //       el,
  //       function (tex) {
  //         gsap.to(STATE.loader, {
  //           width: "50%",
  //         })
  //         resolve(tex)
  //       },
  //       undefined,
  //       function (err) {
  //         reject(err)
  //       }
  //     )
  //   })
  // }

  // loadGLTF() {
  //   const gltfLoader = new GLTFLoader()

  //   return new Promise((resolve, reject) => {
  //     gltfLoader.load(
  //       "/model/r5.glb",
  //       function (glb) {
  //         resolve(glb)
  //       },
  //       undefined,
  //       function (err) {
  //         console.log("error")
  //       }
  //     )
  //   })
  // }

  loaded() {
    this.em.emit("completed")
  }

  destroy() {
    this.preloader.remove()
  }
}
