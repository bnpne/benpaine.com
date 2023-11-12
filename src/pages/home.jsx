import Page from "../../Core/Page/Page"

function homeHtml() {
  return (
    <section id="page" class="home">
      <h1>Home</h1>
      <div class='section'></div>
      <div class='section'></div>
      <div class='section'></div>
      <div class='section'></div>
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
}

