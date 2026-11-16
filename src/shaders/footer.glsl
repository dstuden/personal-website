out vec4 fragColor;

void main() {
  asp = uRes.x / uRes.y;
  vec4 c = effect(vUv);
  fragColor = vec4(mix(BG, c.rgb, c.a * edgeFade(vUv)), 1.);
}
