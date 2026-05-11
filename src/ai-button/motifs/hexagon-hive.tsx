import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * 6 dış altıgen + 1 merkez. Hücreler sırayla ışır (petek/Bauhaus AI).
 */
const R = 7; // hex radius (point-to-point)
const SQRT3 = Math.sqrt(3);

// Düz-tepe altıgen köşeleri (point-to-point yatayda olacak: aslında flat-top)
// Pointy-top kullanıyoruz: vertical orientation
const pointyHexPath = (cx: number, cy: number, r: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 2; // start from top
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return `M${pts.join(" L")} Z`;
};

// Merkez + 6 komşu (pointy-top için): komşu mesafesi = √3 * r
const D = SQRT3 * R;
const NEIGHBORS = [
  { cx: 0, cy: -D },
  { cx: (D * SQRT3) / 2, cy: -D / 2 },
  { cx: (D * SQRT3) / 2, cy: D / 2 },
  { cx: 0, cy: D },
  { cx: -(D * SQRT3) / 2, cy: D / 2 },
  { cx: -(D * SQRT3) / 2, cy: -D / 2 },
];

export function HexagonHiveMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const dur = hovered ? 1.5 : 2.4;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      <g filter={F.depth}>
        {NEIGHBORS.map((n, i) => (
          <motion.path
            key={i}
            d={pointyHexPath(n.cx, n.cy, R - 0.6)}
            fill={palette.nucleusDeep}
            stroke={palette.orbitMid}
            strokeWidth={0.8}
            animate={{
              fill: [
                palette.nucleusDeep,
                palette.nucleusMid,
                palette.nucleusDeep,
              ],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: dur,
              repeat: Infinity,
              delay: (i * dur) / NEIGHBORS.length,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* merkez peteği */}
        <motion.path
          d={pointyHexPath(0, 0, R - 0.4)}
          fill={palette.nucleusMid}
          stroke={palette.orbitHighlight}
          strokeWidth={1}
          filter={F.glow}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />
        {/* merkez içi parıltı */}
        <motion.circle
          cx="0"
          cy="0"
          r="2.4"
          fill={palette.nucleusCore}
          filter={F.glow}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      </g>
    </svg>
  );
}
