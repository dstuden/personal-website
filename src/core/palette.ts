import type { Unit } from './units';

type Rgb = readonly [Unit, Unit, Unit];

interface Palette {
    stops: Rgb[];
    bg: Rgb;
    fg: Rgb;
}

function parseColor(ctx: CanvasRenderingContext2D, css: string): Rgb {
    ctx.fillStyle = '#000';
    ctx.fillStyle = css;
    const hex = String(ctx.fillStyle);
    const n = parseInt(hex.slice(1), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function readPalette(): Palette {
    const style = getComputedStyle(document.documentElement);
    const ctx = document.createElement('canvas').getContext('2d')!;
    const read = (name: string) => parseColor(ctx, style.getPropertyValue(name).trim());
    const stops: Rgb[] = [];
    for (let i = 0; style.getPropertyValue(`--pal-${i}`); i++) stops.push(read(`--pal-${i}`));
    if (stops.length < 2) throw new Error('style.css needs at least --pal-0 and --pal-1');
    return { stops, bg: read('--bg'), fg: read('--fg') };
}

const vec3 = ([r, g, b]: Rgb) => `vec3(${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)})`;

let cached: string | undefined;

export function paletteGlsl(): string {
    if (cached) return cached;
    const p = readPalette();
    cached = [
        `#define PAL_N ${p.stops.length}`,
        `const vec3 PALETTE[PAL_N] = vec3[](${p.stops.map(vec3).join(', ')});`,
        `const vec3 BG = ${vec3(p.bg)};`,
        `const vec3 FG = ${vec3(p.fg)};`,
    ].join('\n');
    return cached;
}
