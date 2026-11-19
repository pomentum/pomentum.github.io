import { useEffect, useId, useMemo, useRef, type CSSProperties } from "react";
import type { DFlow, DNode, DiagramDef, DStep, NodeState } from "../../content/types";
import { IconGlyph } from "./Icons";
import { useReducedMotion } from "../motion";
import { useView, type View } from "../view";
import { IsoDiagram } from "./IsoDiagram";
import { Boundary } from "./Boundary";

type Pt = [number, number];

/** Every node and flow drawn at a step: its own `show`, or the step before it with `add` and `drop` applied. */
export function visibleAt(def: DiagramDef, step: number): Set<string> {
  let now = new Set<string>();
  for (let i = 0; i <= step && i < def.steps.length; i++) {
    const s: DStep = def.steps[i];
    if (s.show) now = new Set(s.show);
    s.drop?.forEach((id) => now.delete(id));
    s.add?.forEach((id) => now.add(id));
  }
  return now;
}

const segLen = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const lengthOf = (pts: Pt[]) => pts.slice(1).reduce((sum, p, i) => sum + segLen(pts[i], p), 0);

/** The line up to a fraction of its length, and the point there. */
export function cut(pts: Pt[], frac: number): { pts: Pt[]; at: Pt } {
  const total = lengthOf(pts);
  let left = total * frac;
  const out: Pt[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const l = segLen(pts[i - 1], pts[i]);
    if (left <= l) {
      const t = l === 0 ? 0 : left / l;
      const at: Pt = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t];
      out.push(at);
      return { pts: out, at };
    }
    left -= l;
    out.push(pts[i]);
  }
  return { pts: out, at: pts[pts.length - 1] };
}

export const pathOf = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");

/** A rounded rectangle with a small cut corner at the top right. */
function panelPath(x: number, y: number, w: number, h: number, r = 12, c = 11) {
  return `M${x + r} ${y}H${x + w - c}L${x + w} ${y + c}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
}

function NodeShape({ n, uid, sub }: { n: DNode; uid: string; sub?: string }) {
  const tone = n.tone ?? "neutral";
  switch (n.kind) {
    case "panel":
      return (
        <>
          <path className="layer" d={panelPath(n.x + 6, n.y + 6, n.w, n.h)} />
          <path
            className="face"
            d={panelPath(n.x, n.y, n.w, n.h)}
            style={tone === "engine" ? { fill: `url(#${uid}-engine)` } : undefined}
            strokeDasharray={n.dashed ? "6 5" : undefined}
          />
          <text className="p-label" x={n.x + 14} y={n.y + 22}>
            {n.label}
          </text>
          {(sub ?? n.sub) && (
            <text className="p-sub" x={n.x + 14} y={n.y + 41}>
              {sub ?? n.sub}
            </text>
          )}
        </>
      );
    case "bar":
      return (
        <>
          <rect className="face" x={n.x} y={n.y} width={n.w} height={n.h} rx={9} />
          <text className="b-label" transform={`translate(${n.x + n.w / 2 + 4} ${n.y + n.h / 2}) rotate(-90)`} textAnchor="middle">
            {n.label}
          </text>
        </>
      );
    case "hbar":
      return (
        <>
          <rect className="face" x={n.x} y={n.y} width={n.w} height={n.h} rx={8} />
          <text className="b-label" x={n.x + n.w / 2} y={n.y + n.h / 2 + 4} textAnchor="middle">
            {n.label}
          </text>
        </>
      );
    case "chip":
      return (
        <>
          <rect className="face" x={n.x} y={n.y} width={n.w} height={n.h} rx={7} />
          <rect className={`sq hue-${n.hue ?? 0}`} x={n.x + 10} y={n.y + n.h / 2 - 5} width={10} height={10} rx={2} />
          <text className="c-label" x={n.x + 28} y={n.y + n.h / 2 + 4.5}>
            {sub ?? n.label}
          </text>
        </>
      );
    case "pill":
      return (
        <>
          <rect className="face" x={n.x} y={n.y} width={n.w} height={n.h} rx={n.h / 2} />
          <text className="pl-label" x={n.x + n.w / 2} y={n.y + n.h / 2 + 4} textAnchor="middle">
            {sub ?? n.label}
          </text>
        </>
      );
    case "icon": {
      const size = 40;
      return (
        <>
          <rect className="hit" x={n.x} y={n.y} width={n.w} height={n.h} rx={10} />
          <IconGlyph name={n.icon ?? "globe"} x={n.x + n.w / 2 - size / 2} y={n.y + 6} size={size} />
          <text className="i-label" x={n.x + n.w / 2} y={n.y + 64} textAnchor="middle">
            {n.label}
          </text>
          {(sub ?? n.sub) && (
            <text className="i-sub" x={n.x + n.w / 2} y={n.y + 79} textAnchor="middle">
              {sub ?? n.sub}
            </text>
          )}
        </>
      );
    }
  }
}

