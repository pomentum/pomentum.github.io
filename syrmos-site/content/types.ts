// The shape of every use case. A use case is two files:
//   content/diagrams/<slug>.ts  what is drawn and what each step shows (no prose, no language)
//   content/en/<slug>.ts        the words, step by step
// Facts come only from the Syrmos main branch (README, docs, the public page). Where one cannot be found, the words file
// says TODO(verify) in its `verify` list, and the page says nothing it cannot back.

export type Status = "shown" | "target" | "dev";
export type Kind = "plant" | "devices" | "integrations" | "people" | "ai" | "tenants";
export type Tag = "problem" | "syrmos" | "how";

/** A part of Syrmos that "What Syrmos does here" and "How it works" name. */
export type PartId =
  | "cell"
  | "protected-cell"
  | "promotion"
  | "gateway"
  | "bus"
  | "bridge"
  | "tracing"
  | "review"
  | "audit"
  | "mcp"
  | "assistant"
  | "registry"
  | "spur";

export type IconName =
  | "sensor"
  | "fridge"
  | "chat"
  | "github"
  | "tracker"
  | "database"
  | "bucket"
  | "person"
  | "reviewer"
  | "agent"
  | "assistant"
  | "machine"
  | "globe"
  | "key"
  | "cart"
  | "model"
  | "attacker"
  | "log"
  | "synth"
  | "pad"
  | "keyboard"
  | "box"
  | "building"
  | "printer"
  | "scanner";

export type Tone = "engine" | "open" | "protected" | "neutral" | "danger" | "ghost";

export interface DNode {
  id: string;
  /**
   * panel: a rounded panel with a cut corner and a stacked layer (control plane, tenants, cells)
   * bar:   a vertical bar with a rotated label (connector bridge, credential gateway)
   * hbar:  a horizontal bar (the bus)
   * chip:  a small step inside a cell (a pipeline's node)
   * icon:  a real-world thing on the edge (a sensor, a phone, GitHub)
   * pill:  a small label (a version, a note)
   */
  kind: "panel" | "bar" | "hbar" | "chip" | "icon" | "pill";
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  tone?: Tone;
  icon?: IconName;
  dashed?: boolean;
  /** icon only, 3D view: its label beside it instead of below, for icons stacked in a column */
  side?: "left" | "right" | "above";
  /** chip only: which pipeline colour its square takes (0 to 3) */
  hue?: 0 | 1 | 2 | 3;
}

/** data: into a run (green) · control: control-plane actions (blue) · gateway: calls through the gateway (amber) · fail: a failure, an attack or a leak (red) */
export type FlowKind = "data" | "control" | "gateway" | "fail";

export interface DFlow {
  id: string;
  kind: FlowKind;
  /** the line's corners, from where it starts to where its arrow points */
  pts: [number, number][];
  /** a pill that travels along the line instead of a dot */
  msg?: string;
  /** a word written beside the line */
  label?: string;
  /** where the label sits, as a fraction of the line's length (0.5 by default) */
  labelAt?: number;
  /** when blocked, where the red × stands, as a fraction of the line's length (0.5 by default) */
  blockAt?: number;
}

export type NodeState = "hi" | "warn" | "bad" | "ok" | "dim";

export interface DStep {
  /** every node and flow drawn at this step; when absent, the previous step's, with `add` and `drop` applied */
  show?: string[];
  add?: string[];
  drop?: string[];
  /** nodes marked at this step */
  state?: Record<string, NodeState>;
  /** flows whose messages move at this step */
  active?: string[];
  /** flows stopped at a red × halfway */
  blocked?: string[];
  /** nodes lit one after another, as a run's trace */
  trace?: string[];
  /** a node's sub-label for this step (a version that changes, a count) */
  sub?: Record<string, string>;
}

export interface DiagramDef {
  w: number;
  h: number;
  nodes: DNode[];
  flows: DFlow[];
  steps: DStep[];
}

/** A screenshot of the Syrmos web UI (public/ui/<name>.webp), shown under a walkthrough. */
export type UiShot = "demo" | "editor" | "run" | "pipelines" | "connections" | "registry";

export interface UseCaseMeta {
  slug: string;
  kind: Kind;
  status: Status;
  diagram: DiagramDef;
  /** the step drawn on the gallery card (0-based) */
  thumb: number;
  /** the metric keys, in the order of the strip */
  metrics: string[];
  parts: PartId[];
  related: string[];
  /** the Syrmos screen this use case happens on, when one is published */
  shot?: UiShot;
}

export interface StepText {
  tag: Tag;
  title: string;
  body: string[];
  /** a value per metric key; a key left out keeps the previous step's value */
  metrics?: Record<string, string>;
}

export interface UseCaseText {
  title: string;
  situation: string;
  /** a short line beside the status where the badge alone would mislead */
  caveat?: string;
  team: string;
  /** "The situation": who this is for and what goes wrong without Syrmos */
  context: string;
  metricLabels: Record<string, string>;
  steps: StepText[];
  /** a line per part: what it does in this scenario */
  parts: Partial<Record<PartId, string>>;
  tryIt: { text: string; href?: string; linkText?: string };
  /** why the status badge says what it says, with the source */
  statusNote: string;
  /** facts not found on the Syrmos main branch: TODO(verify) */
  verify?: string[];
}
