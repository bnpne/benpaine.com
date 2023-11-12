import Page from "../../Core/Page/Page"

function aboutHtml() {
  return (
    <section id="page" class="about">
      <h1>About</h1>
    </section>
  )
}

export default class About extends Page {
  constructor() {
    super({ html: aboutHtml(), path: "/about" })
  }

  create() {
    super.create()
  }
}

