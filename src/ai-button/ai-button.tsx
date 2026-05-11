import { useEffect, useRef, useState } from "react";
import { GlassShell } from "./shared/glass-shell";
import type { MotifId, Palette } from "./shared/types";
import { MOTIF_MAP } from "./index";

export type AIButtonProps = {
  motif: MotifId;
  palette: Palette;
  size?: number;
  label?: string;
  onClick?: () => void;
  /** Off-screen ise motif animasyonu duraklatılır */
  paused?: boolean;
};

export function AIButton({
  motif,
  palette,
  size = 72,
  label = "AI asistanı",
  onClick,
  paused = false,
}: AIButtonProps) {
  const entry = MOTIF_MAP[motif];
  const Motif = entry.Component;
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const pressedAtRef = useRef(0);

  const handleClick = () => {
    pressedAtRef.current = performance.now();
    setActive(true);
    onClick?.();
  };

  useEffect(() => {
    if (!active) return;
    const id = window.setTimeout(() => setActive(false), 420);
    return () => window.clearTimeout(id);
  }, [active]);

  return (
    <GlassShell
      palette={palette}
      size={size}
      label={`${entry.label} — ${palette.label}`}
      onClick={handleClick}
      onHoverChange={setHovered}
    >
      <Motif palette={palette} hovered={hovered && !paused} active={active} />
      <span className="sr-only">{label}</span>
    </GlassShell>
  );
}
