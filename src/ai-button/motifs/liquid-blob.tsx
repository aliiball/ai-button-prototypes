import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * 6-anchor morphing blob — RAF ile her anchor sin perturbasyonu.
 * Lava lamp / organik morphing.
 */
export function LiquidBlobMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const grad = `lb-${id}`;
  const sheenGrad = `lb-sh-${id}`;

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

  const N = 8;
  const baseR = 16;
  const speed = hoveredRef.current ? 1.6 : 0.85;
  const amp = hoveredRef.current ? 3.6 : 2.2;

  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const r = baseR + Math.sin(t * speed + i * 0.9) * amp + Math.sin(t * (speed * 0.5) + i * 1.6) * (amp * 0.4);
    points.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
  }

  // Bezier yumuşatma — her tepe noktasından sonraki noktaya
  const buildPath = () => {
    let p = `M${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
    for (let i = 0; i < N; i++) {
      const cur = points[i];
      const next = points[(i + 1) % N];
      const prev = points[(i - 1 + N) % N];
      const after = points[(i + 2) % N];
      const c1x = cur.x + (next.x - prev.x) * 0.2;
      const c1y = cur.y + (next.y - prev.y) * 0.2;
      const c2x = next.x - (after.x - cur.x) * 0.2;
      const c2y = next.y - (after.y - cur.y) * 0.2;
      p += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${next.x.toFixed(2)},${next.y.toFixed(2)}`;
    }
    return p + " Z";
  };

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={grad} cx="40%" cy="35%" r="80%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="25%" stopColor={palette.electron} />
          <stop offset="60%" stopColor={palette.boltMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
        <radialGradient id={sheenGrad} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.nucleusCore} stopOpacity={0.85} />
          <stop offset="100%" stopColor={palette.nucleusCore} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* halo */}
      <motion.circle
        cx="0"
        cy="0"
        r="22"
        fill={palette.auraMid}
        opacity={0.2}
        filter={F.halo}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />

      {/* blob body */}
      <path
        d={buildPath()}
        fill={`url(#${grad})`}
        stroke={palette.orbitHighlight}
        strokeWidth={0.4}
        strokeOpacity={0.5}
        filter={F.glow}
      />

      {/* sheen */}
      <ellipse
        cx="-5"
        cy="-7"
        rx="6"
        ry="3"
        transform="rotate(-30 -5 -7)"
        fill={`url(#${sheenGrad})`}
      />
    </svg>
  );
}