const SPEED = 120; // px per second

function Mover({ f, pts, still, blocked }: { f: DFlow; pts: Pt[]; still: boolean; blocked: boolean }) {
  const d = pathOf(pts);
  const len = lengthOf(pts);
  const dur = Math.max(1.1, len / SPEED);
  const body = f.msg ? (
    <>
      <rect x={-(f.msg.length * 3.6 + 9)} y={-9} width={f.msg.length * 7.2 + 18} height={18} rx={9} className={`m-pill k-${f.kind}`} />
      <text className="m-text" textAnchor="middle" y={4}>
        {f.msg}
      </text>
    </>
  ) : (
    <circle r={5} className={`m-dot k-${f.kind}`} />
  );
  if (still) {
    const at = cut(pts, blocked ? 0.85 : 0.55).at;
    return <g transform={`translate(${at[0]} ${at[1]})`}>{body}</g>;
  }
  const copies = f.msg || len < 60 ? 1 : 2;
  return (
    <>
      {Array.from({ length: copies }, (_, i) => (
        <g key={i} opacity={0}>
          {body}
          <animateMotion dur={`${dur}s`} begin={`${(i * dur) / copies}s`} repeatCount="indefinite" path={d} />
          <animate
            attributeName="opacity"
            dur={`${dur}s`}
            begin={`${(i * dur) / copies}s`}
            repeatCount="indefinite"
            values={blocked ? "0;1;1;0" : "0;1;1;0"}
            keyTimes={blocked ? "0;0.1;0.8;1" : "0;0.08;0.9;1"}
          />
        </g>
      ))}
    </>
  );
}

export function FlowLine({ f, uid, on, active, blocked, still }: { f: DFlow; uid: string; on: boolean; active: boolean; blocked: boolean; still: boolean }) {
  const half = blocked ? cut(f.pts, f.blockAt ?? 0.5) : null;
  const labelAt = f.label ? cut(f.pts, f.labelAt ?? 0.5).at : null;
  const vertical = f.pts.length === 2 && f.pts[0][0] === f.pts[1][0];
  return (
    <g className={`f k-${blocked ? "fail" : f.kind} ${on ? "on" : "off"} ${active ? "active" : ""}`} aria-hidden="true">
      <path className="line" d={pathOf(f.pts)} markerEnd={`url(#${uid}-a-${blocked ? "fail" : f.kind})`} strokeDasharray={blocked ? "5 5" : undefined} />
      {on && active && <Mover f={f} pts={half ? half.pts : f.pts} still={still} blocked={blocked} />}
      {labelAt && (
        <text className="f-label" x={labelAt[0] + (vertical ? 8 : 0)} y={labelAt[1] + (vertical ? 4 : -8)} textAnchor={vertical ? "start" : "middle"}>
          {f.label}
        </text>
      )}
      {half && (
        <g className="cross" transform={`translate(${half.at[0]} ${half.at[1]})`}>
          <circle r={11} />
          <path d="M-4.5 -4.5L4.5 4.5M4.5 -4.5L-4.5 4.5" />
        </g>
      )}
    </g>
  );
}

