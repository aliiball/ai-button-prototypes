import { useEffect, useId, useRef, useState } from "react";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

const COUNT = 18;

type P = { x: number; y: number; vx: number; vy: number };

/**
 * 18 parçacık daire içinde dolaşır; hover'da merkeze toplanır.
 * rAF tabanlı basit boid: merkeze zayıf çekim + birbirinden zayıf itme.
 */
export function ParticleSwarmMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const [particles, setParticles] = useState<P[]>(() =>
    Array.from({ length: COUNT }, (_, i) => {
      const a = (i / COUNT) * Math.PI * 2;
      const r = 14 + Math.random() * 6;
      return {
        x: Math.cos(a) * r,
        y: Math.sin(a) * r,
        vx: -Math.sin(a) * 0.6,
        vy: Math.cos(a) * 0.6,
      };
    }),
  );
  const hoveredRef = useRef(hovered);
  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setParticles((prev) => {
        const next = prev.map((p) => ({ ...p }));
        const h = hoveredRef.current;
        for (let i = 0; i < next.length; i++) {
          const p = next[i];
          const d = Math.hypot(p.x, p.y) || 0.001;
          const targetR = h ? 5 : 16;
          // merkeze/halkaya çekim
          const pull = (targetR - d) * 0.012;
          p.vx += (-p.x / d) * pull;
          p.vy += (-p.y / d) * pull;
          // birbirinden itme (basit)
          for (let j = 0; j < next.length; j++) {
            if (i === j) continue;
            const q = next[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const dd = Math.hypot(dx, dy) || 0.001;
            if (dd < 4) {
              p.vx += (dx / dd) * 0.04;
              p.vy += (dy / dd) * 0.04;
            }
          }
          // damping
          p.vx *= 0.94;
          p.vy *= 0.94;
          // tangent push (sürekli akış)
          p.vx += -p.y * 0.005;
          p.vy += p.x * 0.005;
          p.x += p.vx;
          p.y += p.vy;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      <circle
        cx="0"
        cy="0"
        r="9"
        fill={palette.auraMid}
        opacity={hovered ? 0.4 : 0.18}
        filter={F.halo}
      />

      {particles.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i % 3 === 0 ? 1.6 : 1.1}
          fill={palette.electron}
          opacity={0.9}
          filter={i % 4 === 0 ? F.glow : F.soft}
        />
      ))}
    </svg>
  );
}
