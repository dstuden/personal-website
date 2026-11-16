import meatballs from '../shaders/meatballs.frag?raw';
import warp from '../shaders/warp.frag?raw';
import voronoi from '../shaders/voronoi.frag?raw';
import dither from '../shaders/dither.frag?raw';

export const effects = {
    meatballs,
    warp,
    voronoi,
    dither,
};

export type EffectKey = keyof typeof effects;

export const isEffectKey = (key: string | undefined): key is EffectKey =>
    key !== undefined && Object.hasOwn(effects, key);
