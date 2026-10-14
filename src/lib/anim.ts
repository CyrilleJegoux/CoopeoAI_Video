import { Easing, interpolate, spring } from "remotion";
import { FPS } from "../config";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Progression 0→1 entre deux instants (en images), avec easing optionnel */
export const prog = (
  frame: number,
  from: number,
  to: number,
  easing: (t: number) => number = (t) => t,
) => (to <= from ? (frame >= from ? 1 : 0) : interpolate(frame, [from, to], [0, 1], { ...clamp, easing }));

export const ease = {
  out: Easing.out(Easing.cubic),
  in: Easing.in(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
  outExpo: Easing.out(Easing.exp),
  inExpo: Easing.in(Easing.exp),
  outBack: Easing.out(Easing.back(1.6)),
  inOutSine: Easing.inOut(Easing.sin),
};

/** Ressort qui démarre à l'image `at` */
export const springAt = (
  frame: number,
  at: number,
  config: Partial<{ damping: number; stiffness: number; mass: number }> = {},
  durationInFrames?: number,
) =>
  spring({
    frame: frame - at,
    fps: FPS,
    config: { damping: 14, stiffness: 120, mass: 1, ...config },
    durationInFrames,
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Générateur pseudo-aléatoire déterministe (identique à sources-images/lib.js) */
export function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
