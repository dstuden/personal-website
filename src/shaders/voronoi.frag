float cellWeight(int i) {
  return (.3 + uNodes[i].z * .9) * (1. + .3 * uNodes[i].w);
}

vec4 effect(vec2 uv) {
  vec2 p = uv * vec2(asp, 1.);
  if (uCount == 0)
    return vec4(0.);

  float d1 = 1e3;
  int i1 = 0;
  for (int i = 0; i < uCount; i++) {
    float d = length(p - nodePos(i)) / cellWeight(i);
    if (d < d1) {
      d1 = d;
      i1 = i;
    }
  }

  vec2 g1 = normalize(p - nodePos(i1) + 1e-6) / cellWeight(i1);
  float edgePx = 1e4;
  int ie = i1;
  for (int j = 0; j < uCount; j++) {
    if (j == i1)
      continue;
    vec2 v = p - nodePos(j);
    float wj = cellWeight(j);
    vec2 grad = normalize(v + 1e-6) / wj - g1;
    float e = (length(v) / wj - d1) / max(length(grad), 1e-3) * uRes.y;
    if (e < edgePx) {
      edgePx = e;
      ie = j;
    }
  }

  float act = uNodes[i1].w;
  float pairAct = max(act, uNodes[ie].w);
  vec3 base = uColor[i1];
  vec3 seam = mix(base, uColor[ie], .5);

  float rings = .5 + .5 * sin(d1 * 60. - uTime * 1.5);
  float light = exp(-3. * length((uv - uMouse) * vec2(asp, 1.)));

  vec3 col = base * (.15 + .18 * rings) * exp(-d1 * .8) * (.75 + .45 * act);
  col += base * .45 * exp(-d1 * 6.) * (.5 + .4 * act);
  col += base * light * .12;

  float line = 1. - smoothstep(.5, 2., edgePx);
  float halo = exp(-edgePx / 14.);
  vec3 ink = mix(seam, vec3(1.), .35);
  col += ink * (line * .55 + halo * .22) * (1. + .35 * pairAct);
  return vec4(col, 1.);
}
