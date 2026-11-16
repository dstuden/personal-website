import { clamp, type CssPx, type Unit } from '../core/units';

const PAD: CssPx = 30;

const FILL: Unit = 0.45;

const MAX_ITERATIONS = 120;

interface Box {
    el: HTMLElement;
    w: CssPx;
    h: CssPx;
    x: CssPx;
    y: CssPx;
}

const hash01 = (seed: number): Unit => {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
};

export function autoLayout(list: HTMLElement): void {
    let queued = false;
    const schedule = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            place(list);
        });
    };
    list.classList.add('nodes--placed');
    place(list);
    new ResizeObserver(schedule).observe(list);
    new MutationObserver(schedule).observe(list, {
        childList: true,
        subtree: true,
        characterData: true,
    });
    void document.fonts.ready.then(schedule);
}

function place(list: HTMLElement): void {
    const els = [...list.children].filter(
        (e): e is HTMLElement => e instanceof HTMLElement && e.classList.contains('node'),
    );
    list.style.minHeight = '';
    const W = list.clientWidth;
    let H = list.clientHeight;
    if (!els.length || !W) return;

    const boxes: Box[] = els.map((el) => ({
        el,
        w: el.offsetWidth + PAD,
        h: el.offsetHeight + PAD,
        x: 0,
        y: 0,
    }));
    const n = boxes.length;

    const area = boxes.reduce((s, b) => s + b.w * b.h, 0);
    const need = Math.ceil(area / (FILL * W));
    if (need > H) {
        list.style.minHeight = `${need}px`;
        H = list.clientHeight;
    }

    const avgW = boxes.reduce((s, b) => s + b.w, 0) / n;
    const avgH = boxes.reduce((s, b) => s + b.h, 0) / n;
    let cols = 1;
    let best = -Infinity;
    for (let c = 1; c <= n; c++) {
        const score = Math.min(W / c / avgW, H / Math.ceil(n / c) / avgH);
        if (score > best + 1e-6) [cols, best] = [c, score];
    }
    const rows = Math.ceil(n / cols);
    const cw = W / cols;
    const ch = H / rows;

    boxes.forEach((b, i) => {
        const r = Math.floor(i / cols);
        const inRow = Math.min(cols, n - r * cols);
        const c = (i % cols) + (cols - inRow) / 2;
        const slackX = Math.max(0, cw - b.w);
        const slackY = Math.max(0, ch - b.h);
        const stagger = (r % 2 ? 1 : -1) * Math.min(cw / 4, slackX / 2);
        b.x = (c + 0.5) * cw + stagger + (hash01(i) - 0.5) * slackX * 0.5;
        b.y = (r + 0.5) * ch + (hash01(i + 0.37) - 0.5) * slackY * 0.8;
    });

    const keepInside = (b: Box) => {
        const hx = (b.w - PAD) / 2;
        const hy = (b.h - PAD) / 2;
        b.x = clamp(b.x, hx, W - hx);
        b.y = clamp(b.y, hy, H - hy);
    };
    boxes.forEach(keepInside);
    for (let it = 0; it < MAX_ITERATIONS; it++) {
        let moved = false;
        for (let i = 0; i < n; i++)
            for (let j = i + 1; j < n; j++) {
                const a = boxes[i];
                const b = boxes[j];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const ox = (a.w + b.w) / 2 - Math.abs(dx);
                const oy = (a.h + b.h) / 2 - Math.abs(dy);
                if (ox <= 0 || oy <= 0) continue;
                moved = true;
                if (ox < oy) {
                    const s = (dx < 0 ? -1 : 1) * (ox / 2 + 0.5);
                    a.x -= s;
                    b.x += s;
                } else {
                    const s = (dy < 0 ? -1 : 1) * (oy / 2 + 0.5);
                    a.y -= s;
                    b.y += s;
                }
            }
        boxes.forEach(keepInside);
        if (!moved) break;
    }

    boxes.forEach((b, i) => {
        const s = b.el.style;
        s.setProperty('--x', `${((b.x / W) * 100).toFixed(2)}%`);
        s.setProperty('--y', `${((b.y / H) * 100).toFixed(2)}%`);
        s.setProperty('--i', String(i));
        s.setProperty('--dx', `${((hash01(i + 0.71) - 0.5) * 20).toFixed(1)}px`);
        s.setProperty('--dy', `${((hash01(i + 0.13) - 0.5) * 24).toFixed(1)}px`);
    });
}
