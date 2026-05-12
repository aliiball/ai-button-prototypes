export type PaletteId = "iridescent" | "warm" | "ocean" | "cyber";

export type IntensityId = "calm" | "normal" | "intense";

export type Palette = {
  id: PaletteId;
  label: string;
  // Çekirdek (nucleus) tonları
  nucleusCore: string;
  nucleusMid: string;
  nucleusDeep: string;
  // Halo / aura
  auraInner: string;
  auraMid: string;
  auraOuter: string;
  // Orbit / çizgi tonları
  orbitDeep: string;
  orbitMid: string;
  orbitHighlight: string;
  // Parçacık
  electron: string;
  // Lightning bolt katmanları
  boltDeep: string;
  boltMid: string;
  boltBright: string;
  // Glass shell sınıfı
  shellClass: string;
};

export type MotifId =
  // Hero / Iconic
  | "aurora-mesh"
  | "star-cluster"
  | "sparkle"
  // Organic & flowing
  | "liquid-blob"
  | "flowing-ribbon"
  | "infinity-flow"
  | "magic-wand"
  | "vine-growth"
  | "ouroboros"
  | "origami-crane"
  | "phoenix-flame"
  // Geometric / structural
  | "polyhedron"
  | "prism"
  | "hexagon-hive"
  | "pixel-grid"
  | "mobius-strip"
  | "trefoil-knot"
  | "snowflake"
  | "tessellation"
  | "crystal-cluster"
  | "geodesic-sphere"
  | "gear"
  // Orbital / particle systems
  | "atom"
  | "orbital-rings"
  | "spiral-galaxy"
  | "particle-swarm"
  | "constellation"
  | "bohr-atom"
  // Energy & light
  | "orb-pulse"
  | "soap-bubble"
  | "vortex"
  | "lightbulb"
  | "plasma-ball"
  | "lightning-bolt"
  | "eclipse"
  | "vinyl-disk"
  | "pulsar"
  | "ai-core"
  // Motion / trail
  | "comet"
  | "spotlight"
  | "bezier-pen"
  | "heart-pulse"
  | "water-drop"
  // Cognition / connection
  | "neural-web"
  | "brain"
  | "dna-helix"
  | "quantum-cloud"
  // Optical / cinematic
  | "camera-aperture"
  | "glitch"
  | "mandelbrot"
  // UI / sound metaphor
  | "chat-bubble"
  | "voice-wave"
  | "equalizer"
  | "text-cursor"
  | "code-brackets"
  | "holographic-card"
  | "sigil"
  | "radial-spectrum"
  | "singing-bowl"
  | "token-stream"
  | "cloud-ai"
  | "pixel-sprite"
  | "broadcast-antenna"
  // Watcher
  | "eye-iris";

export type MotifProps = {
  palette: Palette;
  hovered: boolean;
  active: boolean;
  /** Opsiyonel yoğunluk parametresi — atölye modunda kullanılır, galeri modunda "normal" gibi davranır. */
  intensity?: IntensityId;
};

export type MotifEntry = {
  id: MotifId;
  label: string;
  description: string;
  Component: React.ComponentType<MotifProps>;
};

export type VariantProps = {
  palette: Palette;
  hovered: boolean;
  active: boolean;
  intensity: IntensityId;
};

export type StyleVariant = {
  id: string;
  parentId: MotifId;
  label: string;
  description: string;
  Component: React.ComponentType<VariantProps>;
};
