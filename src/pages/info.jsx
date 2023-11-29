import Page from "../../Core/Page/Page"
import STORE from '../../Core/Store'
import piezo from "../../Core/Utils"
import SplitText from "../../Core/Utils/splitText"

function infoHtml() {
  return (
    <section id="page" class="info">
      <div class='info__container'>
        <div class='info__container--item'>
          <div data-para>
            Ben Paine is an Independent Developer and Designer based out of San Diego, California. Working with clientele World-Wide and Remotely. Ben Paine is represented by minimalism, brutalism, and fluid interaction.
          </div>
          <div data-para>
            Collaboration is in his nature. Ben works with clients on a partner level. Strategizing, developing, and designing identity and brands digitally on the Web.
          </div>
          <div data-para>
            Capabilities include but not limited to
            Javascript / Typescript,
            Next.js / React,
            Sanity CMS,
            CraftCMS, Wordpress,
            Drupal,
            GSAP,
            SQL,
            Threejs,
            WebGL, Vite, etc.
          </div>
          <div data-para>
            If you'd like to see a specific kind of work, feel free to reach out. For more information or to discuss a potential project, shoot me an email or drop a message via socials.
          </div>
          <ul>
            <li>
              <a data-para href="mailto:bentppaine@gmail.com">
                bentppaine(at)gmail(dot)com
              </a>
            </li>
            <li>
              <a data-para target="_blank" href="https://twitter.com/bn_pne">
                X(dot)com
              </a>
            </li>
            <li>
              <a data-para target="_blank" href="https://www.instagram.com/bnpne/">
                Instagram(dot)com
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default class Info extends Page {
  constructor() {
    super({ html: infoHtml(), path: "/info" })
  }

  create() {
    super.create()
    this.splitTextArray = []
    this.animaArray = []
  }

  init() {
    console.log('init')

    STORE.preloadTimeline.add({
      targets: this.animaArray,
      delay: piezo.stagger(50),
      translateY: [ "100%", "0%" ],
    }, '-=600')
  }

  onInject() {
    this.setSplitText()
  }

  setSplitText() {
    if (this.splitTextArray.length === 0) {
      this.paragraphs = Array.prototype.slice.call(this.template.querySelectorAll('[data-para]'))

      this.paragraphs.forEach(p => {
        const st = new SplitText({ paragraph: p, lines: true })
        this.splitTextArray.push(st)
      })
    }

    this.splitTextArray.forEach(paras => {
      paras.linesArray.forEach(p => {
        this.animaArray.push(p.childNodes[ 0 ])
      })
    })
  }

  resize() {
    super.resize()

    this.splitTextArray.forEach(paras => {
      paras.resize()
    })
  }

  in() {
    return new Promise(resolve => {
      piezo({
        targets: this.animaArray,
        duration: 700,
        delay: piezo.stagger(50),
        translateY: [ "100%", "0%" ],
        easing: function () {
          return function (x) {
            return Math.sqrt(1 - Math.pow(x - 1, 2))
          }
        },
        complete: function () {
          resolve()
        }
      })
    })
  }

  out() {
    return new Promise(resolve => {
      piezo({
        targets: this.animaArray,
        duration: 700,
        delay: piezo.stagger(50, { from: 'last' }),
        translateY: [ "0%", "100%" ],
        easing: function () {
          return function (x) {
            return x * x * x;
          }
        },
        complete: function () {
          resolve()
        }
      })
    })
  }
}

