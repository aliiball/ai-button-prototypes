import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Tesselasyon — üçgen tile grid'i, faz dalgasıyla renk geçişleri.
 */
export function TessellationMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);

  // 4 satır × 6 sütun (alt+üst üçgenler)
  const cols = 6;
  const rows = 4;
  const tileSize = 8;
  const xStart = -((cols * tileSize) / 2);
  const yStart = -((rows * tileSize) / 2);

  // her hücre 2 üçgen içerir (üst-sağ ve alt-sol)
  const cells: Array<{ x: number; y: number; type: "up" | "down"; idx: number; col: number; row: number }> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = xStart + c * tileSize;
      const y = yStart + r * tileSize;
      cells.push({ x, y, type: "up", idx: r * cols + c, col: c, row: r });
      cells.push({ x, y, type: "down", idx: r * cols + c + 1000, col: c, row: r });
    }
  }

  const triPath = (x: number, y: number, type: "up" | "down") =>
    type === "up"
      ? `M${x},${y} L${x + tileSize},${y} L${x + tileSize},${y + tileSize} Z`
      : `M${x},${y} L${x + tileSize},${y + tileSize} L${x},${y + tileSize} Z`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* aura */}
      <rect x="-26" y="-18" width="52" height="36" rx="6" fill={palette.auraMid} opacity={0.15} filter={F.halo} />

      {cells.map((cell) => {
        const phase = (cell.col + cell.row) * 0.5;
        const tile = (
          <motion.path
            key={`${cell.col}-${cell.row}-${cell.type}`}
            d={triPath(cell.x, cell.y, cell.type)}
            stroke={palette.orbitHighlight}
            strokeWidth={0.3}
            strokeOpacity={0.5}
            animate={{
              fill: [
                cell.type === "up" ? palette.nucleusMid : palette.boltMid,
                cell.type === "up" ? palette.electron : palette.nucleusMid,
                cell.type === "up" ? palette.nucleusMid : palette.boltMid,
              ],
              opacity: [0.55, 0.95, 0.55],
            }}
            transition={{
              duration: hovered ? 1.5 : 3,
              repeat: Infinity,
              delay: phase * 0.18,
              ease: "easeInOut",
            }}
          />
        );
        return tile;
      })}

      {/* merkezde parlak nokta */}
      <circle cx="0" cy="0" r="1.6" fill={palette.boltBright} filter={F.glow} />
    </svg>
  );
}
