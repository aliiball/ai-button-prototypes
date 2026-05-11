import { useEffect, useId, useRef, useState } from "react";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * EKG kalp atışı — yatay düz çizgi + periyodik P-QRS-T spike.
 * Sağa akan pulse pozisyon işaretçisi.
 */
export function HeartPulseMotif({ palette, hovered }: MotifProps) {
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

  // bir kalp atımı dalga şekli — x'e bağlı y değeri
  const ekg = (x: number) => {
    const period = 26;
    const local = ((x % period) + period) % period;
    if (local < 5) return 0; // baseline
    if (local < 7) return -1.5; // P
    if (local < 8) return 0;
    if (local < 9) return 3; // Q
    if (local < 10) return -12; // R spike up (svg y inverted)
    if (local < 11) return 7; // S
    if (local < 12) return 0;
    if (local < 17) return -2; // T
    return 0;
  };

  const speed = hoveredRef.current ? 14 : 8;
  const offset = t * speed;

  const N = 70;
  let p = "";
  for (let i = 0; i <= N; i++) {
    const x = -26 + (i * 52) / N;
    const y = ekg(x + offset);
    p += (i === 0 ? "M" : "L") + x.toFixed(2) + "," + y.toFixed(2);
  }

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* aura */}
      <ellipse cx="0" cy="0" rx="26" ry="10" fill={palette.auraMid} opacity={0.18} filter={F.halo} />

      {/* baseline grid çizgileri */}
      <line x1="-26" y1="0" x2="26" y2="0" stroke={palette.orbitDeep} strokeWidth={0.3} opacity={0.4} />

      {/* halo trace */}
      <path
        d={p}
        fill="none"
        stroke={palette.boltDeep}
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.45}
        filter={F.halo}
      />
      <path
        d={p}
        fill="none"
        stroke={palette.boltMid}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={F.soft}
      />
      <path
        d={p}
        fill="none"
        stroke={palette.boltBright}
        strokeWidth={0.6}
        strokeLinecap="round"
      />

      {/* uç noktası — pulse head */}
      <circle cx="26" cy={ekg(26 + offset)} r="1.8" fill={palette.electron} filter={F.glow} />
      <circle cx="-26" cy={ekg(-26 + offset)} r="1.4" fill={palette.nucleusCore} opacity={0.6} />
    </svg>
  );
}
