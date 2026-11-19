import { useEffect, useId, useMemo, useRef, type CSSProperties, type ReactNode } from "react";
import type { DFlow, DNode, DiagramDef, NodeState } from "../../content/types";
import { ICONS } from "./Icons";
import { useReducedMotion } from "../motion";
import { FlowLine, visibleAt, type DiagramProps } from "./Diagram";

// The same diagrams in 3D: the content's flat layout is laid on an isometric floor. Panels become slabs (a cell stands on its
// tenant), the connector bridge and the credential gateway become walls with their names along the side, the things at the
// edges stand on plinths, and messages travel along the lines on the surfaces they cross.

type Pt = [number, number];
// An oblique view from the front, a little to the right and above: x stays horizontal, depth (y) recedes up and to the right,
// height (z) is straight up. Every slab shows its top, its front and its right side; text stays upright and unsheared.
const X: Pt = [1, 0];
const Y: Pt = [-0.22, 0.66];
const P = (x: number, y: number, z = 0): Pt => [x * X[0] + y * Y[0], x * X[1] + y * Y[1] - z];
/** how far back a point is, seen from the viewer: smaller is further */
const depth = (x: number, y: number) => 0.22 * x + y;
const poly = (pts: Pt[]) => pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
/** text standing at a point of a surface at height z */
const at = (x: number, y: number, z: number) => {
  const [px, py] = P(x, y, z);
  return `translate(${px.toFixed(1)} ${py.toFixed(1)})`;
};
const flat = at;
const onFront = at;

function heightOf(n: DNode): number {
  switch (n.kind) {
    case "panel":
      return n.tone === "ghost" ? 0 : n.tone === "neutral" ? 14 : n.tone === "engine" ? 24 : 18;
    case "chip":
      return 7;
    case "hbar":
      return 14;
    case "bar":
      return 46;
    case "pill":
      return 6;
    case "icon":
      return 7;
  }
}

const inside = (a: DNode, b: DNode) => a !== b && a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h;
const holds = (n: DNode) => n.kind === "panel" || n.kind === "hbar" || n.kind === "chip";

/** Where each visible node stands: on the top of the smallest visible panel that holds its footprint, or on the floor. */
function bases(nodes: DNode[], vis: Set<string>): Map<string, number> {
  const out = new Map<string, number>();
  const holders = nodes.filter((n) => holds(n) && vis.has(n.id)).sort((a, b) => b.w * b.h - a.w * a.h);
  const order = new Map(nodes.map((n, i) => [n.id, i]));
  const area = (n: DNode) => n.w * n.h;
  // a holder is larger, or as large and listed earlier, so two panels on one footprint never hold each other
  const above = (h: DNode, n: DNode) => area(h) > area(n) || (area(h) === area(n) && (order.get(h.id) ?? 0) < (order.get(n.id) ?? 0));
  const baseOf = (n: DNode): number => {
    const known = out.get(n.id);
    if (known !== undefined) return known;
    let parent: DNode | undefined;
    for (const h of holders) if (inside(n, h) && above(h, n) && (!parent || area(h) < area(parent))) parent = h;
    const z = parent ? baseOf(parent) + heightOf(parent) : 0;
    out.set(n.id, z);
    return z;
  };
  nodes.forEach(baseOf);
  return out;
}

/** The height of the surface under a point: the top of what stands there, or half up a wall the point touches. */
function surfaceAt(x: number, y: number, nodes: DNode[], vis: Set<string>, base: Map<string, number>): number {
  let z = 0;
  for (const n of nodes) {
    if (!vis.has(n.id)) continue;
    const pad = n.kind === "bar" ? 6 : 0;
    if (x >= n.x - pad && x <= n.x + n.w + pad && y >= n.y - pad && y <= n.y + n.h + pad) {
      if (n.kind === "bar") z = Math.max(z, heightOf(n) * 0.45);
      else if (holds(n) && n.tone !== "ghost") z = Math.max(z, (base.get(n.id) ?? 0) + heightOf(n));
    }
  }
  return z + 1.5;
}

