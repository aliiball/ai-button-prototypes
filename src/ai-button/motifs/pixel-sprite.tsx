import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * 8-bit retro pixel sprite — küçük karakter (smiley/AI face). Pikseller titreşir.
 */
export function PixelSpriteMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);

  const cell = 3.2;
  const grid = 9;
  const start = -((grid * cell) / 2);

  // 9x9 pixel art — basit AI yüzü
  // 0 = boş, 1 = body (ana renk), 2 = göz (parlak), 3 = ağız (mid), 4 = highlight
  const art = [
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 4, 1, 1, 4, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 2, 1, 1, 1, 2, 1, 1],
    [1, 1, 2, 1, 1, 1, 2, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 3, 3, 3, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
  ];

  const colorFor = (v: number) => {
    if (v === 1) return palette.nucleusMid;
    if (v === 2) return palette.boltBright;
    if (v === 3) return palette.electron;
    if (v === 4) return palette.nucleusCore;
    return null;
  };

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* aura */}
      <rect x="-18" y="-18" width="36" height="36" rx="3" fill={palette.auraMid} opacity={0.15} filter={F.halo} />

      <motion.g
        animate={{ y: hovered ? [-1.2, 1.2, -1.2] : [0, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {art.map((row, r) =>
          row.map((v, c) => {
            const fill = colorFor(v);
            if (!fill) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={start + c * cell}
                y={start + r * cell}
                width={cell}
                height={cell}
                fill={fill}
                opacity={v === 2 || v === 4 ? 0.95 : 0.85}
                filter={v === 2 ? F.glow : undefined}
              />
            );
          }),
        )}
      </motion.g>

      {/* gözler ayrı animasyon — blink */}
      {[
        { x: start + 2 * cell, y: start + 3 * cell },
        { x: start + 6 * cell, y: start + 3 * cell },
      ].map((e, i) => (
        <motion.rect
          key={i}
          x={e.x}
          y={e.y}
          width={cell}
          height={cell * 2}
          fill={palette.boltBright}
          filter={F.glow}
          animate={{ scaleY: hovered ? [1, 0.15, 1] : [1, 1, 0.15, 1] }}
          transition={{
            duration: hovered ? 1.4 : 3,
            repeat: Infinity,
            times: hovered ? [0, 0.5, 1] : [0, 0.85, 0.93, 1],
            ease: "easeInOut",
          }}
          style={{ transformOrigin: `${e.x + cell / 2}px ${e.y + cell}px` }}
        />
      ))}
    </svg>
  );
}
