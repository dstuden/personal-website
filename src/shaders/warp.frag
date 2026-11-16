vec4 effect(vec2 uv) {
  vec2 q = uv * vec2(asp, 1.);
  vec3 tint = vec3(0.);
  float field = 0.;
  for (int i = 0; i < uCount; i++) {
    vec2 c = nodePos(i);
    float s = (.18 + .22 * uNodes[i].z) * (1. + .5 * uActive[i]);
    vec2 v = q - c;
    float w = exp(-dot(v, v) / (s * s));
    float a = w * (1.5 + 3. * uActive[i]) * (mod(float(i), 2.) * 2. - 1.);
    float ca = cos(a), sa = sin(a);
    q = c + mat2(ca, -sa, sa, ca) * v;
    tint += palette(uNodes[i].w) * w;
    field += w;
  }
  vec2 p = q * 3.;
  float t = uTime * .12;
  vec2 m = (uMouse - .5);
  float f1 = fbm(p + t + m);
  float f2 = fbm(p + 4. * f1 + vec2(1.7, 9.2) - t);

  vec3 base = mix(BG, palette(smoothstep(.15, .85, f2)), .3 * (.3 + f2 * 1.4));
  vec3 lit = (tint / max(field, 1e-3)) * (.3 + 1.1 * f2);
  return vec4(mix(base, lit, clamp(field, 0., 1.)), 1.);
}