function Slab({ x, y, w, h, b, t, cls, topStyle, dashed }: { x: number; y: number; w: number; h: number; b: number; t: number; cls?: string; topStyle?: CSSProperties; dashed?: boolean }) {
  const top = [P(x, y, t), P(x + w, y, t), P(x + w, y + h, t), P(x, y + h, t)];
  return (
    <g className={cls}>
      {t > b && (
        <>
          <polygon className="side-l" points={poly([P(x, y + h, b), P(x + w, y + h, b), P(x + w, y + h, t), P(x, y + h, t)])} />
          <polygon className="side-r" points={poly([P(x + w, y, b), P(x + w, y + h, b), P(x + w, y + h, t), P(x + w, y, t)])} />
        </>
      )}
      <polygon className="face" points={poly(top)} style={topStyle} strokeDasharray={dashed ? "6 5" : undefined} />
    </g>
  );
}

/** A wall's name, upright on a sign above its front end, so it reads whatever the angle. */
function WallSign({ n, left }: { n: DNode; left: boolean }) {
  const w = n.label.length * 7.4 + 22;
  const [fx, fy] = P(left ? n.x : n.x + n.w, n.y + n.h, 0);
  const px = left ? fx - w / 2 + 16 : fx + w / 2 - 16;
  const py = fy + 16;
  return (
    <g className={`wall-sign t-${n.tone ?? "neutral"}`} transform={`translate(${px.toFixed(1)} ${py.toFixed(1)})`}>
      <rect className="sign" x={-w / 2} y={-10} width={w} height={20} rx={10} />
      <text className="b-label" textAnchor="middle" y={4}>
        {n.label}
      </text>
    </g>
  );
}

