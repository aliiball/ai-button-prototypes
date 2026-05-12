import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import { useRafTime } from "../shared/use-raf-time";
import { useOrbit } from "../shared/use-orbit";
import type { VariantProps } from "../shared/types";

const QUARK_PERIOD = { calm: 9, normal: 5, intense: 2.5 } as const;
const QUARK_PULSE = { calm: 2.4, normal: 1.6, intense: 1.0 } as const;
const QUARK_COUNT = { calm: 4, normal: 5, intense: 6 } as const;

/**
 * Atom · Quark — N elektron tek yatay eliptik düzlemde, eşit aralıkla dolanır.
 * Atom klasik 3 düzlemli orbit'ten farklı topoloji.
 */
export function AtomQuarkStyle({ palette, hovered, intensity }: VariantProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const t = useRafTime();
  const period = QUARK_PERIOD[intensity];
  const count = QUARK_COUNT[intensity];
  const rx = 22;
  const ry = 7;
  const speedMult = hovered ? 1.6 : 1;
  const electrons = Array.from({ length: count }, (_, i) => {
    const theta = ((t * speedMult) / period) * 2 * Math.PI + (i * 2 * Math.PI) / count;
    return { x: Math.cos(theta) * rx, y: Math.sin(theta) * ry };
  });
  const nucleusGrad = `aq-n-${id}`;
  const auraGrad = `aq-a-${id}`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={nucleusGrad} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="40%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
        <radialGradient id={auraGrad} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.auraInner} stopOpacity={0.9} />
          <stop offset="60%" stopColor={palette.auraMid} stopOpacity={0.3} />
          <stop offset="100%" stopColor={palette.auraOuter} stopOpacity={0} />
        </radialGradient>
      </defs>

      <g filter={F.depth}>
        {/* tek yatay orbit halkası — kalın halo + ince stroke */}
        <ellipse cx="0" cy="0" rx={rx} ry={ry} fill="none" stroke={palette.orbitDeep} strokeWidth={3.2} opacity={0.5} filter={F.halo} />
        <ellipse cx="0" cy="0" rx={rx} ry={ry} fill="none" stroke={palette.orbitMid} strokeWidth={1.3} opacity={0.85} filter={F.soft} />
        <ellipse cx="0" cy="0" rx={rx} ry={ry} fill="none" stroke={palette.orbitHighlight} strokeWidth={0.55} opacity={0.95} />

        {electrons.map((p, i) => (
          <circle key={`e-${i}`} cx={p.x} cy={p.y} r={1.8} fill={palette.electron} filter={F.glow} />
        ))}

        <motion.circle
          cx="0" cy="0" r="7" fill={`url(#${auraGrad})`}
          animate={{ scale: [1, 1.22, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: QUARK_PULSE[intensity], repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />
        <circle cx="0" cy="0" r="4" fill={`url(#${nucleusGrad})`} filter={F.glow} />
      </g>
    </svg>
  );
}

const MIN_PERIOD = { calm: 12, normal: 7, intense: 3.5 } as const;
const MIN_PULSE = { calm: 2.8, normal: 1.8, intense: 1.0 } as const;

/**
 * Atom · Minimal — tek orbit + tek elektron + parlayan çekirdek.
 * Hover'da 2. orbit fade-in olur (intensity her seviyede).
 */
export function AtomMinimalStyle({ palette, hovered, intensity }: VariantProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const positions = useOrbit({ rx: 22, ry: 8, period: MIN_PERIOD[intensity], count: 1 });
  const nucleusGrad = `am-n-${id}`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={nucleusGrad} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="45%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      <g filter={F.depth}>
        {/* ana orbit */}
        <ellipse cx="0" cy="0" rx="22" ry="8" fill="none" stroke={palette.orbitDeep} strokeWidth={2.4} opacity={0.45} filter={F.halo} />
        <ellipse cx="0" cy="0" rx="22" ry="8" fill="none" stroke={palette.orbitMid} strokeWidth={1.0} opacity={0.85} filter={F.soft} />
        <ellipse cx="0" cy="0" rx="22" ry="8" fill="none" stroke={palette.orbitHighlight} strokeWidth={0.5} opacity={0.9} />

        {/* hover'da fade-in ikinci orbit (dik) */}
        <motion.g
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        >
          <ellipse cx="0" cy="0" rx="22" ry="8" transform="rotate(75)" fill="none" stroke={palette.orbitMid} strokeWidth={0.9} opacity={0.7} filter={F.soft} />
          <ellipse cx="0" cy="0" rx="22" ry="8" transform="rotate(75)" fill="none" stroke={palette.orbitHighlight} strokeWidth={0.4} opacity={0.85} />
        </motion.g>

        {positions.map((p, i) => (
          <circle key={`e-${i}`} cx={p.x} cy={p.y} r={2.1} fill={palette.electron} filter={F.glow} />
        ))}

        <motion.circle
          cx="0" cy="0" r="4.6" fill={`url(#${nucleusGrad})`} filter={F.glow}
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: MIN_PULSE[intensity], repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />
      </g>
    </svg>
  );
}
