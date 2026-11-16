const float CAM = 6., FOCAL = 3.2;
const float S = CAM / FOCAL;

float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.) / k;
  return min(a, b) - h * h * k * .25;
}

vec3 centre[MAX_NODES];
float radius[MAX_NODES];
vec3 mpos;

float map(vec3 p) {
  float d = length(p - mpos) - .18;
  for (int i = 0; i < uCount; i++) {
    d = smin(d, length(p - centre[i]) - radius[i], .45);
  }
  return d;
}
vec3 normalAt(vec3 p) {
  vec2 e = vec2(.001, 0.);
  return normalize(vec3(map(p + e.xyy) - map(p - e.xyy),
                        map(p + e.yxy) - map(p - e.yxy),
                        map(p + e.yyx) - map(p - e.yyx)));
}
vec4 effect(vec2 uv) {
  for (int i = 0; i < uCount; i++) {
    centre[i] = vec3((nodePos(i) * 2. - vec2(asp, 1.)) * S, sin(uTime * .8 + float(i) * 1.7) * .15);
    radius[i] = S * (.09 + .13 * uNodes[i].z) * (1. + .4 * uActive[i]);
  }
  vec2 p = (uv * 2. - 1.) * vec2(asp, 1.);
  mpos = vec3((uMouse * 2. - 1.) * vec2(asp, 1.) * S, 0.);
  vec3 ro = vec3(0., 0., -CAM), rd = normalize(vec3(p, FOCAL));
  float t = CAM - 2.5;
  bool hit = false;
  for (int i = 0; i < 64; i++) {
    float d = map(ro + rd * t);
    if (d < .001) {
      hit = true;
      break;
    }
    t += d;
    if (t > CAM + 3.)
      break;
  }
  vec3 col = mix(BG, mix(BG, PALETTE[0], .25), uv.y);
  if (hit) {
    vec3 pos = ro + rd * t, n = normalAt(pos);

    vec3 tint = vec3(0.);
    float ws = 0.;
    for (int i = 0; i < uCount; i++) {
      float w = exp(-2.5 * length(pos - centre[i]) / radius[i]);
      tint += palette(uNodes[i].w) * w;
      ws += w;
    }
    tint = ws > 1e-4 ? tint / ws : palette(.5);
    vec3 l = normalize(vec3(-.5, .8, -.6));
    float dif = max(dot(n, l), 0.);
    float fre = pow(1. - max(dot(n, -rd), 0.), 3.);
    float spe = pow(max(dot(reflect(-l, n), -rd), 0.), 32.);
    col = tint * (.18 + dif) + fre * mix(tint, vec3(1.), .5) * .8 + spe * .5;
  }
  col += (hash21(gl_FragCoord.xy + uTime) - .5) * .03;
  return vec4(col, 1.);
}