function IsoNode({ n, b, uid, sub }: { n: DNode; b: number; uid: string; sub?: string }) {
  const H = heightOf(n);
  const t = b + H;
  const tone = n.tone ?? "neutral";
  let body: ReactNode = null;
  switch (n.kind) {
    case "panel":
      body = (
        <>
          <Slab x={n.x} y={n.y} w={n.w} h={n.h} b={b} t={t} topStyle={tone === "engine" ? { fill: `url(#${uid}-engine)` } : undefined} dashed={n.dashed} />
          {n.label && tone === "ghost" ? (
            <g transform={onFront(n.x + 16, n.y + n.h, b)}>
              <text className="p-label plate" y={14}>
                {n.label}
              </text>
              {(sub ?? n.sub) && (
                <text className="p-sub" y={30}>
                  {sub ?? n.sub}
                </text>
              )}
            </g>
          ) : n.label && tone === "neutral" ? (
            <text className="p-label plate" transform={onFront(n.x + 16, n.y + n.h, b)} y={-3.5}>
              {n.label}
            </text>
          ) : n.label ? (
            <text className="p-label" transform={flat(n.x + 14, n.y + 14, t)} y={4}>
              {n.label}
            </text>
          ) : null}
          {(sub ?? n.sub) && tone !== "ghost" && (
            <text className="p-sub" transform={flat(n.x + 14, n.y + 14, t)} y={20}>
              {sub ?? n.sub}
            </text>
          )}
        </>
      );
      break;
    case "chip": {
      const sq = [P(n.x + 9, n.y + n.h / 2 - 5, t), P(n.x + 19, n.y + n.h / 2 - 5, t), P(n.x + 19, n.y + n.h / 2 + 5, t), P(n.x + 9, n.y + n.h / 2 + 5, t)];
      body = (
        <>
          <Slab x={n.x} y={n.y} w={n.w} h={n.h} b={b} t={t} />
          <polygon className={`sq hue-${n.hue ?? 0}`} points={poly(sq)} />
          <text className="c-label" transform={flat(n.x + 26, n.y + n.h / 2 + 4.5, t)}>
            {sub ?? n.label}
          </text>
        </>
      );
      break;
    }
    case "bar":
      body = (
        <>
          <Slab x={n.x} y={n.y} w={n.w} h={n.h} b={b} t={t} />
        </>
      );
      break;
    case "hbar":
      body = (
        <>
          <Slab x={n.x} y={n.y} w={n.w} h={n.h} b={b} t={t} />
          <text className="b-label" textAnchor="middle" transform={onFront(n.x + n.w / 2, n.y + n.h, b + 3.5)}>
            {n.label}
          </text>
        </>
      );
      break;
    case "pill":
      body = (
        <>
          <Slab x={n.x} y={n.y} w={n.w} h={n.h} b={b} t={t} />
          <text className="pl-label" textAnchor="middle" transform={flat(n.x + n.w / 2, n.y + n.h / 2 + 4, t)}>
            {sub ?? n.label}
          </text>
        </>
      );
      break;
    case "icon": {
      const cx = n.x + n.w / 2;
      const cy = n.y + Math.min(n.h, n.w) / 2 - 4;
      const r = 22;
      const [px, py] = P(cx, cy, t);
      const [, ly] = P(cx + r, cy + r, b);
      body = (
        <>
          <ellipse className="shadow" cx={px} cy={py + H + 2} rx={r * 1.5} ry={r * 0.75} />
          <Slab x={cx - r} y={cy - r} w={2 * r} h={2 * r} b={b} t={t} />
          <g className="billboard" transform={`translate(${px - 20} ${py - 50})`}>
            <rect className="hit" x={-6} y={-4} width={52} height={50} rx={12} />
            <g className="glyph" transform="scale(1.6667)">
              {ICONS[n.icon ?? "globe"].map((d, i) => (
                <path key={i} d={d} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
          </g>
          {n.side === "above" ? (
            <g transform={`translate(${px} ${py - 60})`}>
              <text className="i-label" textAnchor="middle">
                {n.label}
              </text>
              {(sub ?? n.sub) && (
                <text className="i-sub" y={-14} textAnchor="middle">
                  {sub ?? n.sub}
                </text>
              )}
            </g>
          ) : n.side ? (
            <g transform={`translate(${n.side === "left" ? px - 34 : px + 34} ${py - 26})`}>
              <text className="i-label" textAnchor={n.side === "left" ? "end" : "start"}>
                {n.label}
              </text>
              {(sub ?? n.sub) && (
                <text className="i-sub" y={14} textAnchor={n.side === "left" ? "end" : "start"}>
                  {sub ?? n.sub}
                </text>
              )}
            </g>
          ) : (
            <>
              <text className="i-label" x={px} y={ly + 16} textAnchor="middle">
                {n.label}
              </text>
              {(sub ?? n.sub) && (
                <text className="i-sub" x={px} y={ly + 30} textAnchor="middle">
                  {sub ?? n.sub}
                </text>
              )}
            </>
          )}
        </>
      );
      break;
    }
  }
  return body;
}

/** The corners every node can take, for a viewBox that stays the same from step to step. */
function bounds(def: DiagramDef): [number, number, number, number] {
  const all = new Set(def.nodes.map((n) => n.id));
  const base = bases(def.nodes, all);
  const pts: Pt[] = [];
  for (const n of def.nodes) {
    const b = base.get(n.id) ?? 0;
    const t = b + heightOf(n) + (n.kind === "icon" ? 64 : n.kind === "bar" ? 40 : 0);
    const below = n.kind === "icon" ? 40 : n.kind === "bar" ? 50 : n.tone === "ghost" ? 34 : 0;
    if (n.side === "left" || n.side === "right") pts.push(P(n.side === "left" ? n.x - 120 : n.x + n.w + 120, n.y + n.h / 2, 0));
    if (n.side === "above") pts.push(P(n.x + n.w / 2, n.y, t + 34));
    pts.push(P(n.x, n.y, t), P(n.x + n.w, n.y, t), P(n.x, n.y + n.h, t), P(n.x + n.w, n.y + n.h, -below), P(n.x, n.y + n.h, -below));
    if (n.kind === "bar") {
      // the sign at the wall's foot sticks out to one side by nearly its width: keep it inside the picture
      const sw = n.label.length * 7.4 + 22;
      const [lx, ly] = P(n.x, n.y + n.h, 0);
      const [rx] = P(n.x + n.w, n.y + n.h, 0);
      pts.push([lx - sw + 10, ly + 28], [rx + sw - 10, ly + 28]);
    }
  }
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const pad = 10;
  return [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) - Math.min(...xs) + 2 * pad, Math.max(...ys) - Math.min(...ys) + 2 * pad];
}

export function IsoDiagram({ def, step, paused = false, replay = 0, still = false, label, describedBy, className }: DiagramProps) {
  const rawId = useId();
  const uid = "i" + rawId.replace(/[^a-zA-Z0-9]/g, "");
  const reduced = useReducedMotion();
  const calm = still || reduced;
  const ref = useRef<SVGSVGElement>(null);
  const s = def.steps[Math.min(step, def.steps.length - 1)] ?? {};
  const vis = useMemo(() => visibleAt(def, step), [def, step]);
  const base = useMemo(() => bases(def.nodes, vis), [def, vis]);
  const box = useMemo(() => bounds(def), [def]);
  const active = new Set(s.active ?? []);
  const blocked = new Set(s.blocked ?? []);
  const trace = s.trace ?? [];
  const traceT = trace.length * 0.6 + 1.4;

  useEffect(() => {
    const svg = ref.current;
    if (!svg || calm) return;
    try {
      if (paused) svg.pauseAnimations();
      else svg.unpauseAnimations();
    } catch {
      /* no SMIL: it keeps moving */
    }
  }, [paused, replay, step, calm]);

  // Back to front: what stands further back (smaller x + y) is drawn first; a node on a panel after the panel.
  const order = useMemo(() => [...def.nodes].sort((a, b) => depth(a.x, a.y) + (base.get(a.id) ?? 0) * 0.01 - (depth(b.x, b.y) + (base.get(b.id) ?? 0) * 0.01)), [def, base]);

  const projected: DFlow[] = useMemo(
    () => def.flows.map((f) => ({ ...f, pts: f.pts.map(([x, y]) => P(x, y, surfaceAt(x, y, def.nodes, vis, base))) as [number, number][] })),
    [def, vis, base],
  );

  const grid: string[] = [];
  for (let gx = 0; gx <= def.w; gx += 40) grid.push(`M${P(gx, 0).join(" ")}L${P(gx, def.h).join(" ")}`);
  for (let gy = 0; gy <= def.h; gy += 40) grid.push(`M${P(0, gy).join(" ")}L${P(def.w, gy).join(" ")}`);

  return (
    <svg
      key={replay}
      ref={ref}
      className={`diagram iso ${still ? "still" : ""} ${paused ? "paused" : ""} ${className ?? ""}`}
      viewBox={box.map((v) => v.toFixed(0)).join(" ")}
      role={still ? undefined : "img"}
      aria-hidden={still ? true : undefined}
      aria-label={still ? undefined : label}
      aria-describedby={describedBy}
      focusable="false"
    >
      <defs>
        <linearGradient id={`${uid}-engine`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--engine-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--engine-b)" }} />
        </linearGradient>
        {(["data", "control", "gateway", "fail"] as const).map((k) => (
          <marker key={k} id={`${uid}-a-${k}`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" className={`arrow k-${k}`} />
          </marker>
        ))}
      </defs>
      <g className="floor" aria-hidden="true">
        <polygon className="floor-plate" points={poly([P(0, 0), P(def.w, 0), P(def.w, def.h), P(0, def.h)])} />
        <path className="floor-grid" d={grid.join("")} />
      </g>
      {order.map((n) => {
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
            <IsoNode n={n} b={base.get(n.id) ?? 0} uid={uid} sub={s.sub?.[n.id]} />
          </g>
        );
      })}
      {def.nodes
        .filter((n) => n.kind === "bar" && vis.has(n.id))
        .map((n) => (
          <WallSign key={`sign-${n.id}`} n={n} left={n.x + n.w / 2 < def.w / 2} />
        ))}
      {projected.map((f) => {
        const on = vis.has(f.id);
        if (still && !on) return null;
        return <FlowLine key={f.id} f={f} uid={uid} on={on} active={active.has(f.id)} blocked={blocked.has(f.id)} still={calm} />;
      })}
    </svg>
  );
}
