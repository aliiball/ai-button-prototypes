import type { ReactNode } from "react";

/**
 * Atölye UI primitive kit — Slider / Toggle / Select / ColorField / ControlGrid.
 * Tüm input'lar controlled. Label'lar tutarlı tipografi: mono 10px upper.
 */

const LABEL_CLS =
  "font-mono text-[10px] uppercase tracking-[0.18em] text-page-mute";

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
};

export function Slider({
  label,
  value,
  min,
  max,
  step = 0.01,
  suffix = "",
  onChange,
}: SliderProps) {
  const display =
    step >= 1 ? Math.round(value).toString() : value.toFixed(step < 0.1 ? 2 : 1);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className={LABEL_CLS}>{label}</span>
        <span className="font-mono text-[10px] text-page-ink/80">
          {display}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-fuchsia-300 h-1"
      />
    </div>
  );
}

type ToggleProps = {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
};

export function Toggle({ label, value, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className={LABEL_CLS}>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          value ? "bg-fuchsia-400/70" : "bg-page-panel/80 border border-white/10"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-page-ink transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

type SelectProps<T extends string> = {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
};

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: SelectProps<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className={LABEL_CLS}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="bg-page-panel/60 border border-white/10 rounded-md px-2 py-1.5 text-xs text-page-ink focus:outline-none focus:border-fuchsia-300/40"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id} className="bg-page-bg text-page-ink">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

type ColorFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
};

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className={LABEL_CLS}>{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-9 rounded border border-white/10 bg-transparent p-0 cursor-pointer"
          aria-label={`${label} renk seçici`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-page-panel/60 border border-white/10 rounded px-2 py-1 text-[11px] font-mono text-page-ink focus:outline-none focus:border-fuchsia-300/40"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

type ControlGridProps = {
  children: ReactNode;
  title?: string;
};

export function ControlGrid({ children, title }: ControlGridProps) {
  return (
    <div className="flex flex-col gap-3">
      {title && (
        <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-page-ink/70">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
        {children}
      </div>
    </div>
  );
}

type ActionButtonProps = {
  onClick: () => void;
  children: ReactNode;
  variant?: "default" | "ghost";
  ariaLabel?: string;
};

export function ActionButton({
  onClick,
  children,
  variant = "default",
  ariaLabel,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`font-mono text-[10px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border transition-colors ${
        variant === "default"
          ? "bg-page-panel/60 border-white/10 text-page-ink hover:border-fuchsia-200/40"
          : "bg-transparent border-transparent text-page-mute hover:text-page-ink"
      }`}
    >
      {children}
    </button>
  );
}
