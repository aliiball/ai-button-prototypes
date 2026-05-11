import type { PropsWithChildren } from "react";
import type { Palette } from "./types";

type Props = PropsWithChildren<{
  palette: Palette;
  size?: number;
  label?: string;
  onClick?: () => void;
  onHoverChange?: (hovered: boolean) => void;
}>;

/**
 * Glassmorphic dairesel kabuk. Tüm motiflerin altında oturur.
 * Kaynak: sahibinden-v2 GlassButton (Tailwind v4) → Tailwind v3 + plain CSS sınıflarına uyarlandı.
 */
export function GlassShell({
  palette,
  size = 72,
  label,
  onClick,
  onHoverChange,
  children,
}: Props) {
  return (
    <button
      type="button"
      aria-label={label ?? "AI asistanı"}
      onClick={onClick}
      onPointerEnter={() => onHoverChange?.(true)}
      onPointerLeave={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => onHoverChange?.(false)}
      className={`relative inline-flex items-center justify-center rounded-full transition-transform duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200/50 ${palette.shellClass}`}
      style={{ width: size, height: size }}
    >
      <span className="glass-shell-shadow" aria-hidden />
      <span
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {children}
      </span>
    </button>
  );
}
