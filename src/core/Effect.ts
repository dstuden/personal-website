import type { Vector2, WebGLRenderer } from 'three';
import type { Hue, Seconds, Unit } from './units';

export interface NodeData {
    x: Unit;
    y: Unit;
    weight: Unit;
    hue: Hue;
    active: Unit;
}

export interface FrameContext {
    renderer: WebGLRenderer;
    time: Seconds;
    resolution: Vector2;
    mouse: Vector2;
    nodes: readonly NodeData[];
}

export interface Effect {
    render(ctx: FrameContext): void;
}
