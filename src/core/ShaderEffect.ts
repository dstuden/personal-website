import {
    Mesh,
    OrthographicCamera,
    PlaneGeometry,
    Scene,
    ShaderMaterial,
    NoBlending,
    Vector2,
    Vector4,
    type IUniform,
} from 'three';
import type { Effect, FrameContext } from './Effect';
import type { Seconds } from './units';
import { paletteGlsl } from './palette';
import common from '../shaders/common.glsl?raw';
import footer from '../shaders/footer.glsl?raw';

export const MAX_NODES = 16;

type Uniforms = {
    uTime: IUniform<Seconds>;
    uRes: IUniform<Vector2>;
    uMouse: IUniform<Vector2>;
    uCount: IUniform<number>;
    uNodes: IUniform<Vector4[]>;
    uActive: IUniform<Float32Array>;
};

const vertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

export class ShaderEffect implements Effect {
    private readonly scene = new Scene();
    private readonly camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    private readonly uniforms: Uniforms = {
        uTime: { value: 0 },
        uRes: { value: new Vector2(1, 1) },
        uMouse: { value: new Vector2(0.5, 0.5) },
        uCount: { value: 0 },
        uNodes: { value: Array.from({ length: MAX_NODES }, () => new Vector4()) },
        uActive: { value: new Float32Array(MAX_NODES) },
    };

    constructor(fragment: string) {
        const material = new ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: [
                `#define MAX_NODES ${MAX_NODES}`,
                paletteGlsl(),
                common,
                fragment,
                footer,
            ].join('\n'),
            uniforms: this.uniforms,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false,
        });
        this.scene.add(new Mesh(new PlaneGeometry(2, 2), material));
    }

    render(ctx: FrameContext): void {
        const u = this.uniforms;
        u.uTime.value = ctx.time;
        u.uRes.value.copy(ctx.resolution);
        u.uMouse.value.copy(ctx.mouse);
        const n = Math.min(ctx.nodes.length, MAX_NODES);
        u.uCount.value = n;
        for (let i = 0; i < n; i++) {
            const d = ctx.nodes[i];
            u.uNodes.value[i].set(d.x, d.y, d.weight, d.hue);
            u.uActive.value[i] = d.active;
        }
        ctx.renderer.render(this.scene, this.camera);
    }
}
