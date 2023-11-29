import * as THREE from "three"
import fragmentShader from "../shaders/fragment.glsl"
import vertexShader from "../shaders/vertex.glsl"

// Basic image material with some options
// https://github.com/pmndrs/drei/blob/d4e7f638f42b4a6a6bda175cfcc025c4c9e68c7e/src/core/Image.tsx

export default class ImageMaterial {
  constructor({
    color = new THREE.Color("white"),
    scale = 1, // Vector 2 or Array
    imageBounds = [1, 1], // Vector 2 or Array
    texture = null, // Image texture
    zoom = 1, // Number
    grayscale = false, // Boolean
    opacity = 1, // Number
    transparent = true, // Boolean
  }) {
    this.color = color
    this.scale = scale
    this.imageBounds = imageBounds
    this.texture = texture
    this.zoom = zoom
    this.grayscale = grayscale
    this.opacity = opacity
    this.transparent = transparent
    this.mouse = [0, 0]

    this.init()
  }

  init() {
    const planeBounds = Array.isArray(this.scale)
      ? [this.scale[0], this.scale[1]]
      : [this.scale, this.scale]

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tex: { value: this.texture },
        color: { value: this.color },
        scale: { value: planeBounds },
        imageBounds: { value: this.imageBounds },
        zoom: { value: this.zoom },
        grayscale: { value: this.grayscale },
        opacity: { value: this.opacity },
        mousePos: { value: this.mouse },
      },
      transparent: this.transparent,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    return this.material
  }
}
