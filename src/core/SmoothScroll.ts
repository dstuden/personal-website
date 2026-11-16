import { damp, type CssPx, type Rate, type Seconds } from './units';

const STIFFNESS: Rate = 7;

export class SmoothScroll {
    private current: CssPx = scrollY;

    private drawn: CssPx = NaN;

    private readonly content: HTMLElement;
    private readonly spacer: HTMLElement;
    private readonly sections: HTMLElement[];
    private readonly snaps: HTMLElement[];
    private readonly reduced = matchMedia('(prefers-reduced-motion: reduce)');

    constructor(content: HTMLElement, spacer: HTMLElement, sections: HTMLElement[]) {
        this.content = content;
        this.spacer = spacer;
        this.sections = sections;
        this.snaps = sections.map(() => {
            const el = document.createElement('div');
            el.className = 'snap';
            return el;
        });
        this.measure();
        spacer.replaceChildren(...this.snaps);
        new ResizeObserver(() => this.measure()).observe(content);
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
        const total = this.content.offsetHeight;
        const boxes = this.sections.map((el) => [el.offsetTop, el.offsetHeight]);
        this.spacer.style.height = `${total}px`;
        boxes.forEach(([top, height], i) => {
            const s = this.snaps[i].style;
            s.top = `${top}px`;
            s.height = `${height}px`;
        });
    }
}
