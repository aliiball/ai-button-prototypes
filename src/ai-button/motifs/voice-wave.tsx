import { useEffect, useId, useRef, useState } from "react";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Yatay sinüs dalgaları akar. 3 katman: deep halo + mid + bright thin.
 * Sesli AI sözcüsü.
 */
export function VoiceWaveMotif({ palette, hovered }: MotifProps) {
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

  const buildWave = (amplitude: number, phase: number, freq: number) => {
    const speed = hoveredRef.current ? 3.6 : 2.2;
    const N = 60;
    let p = "";
    for (let i = 0; i <= N; i++) {
      const x = -26 + (i * 52) / N;
      // amplitude envelope: kenarda 0, ortada tepe
      const env = Math.cos((x / 26) * (Math.PI / 2));
      const y =
        amplitude *
        env *
        env *
        Math.sin(x * freq + t * speed + phase);
      p += (i === 0 ? "M" : "L") + x.toFixed(2) + "," + y.toFixed(2);
    }
    return p;
  };

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* dış halo */}
      <path
        d={buildWave(11, 0, 0.32)}
        fill="none"
        stroke={palette.orbitDeep}
        strokeWidth={3.4}
        strokeLinecap="round"
        opacity={0.5}
        filter={F.halo}
      />
      <path
        d={buildWave(11, 0, 0.32)}
        fill="none"
        stroke={palette.orbitMid}
        strokeWidth={1.4}
        strokeLinecap="round"
        opacity={0.85}
        filter={F.soft}
      />
      <path
        d={buildWave(11, 0, 0.32)}
        fill="none"
        stroke={palette.orbitHighlight}
        strokeWidth={0.5}
        strokeLinecap="round"
      />

      {/* ikinci dalga — faz farkı */}
      <path
        d={buildWave(7, Math.PI / 2, 0.48)}
        fill="none"
        stroke={palette.boltMid}
        strokeWidth={1}
        opacity={0.6}
        filter={F.soft}
      />

      {/* üçüncü dalga — daha hızlı */}
      <path
        d={buildWave(4, Math.PI, 0.72)}
        fill="none"
        stroke={palette.boltBright}
        strokeWidth={0.6}
        opacity={0.5}
      />

      {/* kenar noktaları (mikrofon ipucu) */}
      <circle cx="-26" cy="0" r="1.4" fill={palette.electron} filter={F.glow} />
      <circle cx="26" cy="0" r="1.4" fill={palette.electron} filter={F.glow} />
    </svg>
  );
}
