import STORE from "../Store"

export default class Router {
  constructor({ pages, pagesParent }) {
    this.pages = pages
    this.pagesParent = pagesParent
    this.url = window.location.pathname
    this.tree = {
      currentPage: null,
      newPage: null,
      oldPage: null,
    }

    this.updateCurrentPage(this.url)
  }

  inject(page) {
    return new Promise((resolve, reject) => {
      if (page) {
        this.addToDom(this.pagesParent, page.template)
        page.active = true
        page.onInject()
        resolve()
      } else {
        if (STORE.url) {
          this.tree.currentPage = this.pages[STORE.url]
          this.addToDom(this.pagesParent, this.tree.currentPage.template)
          this.tree.currentPage.active = true
          this.tree.currentPage.onInject()
          resolve()
        } else {
          reject()
        }
      }
    })
  }

  remove(page) {
    return new Promise(async (resolve, reject) => {
      if (page) {
        if (page.template && this.pagesParent) {
          page.template.remove()
        }
        page.active = false
        resolve()
      } else {
        reject()
      }
    })
  }

  updateCurrentPage(page) {
    return new Promise((resolve, reject) => {
      if (page) {
        if (this.tree.currentPage !== page) {
          this.updateURL(page.path)
          this.tree.oldPage = this.tree.currentPage
          this.tree.currentPage = page
          this.tree.newPage = null

          resolve()
        } else {
          reject()
        }
      } else {
        reject()
      }
    })
  }

  updateURL(url) {
    window.history.pushState({}, document.title, url)
  }

  async route() {
    if (this.url !== STORE.url && this.pages[STORE.url]) {
      this.url = STORE.url
      this.tree.newPage = this.pages[this.url]

      await this.hidePage(this.tree.currentPage)
        .then(async () => {
          await this.updateCurrentPage(this.tree.newPage)
        })
        .then(async () => {
          await this.remove(this.tree.oldPage)
        })
        .then(async () => {
          await this.inject(this.tree.currentPage)
        })
        .then(async () => {
          await this.showPage(this.tree.currentPage)
        })
        .catch((err) => {
          console.error(err)
        })
    } else {
      return
    }
  }

  async showPage(page) {
    if (page) {
      await page.in()
    }
  }

  async hidePage(page) {
    if (page) {
      await page.out()
    }
  }

  addToDom(parent, template) {
    parent.appendChild(template)
  }
}
