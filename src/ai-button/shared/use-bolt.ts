import { useEffect, useRef, useState } from "react";
import type { Vec2 } from "./use-orbit";

const midpointDisplace = (
  pts: Vec2[],
  depth: number,
  jitter: number,
): Vec2[] => {
  if (depth <= 0) return pts;
  const out: Vec2[] = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const off = (Math.random() - 0.5) * jitter;
    out.push({
      x: (a.x + b.x) / 2 + nx * off,
      y: (a.y + b.y) / 2 + ny * off,
    });
    out.push(b);
  }
  return midpointDisplace(out, depth - 1, jitter * 0.55);
};

const pointsToPath = (pts: Vec2[]) =>
  pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");

/**
 * Origin (0,0)'dan `target`'a kadar uzanan, fractal-bölmeli prosedürel yıldırım yolu.
 * Kaynak: sahibinden-v2 AtomButton.
 */
export function generateBoltPath(target: Vec2): string {
  const totalLen = Math.hypot(target.x, target.y) || 1;
  const main = midpointDisplace(
    [{ x: 0, y: 0 }, target],
    5,
    totalLen * 0.18,
  );
  const segments: string[] = [pointsToPath(main)];
  for (let i = 2; i < main.length - 1; i++) {
    if (Math.random() < 0.32) {
      const p = main[i];
      const prev = main[i - 1];
      const baseAngle = Math.atan2(p.y - prev.y, p.x - prev.x);
      const branchAngle = baseAngle + (Math.random() - 0.5) * Math.PI * 0.9;
      const branchLen = totalLen * (0.18 + Math.random() * 0.32);
      const end: Vec2 = {
        x: p.x + Math.cos(branchAngle) * branchLen,
        y: p.y + Math.sin(branchAngle) * branchLen,
      };
      const branch = midpointDisplace([p, end], 3, branchLen * 0.22);
      segments.push(pointsToPath(branch));
      if (branch.length > 4 && Math.random() < 0.35) {
        const sp = branch[Math.floor(branch.length / 2)];
        const subAngle = branchAngle + (Math.random() - 0.5) * Math.PI * 0.7;
        const subLen = branchLen * (0.4 + Math.random() * 0.4);
        const subEnd: Vec2 = {
          x: sp.x + Math.cos(subAngle) * subLen,
          y: sp.y + Math.sin(subAngle) * subLen,
        };
        segments.push(
          pointsToPath(midpointDisplace([sp, subEnd], 2, subLen * 0.25)),
        );
      }
    }
  }
  return segments.join(" ");
}

export type BoltState = { d: string; intensity: number } | null;

/**
 * `positions` dizisindeki her bir nokta için, hover veya yakınlık tabanlı bir bolt path'i üretir.
 * 70ms aralıklarla yenilenir (≈14 FPS — kaynaktan birebir).
 */
export function useBolts(
  positions: { x: number; y: number }[],
  hovered: boolean,
  options: { fadeStart?: number; fadeEnd?: number; active?: boolean } = {},
): BoltState[] {
  const { fadeStart = 16, fadeEnd = 9, active = true } = options;
  const [bolts, setBolts] = useState<BoltState[]>(() =>
    positions.map(() => null),
  );
  const hoveredRef = useRef(hovered);
  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = -1000;
    const tick = (now: number) => {
      if (now - last > 70) {
        const h = hoveredRef.current;
        const next: BoltState[] = positions.map((p) => {
          if (h) return { d: generateBoltPath(p), intensity: 1 };
          const dist = Math.hypot(p.x, p.y);
          if (dist >= fadeStart) return null;
          const intensity = Math.max(
            0,
            Math.min(1, (fadeStart - dist) / (fadeStart - fadeEnd)),
          );
          return { d: generateBoltPath(p), intensity };
        });
        setBolts(next);
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // positions referansı her tick değiştiği için bağımlılığa koyamayız — hover ref + active yeter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, fadeStart, fadeEnd]);

  return bolts;
}
