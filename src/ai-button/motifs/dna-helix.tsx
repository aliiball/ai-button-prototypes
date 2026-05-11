import { useEffect, useId, useRef, useState } from "react";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Dikey çift sarmal — iki sinüsoidal şerit (180° faz farkı) + yatay basamaklar.
 * Genetik / algoritmik AI.
 */
export function DnaHelixMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
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

  const speed = hoveredRef.current ? 2.4 : 1.2;
  const amp = 10;
  const freq = 0.32;

  const buildStrand = (phase: number) => {
    const N = 40;
    let p = "";
    for (let i = 0; i <= N; i++) {
      const y = -22 + (i * 44) / N;
      const x = amp * Math.sin(y * freq + t * speed + phase);
      p += (i === 0 ? "M" : "L") + x.toFixed(2) + "," + y.toFixed(2);
    }
    return p;
  };

  // basamaklar (rungs) — sabit y konumlarında iki strand'i bağla
  const rungYs = [-18, -12, -6, 0, 6, 12, 18];

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* strand A back halo */}
      <path
        d={buildStrand(0)}
        fill="none"
        stroke={palette.orbitDeep}
        strokeWidth={3.4}
        strokeLinecap="round"
        opacity={0.4}
        filter={F.halo}
      />
      {/* strand A */}
      <path
        d={buildStrand(0)}
        fill="none"
        stroke={palette.orbitMid}
        strokeWidth={1.4}
        strokeLinecap="round"
        opacity={0.95}
        filter={F.soft}
      />
      <path
        d={buildStrand(0)}
        fill="none"
        stroke={palette.orbitHighlight}
        strokeWidth={0.5}
        strokeLinecap="round"
      />

      {/* strand B back halo */}
      <path
        d={buildStrand(Math.PI)}
        fill="none"
        stroke={palette.boltDeep}
        strokeWidth={3.4}
        strokeLinecap="round"
        opacity={0.4}
        filter={F.halo}
      />
      {/* strand B */}
      <path
        d={buildStrand(Math.PI)}
        fill="none"
        stroke={palette.boltMid}
        strokeWidth={1.4}
        strokeLinecap="round"
        opacity={0.95}
        filter={F.soft}
      />
      <path
        d={buildStrand(Math.PI)}
        fill="none"
        stroke={palette.boltBright}
        strokeWidth={0.5}
        strokeLinecap="round"
      />

      {/* rungs */}
      {rungYs.map((y, i) => {
        const xa = amp * Math.sin(y * freq + t * speed);
        const xb = amp * Math.sin(y * freq + t * speed + Math.PI);
        // sadece çapraz görünüyorsa belirgin (front rung'lar)
        const xDist = Math.abs(xa - xb);
        const op = hoveredRef.current ? 0.5 + (xDist / (amp * 2)) * 0.45 : 0.3 + (xDist / (amp * 2)) * 0.4;
        return (
          <line
            key={i}
            x1={xa}
            y1={y}
            x2={xb}
            y2={y}
            stroke={palette.electron}
            strokeWidth={0.7}
            strokeLinecap="round"
            opacity={op}
          />
        );
      })}

      {/* uç tepe noktaları */}
      <circle cx="0" cy="-22" r="1.6" fill={palette.nucleusCore} filter={F.glow} />
      <circle cx="0" cy="22" r="1.6" fill={palette.nucleusCore} filter={F.glow} />
    </svg>
  );
}
