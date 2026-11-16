float segDist(vec2 p, vec2 a, vec2 b, out float h) {
  vec2 pa = p - a, ba = b - a;
  h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
  return length(pa - ba * h);
}

float edge(vec2 p, vec2 a, vec2 b, float seed, float boost) {
  float h;
  float d = segDist(p, a, b, h);
  float line = exp(-d * 420.) * .35;
  float pulse = smoothstep(.12, 0., abs(fract(h - uTime * .25 + seed) - .5) - .38);
  return (line + exp(-d * 260.) * pulse * 1.4) * (1. + boost * 1.5);
}

vec4 effect(vec2 uv) {
  vec2 p = uv * vec2(asp, 1.);
  vec2 m = uMouse * vec2(asp, 1.);

  vec2 g = fract(p * 22.) - .5;
  vec3 col = BG + PALETTE[0] * .1 * smoothstep(.07, .0, length(g));
  col += PALETTE[0] * .08 * fbm(p * 3. + uTime * .05);

  for (int i = 0; i < uCount; i++) {
    vec2 a = nodePos(i);
    vec3 ca = palette(uNodes[i].w);

    float r = length(p - a);
    float size = .05 + .05 * uNodes[i].z;
    col += ca * exp(-r / size * 2.5) * (.5 + 1.2 * uActive[i]);

    float far = exp(-length(m - a) * 1.4);
    col += ca * edge(p, m, a, float(i) * .37, uActive[i]) * far;

    for (int j = 0; j < i; j++) {
      vec2 b = nodePos(j);
      vec3 c = mix(ca, palette(uNodes[j].w), .5);
      col += c * edge(p, a, b, hash21(vec2(float(i), float(j))), max(uActive[i], uActive[j]));
    }
  }
  col += palette(.5) * exp(-length(p - m) * 18.) * .5;
  return vec4(col, 1.);
}
