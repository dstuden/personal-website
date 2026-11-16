import type { Seconds } from './units';
import { paletteGlsl } from './palette';
import common from '../shaders/common.glsl?raw';
import footer from '../shaders/footer.glsl?raw';

export const MAX_NODES = 16;

const vertex = `#version 300 es
out vec2 vUv;
void main() {
  vUv = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(vUv * 2. - 1., 0., 1.);
}`;

export interface DrawState {
    mouseX: number;
    mouseY: number;
    count: number;
    nodes: Float32Array;
    colors: Float32Array;
}

const locate = (gl: WebGL2RenderingContext, p: WebGLProgram) => ({
    time: gl.getUniformLocation(p, 'uTime'),
    res: gl.getUniformLocation(p, 'uRes'),
    mouse: gl.getUniformLocation(p, 'uMouse'),
    count: gl.getUniformLocation(p, 'uCount'),
    nodes: gl.getUniformLocation(p, 'uNodes'),
    colors: gl.getUniformLocation(p, 'uColor'),
});

export class ShaderEffect {
    private readonly gl: WebGL2RenderingContext;
    private readonly program: WebGLProgram;
    private readonly ext: KHR_parallel_shader_compile | null;
    private loc: ReturnType<typeof locate> | undefined;
    private ok: boolean | undefined;

    constructor(gl: WebGL2RenderingContext, fragment: string) {
        this.gl = gl;
        this.ext = gl.getExtension('KHR_parallel_shader_compile');
        this.program = gl.createProgram();
        const source = [
            '#version 300 es',
            'precision highp float;',
            'precision highp int;',
            `#define MAX_NODES ${MAX_NODES}`,
            paletteGlsl(),
            common,
            fragment,
            footer,
        ].join('\n');
        for (const [type, src] of [
            [gl.VERTEX_SHADER, vertex],
            [gl.FRAGMENT_SHADER, source],
        ] as const) {
            const s = gl.createShader(type)!;
            gl.shaderSource(s, src);
            gl.compileShader(s);
            gl.attachShader(this.program, s);
            gl.deleteShader(s);
        }
        gl.linkProgram(this.program);
    }

    private ready(): boolean {
        const { gl, program, ext } = this;
        if (this.ok !== undefined) return this.ok;
        if (ext && !gl.getProgramParameter(program, ext.COMPLETION_STATUS_KHR)) return false;
        this.ok = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean;
        if (this.ok) this.loc = locate(gl, program);
        else
            console.error(
                gl.getProgramInfoLog(program),
                ...gl.getAttachedShaders(program)!.map((s) => gl.getShaderInfoLog(s)),
            );
        return this.ok;
    }

    draw(time: Seconds, width: number, height: number, s: DrawState): void {
        if (!this.ready()) return;
        const { gl } = this;
        const l = this.loc!;
        gl.useProgram(this.program);
        gl.uniform1f(l.time, time);
        gl.uniform2f(l.res, width, height);
        gl.uniform2f(l.mouse, s.mouseX, s.mouseY);
        gl.uniform1i(l.count, s.count);
        gl.uniform4fv(l.nodes, s.nodes);
        gl.uniform3fv(l.colors, s.colors);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}
