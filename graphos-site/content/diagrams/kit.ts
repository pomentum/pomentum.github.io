import type { DNode } from "../types";

// The parts every graphos diagram shares, so they read alike: callers on the left, graphos-api above the database, the
// database with its tenants' graphs below, and what graphos computes or sends out on the right. Canvas 960 × 520.

export const api = (sub = "typed HTTP · /v1 · bearer tokens"): DNode => ({ id: "api", kind: "panel", x: 250, y: 40, w: 330, h: 76, label: "graphos-api", sub, tone: "engine" });

export const db = (sub = "only graphos-api connects"): DNode => ({ id: "db", kind: "panel", x: 250, y: 196, w: 480, h: 290, label: "PostgreSQL 18 + Apache AGE 1.8", sub, tone: "protected" });

/** A tenant's graph inside the database: the first or the second slot. */
export const tenant = (id: string, label: string, slot: 0 | 1, sub = "its own AGE graph"): DNode => ({
  id,
  kind: "panel",
  x: slot === 0 ? 276 : 506,
  y: 256,
  w: 200,
  h: 200,
  label,
  sub,
  tone: "open",
});

/** A step inside a tenant's graph: one of four rows. */
export const row = (id: string, label: string, slot: 0 | 1, n: 0 | 1 | 2 | 3, hue: 0 | 1 | 2 | 3 = 0): DNode => ({
  id,
  kind: "chip",
  x: slot === 0 ? 292 : 522,
  y: 318 + n * 34,
  w: 168,
  h: 26,
  label,
  hue,
});

/** A caller on the left: one of three rows. */
export const caller = (id: string, icon: DNode["icon"], label: string, n: 0 | 1 | 2, sub?: string): DNode => ({
  id,
  kind: "icon",
  icon,
  x: 22,
  y: 40 + n * 150,
  w: 140,
  h: 90,
  label,
  sub,
});

/** Something on the right: one of three rows. */
export const outside = (id: string, icon: DNode["icon"], label: string, n: 0 | 1 | 2, sub?: string): DNode => ({
  id,
  kind: "icon",
  icon,
  side: "left",
  x: 800,
  y: 40 + n * 150,
  w: 140,
  h: 90,
  label,
  sub,
});

/** The left edge of graphos-api, at the height of caller n. */
export const intoApi = (n: 0 | 1 | 2): [number, number][] => {
  const y = 85 + n * 150;
  return n === 0 ? [[164, 70], [248, 70]] : [[164, y], [196 + n * 14, y], [196 + n * 14, 80 + n * 12], [248, 80 + n * 12]];
};
