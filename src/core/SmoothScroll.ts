import { damp, type CssPx, type Rate, type Seconds } from './units';

const STIFFNESS: Rate = 7;

export class SmoothScroll {
    private current: CssPx = scrollY;

    private drawn: CssPx = NaN;

    private readonly content: HTMLElement;
    private readonly spacer: HTMLElement;
    private readonly reduced = matchMedia('(prefers-reduced-motion: reduce)');

    constructor(content: HTMLElement, spacer: HTMLElement) {
        this.content = content;
        this.spacer = spacer;
        new ResizeObserver(() => this.measure()).observe(content);
        this.measure();
    }

    update(dt: Seconds): void {
        const target = scrollY;
        this.current = this.reduced.matches ? target : damp(this.current, target, STIFFNESS, dt);
        if (Math.abs(target - this.current) < 0.05) this.current = target;
        if (this.current === this.drawn) return;
        this.drawn = this.current;
        this.content.style.transform = `translate3d(0, ${-this.current}px, 0)`;
    }

    private measure(): void {
        this.spacer.style.height = `${this.content.offsetHeight}px`;
    }
}
