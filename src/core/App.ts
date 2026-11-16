import { Vector2, WebGLRenderer } from 'three';
import type { Effect, NodeData } from './Effect';
import { SmoothScroll } from './SmoothScroll';
import { clamp01, damp, type Rate } from './units';

export interface Stage {
    el: HTMLElement;
    effect: Effect;
}

interface NodeEl extends Pick<NodeData, 'weight' | 'hue'> {
    el: HTMLElement;
}

interface StageState extends Stage {
    mouse: Vector2;
    size: Vector2;
    nodeEls: NodeEl[];
    nodes: NodeData[];
}

const POINTER_RATE: Rate = 6;

const ACTIVE_RATE: Rate = 8;

function collectNodes(section: HTMLElement): NodeEl[] {
    const els = [...section.querySelectorAll<HTMLElement>('.node')];
    return els.map((el, i) => ({
        el,
        weight: Number(el.dataset.weight ?? 0.5),
        hue: Number(el.dataset.hue ?? (els.length > 1 ? i / (els.length - 1) : 0.5)),
    }));
}

const toStageX = (x: number, rect: DOMRect) => (x - rect.left) / rect.width;
const toStageY = (y: number, rect: DOMRect) => 1 - (y - rect.top) / rect.height;

export class App {
    private readonly renderer: WebGLRenderer;
    private readonly scroll: SmoothScroll;
    private readonly stages: StageState[];

    private readonly pointer = new Vector2(-1e4, -1e4);

    private readonly active = new WeakMap<HTMLElement, number>();
    private last = performance.now();

    constructor(
        canvas: HTMLCanvasElement,
        content: HTMLElement,
        spacer: HTMLElement,
        stages: Stage[],
    ) {
        this.renderer = new WebGLRenderer({
            canvas,
            alpha: true,
            antialias: false,
            powerPreference: 'high-performance',
        });
        this.renderer.setClearColor(0x000000, 0);
        this.scroll = new SmoothScroll(content, spacer);
        this.stages = stages.map((s) => {
            const state: StageState = {
                ...s,
                mouse: new Vector2(0.5, 0.5),
                size: new Vector2(),
                nodeEls: collectNodes(s.el),
                nodes: [],
            };
            new MutationObserver(() => (state.nodeEls = collectNodes(s.el))).observe(s.el, {
                childList: true,
                subtree: true,
            });
            return state;
        });

        addEventListener('resize', this.resize);
        addEventListener('pointermove', (e) => this.pointer.set(e.clientX, e.clientY));
        this.resize();
        requestAnimationFrame(this.frame);
    }

    private resize = (): void => {
        this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

        this.renderer.setSize(innerWidth, innerHeight, false);
    };

    private frame = (now: DOMHighResTimeStamp): void => {
        const dt = Math.min((now - this.last) / 1000, 0.1);
        this.last = now;
        const time = now / 1000;

        this.scroll.update(dt);

        const r = this.renderer;
        r.setScissorTest(false);
        r.clear();
        r.setScissorTest(true);

        for (const s of this.stages) {
            const rect = s.el.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > innerHeight || rect.width === 0) continue;

            const tx = clamp01(toStageX(this.pointer.x, rect));
            const ty = clamp01(toStageY(this.pointer.y, rect));
            s.mouse.set(
                damp(s.mouse.x, tx, POINTER_RATE, dt),
                damp(s.mouse.y, ty, POINTER_RATE, dt),
            );
            s.size.set(rect.width, rect.height);

            s.nodes.length = 0;
            for (const { el, weight, hue } of s.nodeEls) {
                const b = el.getBoundingClientRect();
                const target = el.matches(':hover, :focus-within') ? 1 : 0;
                const active = damp(this.active.get(el) ?? 0, target, ACTIVE_RATE, dt);
                this.active.set(el, active);
                s.nodes.push({
                    x: toStageX(b.left + b.width / 2, rect),
                    y: toStageY(b.top + b.height / 2, rect),
                    weight,
                    hue,
                    active,
                });
            }

            const y = innerHeight - rect.bottom;
            r.setViewport(rect.left, y, rect.width, rect.height);
            r.setScissor(rect.left, y, rect.width, rect.height);

            s.effect.render({
                renderer: r,
                time,
                resolution: s.size,
                mouse: s.mouse,
                nodes: s.nodes,
            });
        }

        requestAnimationFrame(this.frame);
    };
}
