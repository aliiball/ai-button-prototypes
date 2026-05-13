import type { MotifId, StyleVariant } from "./shared/types";
import { AtomMotif } from "./motifs/atom";
import { VortexMotif } from "./motifs/vortex";
import { PlasmaBallMotif } from "./motifs/plasma-ball";
import { PulsarMotif } from "./motifs/pulsar";
import { VortexFunnelStyle, VortexGalacticDiskStyle } from "./styles/vortex-styles";
import { PlasmaSleepingStyle, PlasmaPulseSyncStyle } from "./styles/plasma-styles";
import { PulsarLighthouseStyle, PulsarHeartbeatStyle } from "./styles/pulsar-styles";

/**
 * Atölye stil kayıtları — 4 ana motif × 3 stil.
 * "Klasik" stiller mevcut motifleri sarar (intensity opsiyonel olduğu için contravariance ile uyumlu).
 */
export const STYLES: StyleVariant[] = [
  // Atom — tek component, 3 preset (orbitPlaneCount/electronCount ile topoloji değişir)
  { id: "atom-classic",  parentId: "atom",        label: "Klasik",   description: "3 eliptik orbit, hover'da fractal yıldırım.",       Component: AtomMotif },
  { id: "atom-quark",    parentId: "atom",        label: "Quark",    description: "N elektron tek yatay düzlemde eşit aralıklı.",     Component: AtomMotif },
  { id: "atom-minimal",  parentId: "atom",        label: "Minimal",  description: "Tek orbit, parlayan çekirdek; sade.",                Component: AtomMotif },

  // Vortex
  { id: "vortex-classic",  parentId: "vortex", label: "Klasik",        description: "5 konsantrik döndürülmüş ellipse.",   Component: VortexMotif },
  { id: "vortex-funnel",   parentId: "vortex", label: "Funnel",        description: "Koni perspektifi: ring'ler aşağı daralır.", Component: VortexFunnelStyle },
  { id: "vortex-galactic", parentId: "vortex", label: "Galactic Disk", description: "Eğik düzlemde ring + dolanan yıldız.", Component: VortexGalacticDiskStyle },

  // Plasma
  { id: "plasma-classic",     parentId: "plasma-ball", label: "Klasik",     description: "4 zigzag arc, cam küre.",                       Component: PlasmaBallMotif },
  { id: "plasma-sleeping",    parentId: "plasma-ball", label: "Sleeping",   description: "1-3 yavaş arc, belirgin glassy highlight.",    Component: PlasmaSleepingStyle },
  { id: "plasma-pulse-sync",  parentId: "plasma-ball", label: "Pulse-sync", description: "Arc'lar nucleus pulse fazına senkron yanar.",  Component: PlasmaPulseSyncStyle },

  // Pulsar
  { id: "pulsar-classic",    parentId: "pulsar", label: "Klasik",     description: "Flare ışını + expanding halkalar + atan çekirdek.", Component: PulsarMotif },
  { id: "pulsar-lighthouse", parentId: "pulsar", label: "Lighthouse", description: "2 zıt koni ışın, döner deniz feneri.",              Component: PulsarLighthouseStyle },
  { id: "pulsar-heartbeat",  parentId: "pulsar", label: "Heartbeat",  description: "Flare yok; EKG-vari çift atım + tek halka.",        Component: PulsarHeartbeatStyle },
];

export const ATELIER_MOTIFS: MotifId[] = ["atom", "vortex", "plasma-ball", "pulsar"];

export const STYLES_BY_PARENT: Record<string, StyleVariant[]> = STYLES.reduce(
  (acc, s) => {
    (acc[s.parentId] ||= []).push(s);
    return acc;
  },
  {} as Record<string, StyleVariant[]>,
);

export const STYLE_MAP: Record<string, StyleVariant> = STYLES.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<string, StyleVariant>,
);
