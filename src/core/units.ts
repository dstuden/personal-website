export type Seconds = number;

export type CssPx = number;

export type Unit = number;

export type Hue = number;

export type Rate = number;

export const damp = (current: number, target: number, rate: Rate, dt: Seconds): number =>
    current + (target - current) * (1 - Math.exp(-rate * dt));

export const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

export const clamp01 = (v: number): Unit => clamp(v, 0, 1);
