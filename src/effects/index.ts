import type { Effect } from '../core/Effect';
import { ShaderEffect } from '../core/ShaderEffect';
import meatballs from '../shaders/meatballs.frag?raw';
import warp from '../shaders/warp.frag?raw';
import voronoi from '../shaders/voronoi.frag?raw';
import dither from '../shaders/dither.frag?raw';
import network from '../shaders/network.frag?raw';

export const effects = {
    meatballs: () => new ShaderEffect(meatballs),
    warp: () => new ShaderEffect(warp),
    voronoi: () => new ShaderEffect(voronoi),
    dither: () => new ShaderEffect(dither),
    network: () => new ShaderEffect(network),
} satisfies Record<string, () => Effect>;

export type EffectKey = keyof typeof effects;

export const isEffectKey = (key: string | undefined): key is EffectKey =>
    key !== undefined && Object.hasOwn(effects, key);
