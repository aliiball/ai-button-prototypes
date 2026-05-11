import { useEffect, useId, useRef, useState } from "react";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Bezier kalem — kalemin kendi yolunu çizip silmesi. Generative pen.
 */
export function BezierPenMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const tipGrad = `bp-${id}`;

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

  // bir kıvrımlı parametrik kalligrafik eğri
  const speed = hoveredRef.current ? 1.4 : 0.8;
  const progress = ((Math.sin(t * speed) + 1) / 2); // 0..1..0..1 osillates
  // Open cubic curve
  const N = 60;
  const N_DRAWN = Math.floor(N * progress);
  let p = "";
  for (let i = 0; i <= N_DRAWN; i++) {
    const f = i / N;
    const x = -22 + 44 * f;
    const y = Math.sin(f * Math.PI * 2.5) * 14 * (1 - f * 0.3);
    p += (i === 0 ? "M" : "L") + x.toFixed(2) + "," + y.toFixed(2);
  }
  // kalem ucu konumu — eğri sonu
  const tipF = progress;
  const tipX = -22 + 44 * tipF;
  const tipY = Math.sin(tipF * Math.PI * 2.5) * 14 * (1 - tipF * 0.3);

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={tipGrad}>
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="60%" stopColor={palette.electron} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.15} filter={F.halo} />

      {/* çizilen path — halo */}
      <path d={p} fill="none" stroke={palette.boltDeep} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" opacity={0.4} filter={F.halo} />
      <path d={p} fill="none" stroke={palette.boltMid} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" filter={F.soft} />
      <path d={p} fill="none" stroke={palette.boltBright} strokeWidth={0.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* başlangıç noktası */}
      <circle cx="-22" cy="0" r="1.2" fill={palette.electron} opacity={0.7} />

      {/* kalem ucu — sparkle + parlak nokta */}
      <circle cx={tipX} cy={tipY} r="3.4" fill={`url(#${tipGrad})`} filter={F.glow} />
      <circle cx={tipX} cy={tipY} r="1.2" fill={palette.nucleusCore} />
      {/* kalem ışın efekti */}
      <line x1={tipX - 5} y1={tipY} x2={tipX + 5} y2={tipY} stroke={palette.nucleusCore} strokeWidth={0.4} opacity={0.5} />
      <line x1={tipX} y1={tipY - 5} x2={tipX} y2={tipY + 5} stroke={palette.nucleusCore} strokeWidth={0.4} opacity={0.5} />
    </svg>
  );
}
