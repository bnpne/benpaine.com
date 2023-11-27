import Page from "../../Core/Page/Page"

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
    console.log(this.webgl)
  }
}

