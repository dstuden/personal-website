const float CELL = 4.;

float bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2. + a.y * a.y * .75);
}
float bayer4(vec2 a) { return bayer2(.5 * a) * .25 + bayer2(a); }

vec4 effect(vec2 uv) {
  vec2 px = floor(uv * uRes / CELL);
  vec2 pos = (px + .5) * CELL;
  vec2 puv = pos / uRes;

  vec2 p = (puv - .5) * vec2(asp, 1.) * 4.;
  float v = sin(p.x * 1.3 + uTime) + sin(p.y * 1.7 - uTime * .7) +
            sin(length(p) * 2. - uTime * 1.2);
  v = v / 8. + .15 + (fbm(p + uTime * .1) - .5) * .4;

  float spacing = sqrt(uRes.x * uRes.y * .6 / max(float(uCount), 1.));
  float scale = clamp(spacing / 280., .55, 1.);

  float glow = 0.;
  vec3 tint = vec3(0.);
  float tw = 0.;
  for (int i = 0; i < uCount; i++) {
    vec4 n = uNodes[i];
    float act = uActive[i];
    float r = (40. + 60. * n.z) * scale * (1. + .7 * act);
    float g = exp(-length(pos - n.xy * uRes) / r) * min(1., .7 + .3 * n.z + .4 * act);
    glow += g - glow * g;
    tint += palette(n.w) * g;
    tw += g;
  }
  float m = exp(-length(pos - uMouse * uRes) / 70.) * .8;
  glow += m - glow * m;

  v += glow * 1.15;
  float on = step(bayer4(px), clamp(v, 0., 1.)) * .45;

  vec3 ink = mix(FG, tw > 1e-3 ? tint / tw : FG, clamp(tw, 0., 1.) * .85);
  return vec4(mix(BG, ink, on), 1.);
}
