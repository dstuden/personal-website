void main() {
  asp = uRes.x / uRes.y;
  vec4 c = effect(vUv);
  c.a *= edgeFade(vUv);
  gl_FragColor = vec4(c.rgb * c.a, c.a);
}
