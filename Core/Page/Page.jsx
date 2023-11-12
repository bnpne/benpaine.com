export default class Page {
  constructor({ parent, webgl, html, path }) {
    this.webgl = webgl ?? null
    this.html = html ?? null
    this.parent = parent ?? null
    this.active = false
    this.path = path ?? null
    this.animas = []
    this.template = null

    this.create()
  }

  create() {
    // Load HTML
    if (this.html) {
      this.template = render(this.html)
    } else {
      return
    }
    // Load GL
    if (this.webgl) {
      this.loadGl()
    }

    // Create In and Out
    // this.createAnima()

    this.created = true
    this.createAnima()
  }

  loadGl() {
    if (this.webgl) {
      this.webgl.forEach((m, i) => {
        const plane = new THREE.PlaneGeometry(1, 1);
        // const material = new THREE.MeshBasicMaterial({ color: 0x151515 });
        const material = new THREE.ShaderMaterial({
          uniforms: {
            color: { value: new THREE.Color("white") },
            grayscale: { value: 0 },
            zoom: { value: 1 },
            opacity: { value: 1 },
            tex: { value: STATE.textures[ 0 ] },
            scale: { value: new THREE.Vector2(1, 1) },
            imageBounds: {
              value: new THREE.Vector2(
                STATE.textures[ 0 ].source.data.naturalWidth,
                STATE.textures[ 0 ].source.data.naturalHeight
              ),
            },
          },
          transparent: true,
          fragmentShader: fragmentShader,
          vertexShader: vertexShader,
        });

        const mesh = new THREE.Mesh(plane, material);

        this.webglMedia.push(mesh);
        this.webglMedia[ i ].newPos = { x: 0, y: 0 };

        STATE.scene.add(mesh);
      });
    }
  }

  createAnima() { }

  intro() { }

  in() {
    return Promise.resolve()
  }

  out() {
    this.animas.forEach((anima) => {
      anima.out()
    })

    return Promise.resolve()
  }

  updatePath(path) {
    this.path = path
  }
}
