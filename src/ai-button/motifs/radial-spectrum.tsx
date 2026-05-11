import { useEffect, useId, useRef, useState } from "react";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Dairesel ses spektrumu — merkezden dışa fışkıran radyal çubuklar (FFT-vari).
 */
export function RadialSpectrumMotif({ palette, hovered }: MotifProps) {
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

  const N = 36;
  const innerR = 6.5;
  const baseLen = hoveredRef.current ? 9 : 6;
  const speed = hoveredRef.current ? 3.4 : 1.8;

  const bars = Array.from({ length: N }, (_, i) => {
    const angle = (i / N) * Math.PI * 2;
    const phase = i * 0.4 + t * speed;
    const amp =
      baseLen +
      Math.sin(phase) * 5 +
      Math.sin(phase * 2.3 + 1.4) * 3 +
      Math.cos(phase * 0.7) * 2;
    const len = Math.max(2, amp);
    const x1 = Math.cos(angle) * innerR;
    const y1 = Math.sin(angle) * innerR;
    const x2 = Math.cos(angle) * (innerR + len);
    const y2 = Math.sin(angle) * (innerR + len);
    return { x1, y1, x2, y2, len };
  });

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.16} filter={F.halo} />

      {/* iç halka */}
      <circle cx="0" cy="0" r={innerR} fill="none" stroke={palette.orbitDeep} strokeWidth={0.5} opacity={0.55} />

      {bars.map((b, i) => (
        <line
          key={i}
          x1={b.x1}
          y1={b.y1}
          x2={b.x2}
          y2={b.y2}
          stroke={i % 4 === 0 ? palette.boltBright : palette.orbitMid}
          strokeWidth={1.1}
          strokeLinecap="round"
          opacity={0.85}
          filter={F.soft}
        />
      ))}

      {/* dış parlak nokta için her 4 bar'da 1 */}
      {bars
        .filter((_, i) => i % 4 === 0)
        .map((b, i) => (
          <circle
            key={`d-${i}`}
            cx={b.x2}
            cy={b.y2}
            r="1.1"
            fill={palette.nucleusCore}
            filter={F.glow}
          />
        ))}

      {/* merkez parlak nokta */}
      <circle cx="0" cy="0" r="2.4" fill={palette.electron} filter={F.glow} />
      <circle cx="0" cy="0" r="1" fill={palette.nucleusCore} />
    </svg>
  );
}
