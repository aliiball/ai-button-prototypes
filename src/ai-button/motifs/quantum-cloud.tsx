import { useEffect, useId, useRef, useState } from "react";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Kuantum olasılık bulutu — yoğunluğu Gaussian dağılan stokastik nokta alanı.
 */
export function QuantumCloudMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const cloudGrad = `qc-${id}`;

  const [t, setT] = useState(0);
  const startRef = useRef<number | null>(null);
  const hoveredRef = useRef(hovered);
  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      setT((now - startRef.current) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 32 nokta — radyal Gaussian dağılım, küçük titrek hareket
  const N = 32;
  const seeds = useRef(
    Array.from({ length: N }, () => ({
      r0: Math.pow(Math.random(), 0.6) * 18,
      a0: Math.random() * Math.PI * 2,
      phaseR: Math.random() * 10,
      phaseA: Math.random() * 10,
      size: 0.7 + Math.random() * 1.6,
      bright: Math.random() > 0.7,
    })),
  ).current;

  const speed = hoveredRef.current ? 2.4 : 1.2;
  const dots = seeds.map((s) => {
    const r = s.r0 + Math.sin(t * speed + s.phaseR) * 1.6;
    const a = s.a0 + Math.cos(t * speed * 0.6 + s.phaseA) * 0.2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    // merkeze yakın olanlar daha parlak
    const opacity = 1 - r / 22;
    return { x, y, size: s.size, bright: s.bright, opacity };
  });

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={cloudGrad}>
          <stop offset="0%" stopColor={palette.electron} stopOpacity={0.7} />
          <stop offset="60%" stopColor={palette.nucleusMid} stopOpacity={0.35} />
          <stop offset="100%" stopColor={palette.auraMid} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.18} filter={F.halo} />
      {/* bulut sis backing */}
      <circle cx="0" cy="0" r="20" fill={`url(#${cloudGrad})`} filter={F.halo} />

      {/* parçacık alanı */}
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.size}
          fill={d.bright ? palette.nucleusCore : palette.electron}
          opacity={d.opacity}
          filter={d.bright ? F.glow : F.soft}
        />
      ))}

      {/* merkez parlak çekirdek */}
      <circle cx="0" cy="0" r="1.6" fill={palette.boltBright} filter={F.glow} />
    </svg>
  );
}
