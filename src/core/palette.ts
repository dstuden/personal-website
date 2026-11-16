import { clamp01, type Unit } from './units';

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

let palette: Palette | undefined;
export const getPalette = (): Palette => (palette ??= readPalette());

export function paletteAt(t: Unit): Rgb {
    const { stops } = getPalette();
    const x = clamp01(t) * (stops.length - 1);
    const i = Math.min(Math.floor(x), stops.length - 2);
    const a = stops[i];
    const b = stops[i + 1];
    const f = x - i;
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

export function paletteGlsl(): string {
    const p = getPalette();
    return [
        `#define PAL_N ${p.stops.length}`,
        `const vec3 PALETTE[PAL_N] = vec3[](${p.stops.map(vec3).join(', ')});`,
        `const vec3 BG = ${vec3(p.bg)};`,
        `const vec3 FG = ${vec3(p.fg)};`,
    ].join('\n');
}
