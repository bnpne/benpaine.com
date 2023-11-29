import "./styles/index.scss"

// Core
import STORE from "../Core/Store"
import R from "../Core/R"
import Canvas from "../Core/Canvas"
import Preloader from "../Core/Preloader"
import Router from "../Core/Router"
import Lenis from "@studio-freight/lenis"

// Pages
// Import your pages here
// These will be loaded by the preloader
import Home from "./pages/home"
import Info from "./pages/info"

// Admin
import { renderStudio } from "sanity"
import { config } from "../Core/Admin"

class App {
  constructor() {
    this.app = document.querySelector("#app")
    this.main = document.querySelector("#main")
    this.admin = document.querySelector("#admin")

    if (
      window.location.pathname === "/admin" ||
      window.location.pathname.indexOf("/admin") === 0
    ) {
      this.app.remove()
      window.history.pushState({}, document.title, "/admin")
      const preloadElement = document.querySelector("[data-preloader]")
      preloadElement.remove()

      this.loadAdmin()
    } else {
      document.documentElement.style.fontSize = `calc(100vw / 1728 * 10)`

      this.admin.remove()
      const r = document.querySelector("#r")
      const preloadElement = document.querySelector("[data-preloader]")
      this.pagesParent = document.querySelector("#app")
      STORE.url = window.location.pathname

      STORE.setUrl = function (data) {
        this.url = data
      }

      this.pages = {
        "/": new Home(),
        "/info": new Info(),
      }

      STORE.router = new Router({
        pages: this.pages,
        pagesParent: this.pagesParent,
      })

      STORE.preloader = new Preloader({
        el: preloadElement,
        pagesParent: this.pagesParent,
      })

      STORE.canvas = new Canvas({ el: r })

      this.load()
    }
  }

  loadAdmin() {
    renderStudio(this.admin, config)
  }

  load() {
    STORE.preloader.em.on("completed", () => {
      this.init()
    })
  }

  init() {
    STORE.lenis = new Lenis({
      lerp: 0.1,
      wrapper: this.main,
      content: this.app,
    })
    R.add(() => this.loop())
    R.add((time) => {
      STORE.lenis.raf(time)
    }, 0)

    STORE.lenis.on("scroll", ({ scroll }) => this.scroll())

    // this.resize()
    this.listeners()
    this.linkListeners()

    STORE.preloadTimeline.play()
    STORE.preloadTimeline.finished.then(() => {
      STORE.preloader.destroy()
    })
  }

  listeners() {
    window.addEventListener("resize", this.resize.bind(this), {
      passive: true,
    })
    window.addEventListener("popstate", this.popState.bind(this), {
      passive: true,
    })

    window.addEventListener("mousemove", (e) => this.handleMouseMove(e), {
      passive: true,
    })
  }

  handleMouseMove(e) {
    if (STORE.home) {
      STORE.home.handleMouseMove(e)
    }
  }

  linkListeners() {
    const links = document.querySelectorAll("a")

    links.forEach((l) => {
      const local = l.href.indexOf(window.location.origin) > -1

      if (local) {
        l.onclick = (e) => {
          e.preventDefault()

          if (l.getAttribute("href") !== window.location.pathname) {
            STORE.dispatch("setUrl", [l.getAttribute("href")])
            STORE.router.route()
          }
        }
      } else if (
        l.href.indexOf("mailto") === -1 &&
        l.href.indexOf("tel") === -1
      ) {
        l.rel = "noopener"
        l.target = "_blank"
      }
    })
  }

  popState() {
    STORE.dispatch("setUrl", [window.location.pathname])
    STORE.router.route()
  }

  scroll() {
    STORE.router.tree.currentPage.scroll()
  }

  resize() {
    STORE.canvas && STORE.canvas.resize()
    STORE.router.tree.currentPage.resize()
  }

  loop() {
    if (STORE.canvas) STORE.canvas.loop()
  }
}

new App()