export interface DiagramProps {
  def: DiagramDef;
  step: number;
  paused?: boolean;
  /** changes to restart every animation */
  replay?: number;
  /** a thumbnail: the step drawn as it ends, nothing moving */
  still?: boolean;
  label?: string;
  describedBy?: string;
  className?: string;
}

export function FlatDiagram({ def, step, paused = false, replay = 0, still = false, label, describedBy, className }: DiagramProps) {
  const rawId = useId();
  const uid = "d" + rawId.replace(/[^a-zA-Z0-9]/g, "");
  const reduced = useReducedMotion();
  const calm = still || reduced;
  const ref = useRef<SVGSVGElement>(null);
  const s = def.steps[Math.min(step, def.steps.length - 1)] ?? {};
  const vis = useMemo(() => visibleAt(def, step), [def, step]);
  const active = new Set(s.active ?? []);
  const blocked = new Set(s.blocked ?? []);
  const trace = s.trace ?? [];

  useEffect(() => {
    const svg = ref.current;
    if (!svg || calm) return;
    try {
      if (paused) svg.pauseAnimations();
      else svg.unpauseAnimations();
    } catch {
      /* an SVG without SMIL support simply keeps moving */
    }
  }, [paused, replay, step, calm]);

  const traceT = trace.length * 0.6 + 1.4;

  return (
    <svg
      key={replay}
      ref={ref}
      className={`diagram ${still ? "still" : ""} ${paused ? "paused" : ""} ${className ?? ""}`}
      viewBox={`0 0 ${def.w} ${def.h}`}
      role={still ? undefined : "img"}
      aria-hidden={still ? true : undefined}
      aria-label={still ? undefined : label}
      aria-describedby={describedBy}
      focusable="false"
    >
      <defs>
        <linearGradient id={`${uid}-engine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--engine-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--engine-b)" }} />
        </linearGradient>
        {(["data", "control", "gateway", "fail"] as const).map((k) => (
          <marker key={k} id={`${uid}-a-${k}`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" className={`arrow k-${k}`} />
          </marker>
        ))}
      </defs>
      {def.nodes.map((n) => {
        const on = vis.has(n.id);
        if (still && !on) return null;
        const st: NodeState | undefined = s.state?.[n.id];
        const ti = trace.indexOf(n.id);
        const traced = ti >= 0;
        return (
          <g
            key={n.id}
            className={`n n-${n.kind} t-${n.tone ?? "neutral"} ${on ? "on" : "off"} ${st ? "s-" + st : ""} ${traced ? (calm ? "lit" : "tracing") : ""}`}
            style={traced && !calm ? ({ animationDelay: `${ti * 0.6}s`, "--trace-t": `${traceT}s` } as CSSProperties) : undefined}
          >
            <NodeShape n={n} uid={uid} sub={s.sub?.[n.id]} />
          </g>
        );
      })}
      {def.flows.map((f) => {
        const on = vis.has(f.id);
        if (still && !on) return null;
        return <FlowLine key={f.id} f={f} uid={uid} on={on} active={active.has(f.id)} blocked={blocked.has(f.id)} still={calm} />;
      })}
    </svg>
  );
}

/** The diagram in the view the visitor chose: 3D (isometric, the default) or flat. */
export function Diagram(props: DiagramProps & { view?: View }) {
  const chosen = useView().view;
  const view = props.view ?? chosen;
  return view === "flat" ? (
    <FlatDiagram {...props} />
  ) : (
    <Boundary fallback={<FlatDiagram {...props} />}>
      <IsoDiagram {...props} />
    </Boundary>
  );
}
