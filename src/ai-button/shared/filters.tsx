import type { ReactElement } from "react";

/**
 * Tüm motiflerin paylaştığı SVG <defs>.
 * Kaynak: sahibinden-v2 AtomButton.
 * Filter ID'leri çakışma yaratmaması için bir suffix alır (palet/motif başına benzersiz).
 */
export function SharedDefs({ suffix }: { suffix: string }): ReactElement {
  return (
    <defs>
      <filter
        id={`f-depth-${suffix}`}
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
      >
        <feGaussianBlur in="SourceAlpha" stdDeviation="0.5" />
        <feOffset dx="0.3" dy="0.6" result="off" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.55" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter
        id={`f-glow-${suffix}`}
        x="-200%"
        y="-200%"
        width="500%"
        height="500%"
      >
        <feGaussianBlur stdDeviation="1.6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter
        id={`f-halo-${suffix}`}
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
      >
        <feGaussianBlur stdDeviation="2.6" />
      </filter>
      <filter
        id={`f-soft-${suffix}`}
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
      >
        <feGaussianBlur stdDeviation="0.9" />
      </filter>
    </defs>
  );
}

export const filterIds = (suffix: string) => ({
  depth: `url(#f-depth-${suffix})`,
  glow: `url(#f-glow-${suffix})`,
  halo: `url(#f-halo-${suffix})`,
  soft: `url(#f-soft-${suffix})`,
});
