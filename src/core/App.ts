import { effects, type EffectKey } from '../effects';
import { getPalette, paletteAt } from './palette';
import { MAX_NODES, ShaderEffect, type DrawState } from './ShaderEffect';
import { SmoothScroll } from './SmoothScroll';
import { clamp01, damp, type Rate } from './units';

export interface Stage {
    el: HTMLElement;
    effect: EffectKey;
}

interface StageState extends Stage, DrawState {
    nodeEls: HTMLElement[];
}

const POINTER_RATE: Rate = 6;

const ACTIVE_RATE: Rate = 8;

const toStageX = (x: number, rect: DOMRect) => (x - rect.left) / rect.width;
const toStageY = (y: number, rect: DOMRect) => 1 - (y - rect.top) / rect.height;

function collectNodes(s: StageState): void {
    const prev = new Map(s.nodeEls.map((el, i) => [el, s.nodes[i * 4 + 3]]));
    const els = [...s.el.querySelectorAll<HTMLElement>('.node')];
    s.nodeEls = els.slice(0, MAX_NODES);
    s.count = s.nodeEls.length;
    s.nodeEls.forEach((el, i) => {
        const hue = Number(el.dataset.hue ?? (els.length > 1 ? i / (els.length - 1) : 0.5));
        s.nodes[i * 4 + 2] = Number(el.dataset.weight ?? 0.5);
        s.nodes[i * 4 + 3] = prev.get(el) ?? 0;
        s.colors.set(paletteAt(hue), i * 3);
    });
}

export class App {
    private readonly canvas: HTMLCanvasElement;
    private readonly gl: WebGL2RenderingContext;
    private readonly scroll: SmoothScroll;
    private readonly stages: StageState[];
    private programs = new Map<EffectKey, ShaderEffect>();

    private pointerX = -1e4;
    private pointerY = -1e4;
    private dpr = 1;
    private drewLast = true;
    private last = performance.now();

    constructor(
        canvas: HTMLCanvasElement,
        content: HTMLElement,
        spacer: HTMLElement,
        stages: Stage[],
    ) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl2', {
            antialias: false,
            alpha: false,
            depth: false,
            stencil: false,
            powerPreference: 'high-performance',
        })!;
        this.scroll = new SmoothScroll(content, spacer, [
            ...content.querySelectorAll<HTMLElement>('.panel'),
        ]);
        this.stages = stages.map((s) => {
            const state: StageState = {
                ...s,
                mouseX: 0.5,
                mouseY: 0.5,
                nodeEls: [],
                count: 0,
                nodes: new Float32Array(MAX_NODES * 4),
                colors: new Float32Array(MAX_NODES * 3),
            };
            collectNodes(state);
            new MutationObserver(() => collectNodes(state)).observe(s.el, {
                childList: true,
                subtree: true,
            });
            return state;
        });

        addEventListener('resize', this.resize);
        addEventListener('pointermove', (e) => {
            this.pointerX = e.clientX;
            this.pointerY = e.clientY;
        });
        canvas.addEventListener('webglcontextlost', (e) => e.preventDefault());
        canvas.addEventListener('webglcontextrestored', this.compile);
        this.compile();
        this.resize();
        requestAnimationFrame(this.frame);
    }

    private compile = (): void => {
        const [r, g, b] = getPalette().bg;
        this.gl.clearColor(r, g, b, 1);
        const keys = new Set(this.stages.map((s) => s.effect));
        this.programs = new Map([...keys].map((k) => [k, new ShaderEffect(this.gl, effects[k])]));
    };

    private resize = (): void => {
        this.dpr = Math.min(devicePixelRatio, 2);
        this.canvas.width = Math.floor(innerWidth * this.dpr);
        this.canvas.height = Math.floor(innerHeight * this.dpr);
    };

    private frame = (now: DOMHighResTimeStamp): void => {
        requestAnimationFrame(this.frame);
        const dt = Math.min((now - this.last) / 1000, 0.1);
        this.last = now;

        this.scroll.update(dt);

        const { gl, dpr } = this;
        if (gl.isContextLost()) return;

        const visible = this.stages
            .map((s) => [s, s.el.getBoundingClientRect()] as const)
            .filter(([, r]) => r.bottom >= 0 && r.top <= innerHeight && r.width > 0);
        if (!visible.length && !this.drewLast) return;
        this.drewLast = visible.length > 0;

        gl.disable(gl.SCISSOR_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.SCISSOR_TEST);

        for (const [s, rect] of visible) {
            s.mouseX = damp(s.mouseX, clamp01(toStageX(this.pointerX, rect)), POINTER_RATE, dt);
            s.mouseY = damp(s.mouseY, clamp01(toStageY(this.pointerY, rect)), POINTER_RATE, dt);

            s.nodeEls.forEach((el, i) => {
                const b = el.getBoundingClientRect();
                const target = el.matches(':hover, :focus-within') ? 1 : 0;
                s.nodes[i * 4] = toStageX(b.left + b.width / 2, rect);
                s.nodes[i * 4 + 1] = toStageY(b.top + b.height / 2, rect);
                s.nodes[i * 4 + 3] = damp(s.nodes[i * 4 + 3], target, ACTIVE_RATE, dt);
            });

            const x = Math.round(rect.left * dpr);
            const y = Math.round((innerHeight - rect.bottom) * dpr);
            const w = Math.round(rect.width * dpr);
            const h = Math.round(rect.height * dpr);
            gl.viewport(x, y, w, h);
            gl.scissor(x, y, w, h);
            this.programs.get(s.effect)!.draw(now / 1000, rect.width, rect.height, s);
        }
    };
}
