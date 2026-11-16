varying vec2 vUv;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;

uniform int uCount;
uniform vec4 uNodes[MAX_NODES];

uniform float uActive[MAX_NODES];

float asp;

vec2 nodePos(int i) { return uNodes[i].xy * vec2(asp, 1.); }

vec3 palette(float t) {
  t = clamp(t, 0., 1.) * float(PAL_N - 1);
  int i = min(int(t), PAL_N - 2);
  return mix(PALETTE[i], PALETTE[i + 1], t - float(i));
}

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1, 0)), u.x),
             mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float a = .5, s = 0.;
  mat2 r = mat2(.8, .6, -.6, .8);
  for (int i = 0; i < 5; i++) {
    s += a * noise(p);
    p = r * p * 2.02;
    a *= .5;
  }
  return s;
}

float edgeFade(vec2 uv) {
  return smoothstep(0., .07, uv.y) * smoothstep(0., .07, 1. - uv.y);
}
