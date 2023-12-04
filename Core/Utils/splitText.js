export default class SplitText {
  constructor({paragraph, lines = false, words = false}) {
    this.para = paragraph
    this.lines = lines
    this.words = words
    this.wordsArray = []
    this.linesArray = []

    if (!this.lines && !this.words) {
      return
    }

    this.init()
  }

  init() {
    // Create a copy of the text and node
    this.tempText = this.para.innerHTML
    this.tempNode = this.para.cloneNode(true)

    // Create bounds
    this.bounds = this.para.getBoundingClientRect()

    // Clear node
    this.para.innerHTML = ''

    this.createWords()
    this.build()

    if (this.lines) this.createLines()
  }

  createWords() {
    const splitWords = this.splitWords(this.tempText)
    const span = document.createElement('span')
    span.style.overflow = 'hidden'
    const innerSpan = span.cloneNode()
    span.style.display = 'inline'

    splitWords.forEach(w => {
      const ws = span.cloneNode()
      const is = innerSpan.cloneNode()

      const text = document.createTextNode(w)

      if (this.lines) {
        ws.appendChild(text)
      } else {
        is.appendChild(text)
        ws.appendChild(is)
      }

      this.wordsArray.push(ws)
    })
  }

  createLines() {
    const cs = window.getComputedStyle(this.para, null)
    const fontSize = parseFloat(cs.fontSize)
    const lineThreshold = fontSize * 0.2
    let lineOffset = null

    const wordsInEachLine = [] // paragraph
    let wordsInCurrentLine = [] // words
    this.linesArray = []

    // Iterate through words and separate into lines

    this.wordsArray.forEach(w => {
      const {top} = this.getPosition(w, this.para)

      if (lineOffset === null || top - lineOffset >= lineThreshold) {
        lineOffset = top
        wordsInEachLine.push((wordsInCurrentLine = []))
      }

      wordsInCurrentLine.push(w)
    })

    // Remove inner html

    this.para.innerHTML = ''

    // Create line text element

    wordsInEachLine.forEach(wa => {
      const span = document.createElement('span')
      span.style.overflow = 'hidden'
      const innerSpan = span.cloneNode()
      span.style.display = 'block'

      let lineString = ''

      wa.forEach((w, i) => {
        lineString += w.innerHTML
        if (i < wa.length) {
          lineString += ' '
        }
      })

      if (lineString !== ' ') {
        const text = document.createTextNode(lineString)

        innerSpan.appendChild(text)
        span.appendChild(innerSpan)
        this.linesArray.push(span)
      }
    })

    this.linesArray.forEach(la => {
      this.para.appendChild(la)
    })
  }

  build() {
    if (this.para.innerHTML !== '') {
      this.para.innerHTML = ''
    }
    if (this.wordsArray) {
      this.wordsArray.forEach((w, i) => {
        this.para.appendChild(w)

        if (i < this.wordsArray.length) {
          this.para.append(' ')
        }
      })
    }
  }

  splitWords(element) {
    // Splits words by space
    if (element instanceof Element) {
      return element.innerHTML.trim().split(/\s+/)
    } else {
      return element.split(/\s+/)
    }
  }

  getPosition(node, parent) {
    const parentRect = parent.getBoundingClientRect()
    const {width, height, x, y} = node.getBoundingClientRect()
    const top = y - parentRect.y
    const left = x - parentRect.x

    return {width, height, top, left}
  }

  resize() {
    if (this.words) {
      return
    }

    if (this.lines) {
      this.build()
      this.createLines()
    }
  }
}
