import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Logaritmik spiral (golden ratio): 2 kol + akan ışık parçacıkları + merkez çekirdek.
 */
const A = 1.6; // spiral base
const B = 0.22;

const spiralAt = (theta: number) => {
  const r = A * Math.exp(B * theta);
  return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
};

const buildArm = (offset: number, turns: number) => {
  const N = 100;
  let p = "";
  for (let i = 0; i <= N; i++) {
    const theta = (i / N) * Math.PI * 2 * turns + offset;
    const { x, y } = spiralAt(theta);
    if (Math.abs(x) > 30 || Math.abs(y) > 30) break;
    p += (i === 0 ? "M" : "L") + x.toFixed(2) + "," + y.toFixed(2);
  }
  return p;
};

export function SpiralGalaxyMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const armA = buildArm(0, 2);
  const armB = buildArm(Math.PI, 2);
  const armC = buildArm(Math.PI * (2 / 3), 1.5);

  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>(
    () => [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
  );
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const period = hovered ? 4 : 7;
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      const t = (now - startRef.current) / 1000;
      const out = [0, 1, 2, 3].map((i) => {
        const phase = (t / period + i / 4) % 1;
        const theta = phase * Math.PI * 2 * 2 + (i % 2 ? Math.PI : 0);
        return spiralAt(theta);
      });
      setPositions(out);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hovered]);

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      <motion.g
        animate={{ rotate: 360 }}
        transition={{
          duration: hovered ? 18 : 32,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ transformOrigin: "center" }}
      >
        {[armA, armB, armC].map((d, i) => (
          <g key={i}>
            <path
              d={d}
              fill="none"
              stroke={palette.orbitDeep}
              strokeWidth={2.6}
              opacity={0.45}
              strokeLinecap="round"
              filter={F.halo}
            />
            <path
              d={d}
              fill="none"
              stroke={palette.orbitMid}
              strokeWidth={1}
              opacity={0.75}
              strokeLinecap="round"
              filter={F.soft}
            />
            <path
              d={d}
              fill="none"
              stroke={palette.orbitHighlight}
              strokeWidth={0.4}
              opacity={0.9}
              strokeLinecap="round"
            />
          </g>
        ))}

        {positions.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={2.4}
              fill={palette.electron}
              opacity={0.6}
              filter={F.halo}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={1.2}
              fill={palette.nucleusCore}
              filter={F.glow}
            />
          </g>
        ))}
      </motion.g>

      {/* galaksi çekirdeği */}
      <motion.circle
        cx="0"
        cy="0"
        r="6"
        fill={palette.auraMid}
        opacity={0.4}
        filter={F.halo}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        style={{ transformOrigin: "center" }}
      />
      <circle
        cx="0"
        cy="0"
        r="3.4"
        fill={palette.nucleusCore}
        filter={F.glow}
      />
    </svg>
  );
}
