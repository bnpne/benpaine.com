// Source https://github.com/pmndrs/drei/blob/d4e7f638f42b4a6a6bda175cfcc025c4c9e68c7e/src/core/Image.tsx

varying vec2 vUv;

uniform vec2 scale;
uniform vec2 imageBounds;
uniform vec3 color;
uniform sampler2D tex;
uniform float zoom;
uniform float grayscale;
uniform float opacity;

const vec3 luma = vec3(.299, 0.587, 0.114);

vec4 toGrayscale(vec4 color, float intensity) {
  return vec4(mix(color.rgb, vec3(dot(color.rgb, luma)), intensity), color.a);
}

vec2 aspect(vec2 size) {
  return size / min(size.x, size.y);
}

void main() {
  vec2 s = aspect(scale);
  vec2 i = aspect(imageBounds);

  float rs = s.x / s.y;
  float ri = i.x / i.y;

  vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);

  vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;

  vec2 uv = vUv * s / new + offset;

  vec2 zUv = (uv - vec2(0.5, 0.5)) / zoom + vec2(0.5, 0.5);

  gl_FragColor = toGrayscale(texture2D(tex, zUv) * vec4(color, opacity), grayscale);
}