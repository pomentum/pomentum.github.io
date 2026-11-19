import type { IconName } from "../../content/types";

// Simple line icons on a 24 × 24 grid, for the real-world things at a diagram's edges.
const ring = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

export const ICONS: Record<IconName, string[]> = {
  sensor: [ring(12, 12, 2), "M8 8a5.6 5.6 0 0 0 0 8", "M16 8a5.6 5.6 0 0 1 0 8", "M5 5a10 10 0 0 0 0 14", "M19 5a10 10 0 0 1 0 14"],
  fridge: ["M6.5 2h11a1.5 1.5 0 0 1 1.5 1.5v17a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20.5v-17A1.5 1.5 0 0 1 6.5 2z", "M5 9h14", "M8.5 4.5v2.5", "M8.5 12v4", "M15 14.5v3", ring(15, 18.5, 1.2)],
  chat: ["M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z", "M10.5 19.5h3", "M9 6.5h6a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1h-3.5l-2 1.8V12H9a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1z"],
  github: [ring(6, 18, 2.5), ring(6, 6, 2.5), ring(18, 6, 2.5), "M6 8.5v7", "M18 8.5c0 5-4 7-9.5 8.7"],
  tracker: ["M5 3h14v18H5z", "M8 8l1.5 1.5L12 7", "M14 8.5h2.5", "M8 13l1.5 1.5L12 12", "M14 13.5h2.5", "M8 18h8.5"],
  database: ["M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z", "M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6", "M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"],
  bucket: ["M4 6.5h16l-2 14H6z", "M4 6.5c0-1.4 3.6-2.5 8-2.5s8 1.1 8 2.5"],
  person: [ring(12, 7, 4), "M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"],
  reviewer: [ring(10, 7, 4), "M2.5 21c0-4.2 3.4-7 7.5-7 1.3 0 2.6.3 3.6.8", "M15 18l2 2 4.5-4.5"],
  agent: ["M6 8h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z", "M12 4v4", ring(12, 3, 1.2), "M9 13v1.5", "M15 13v1.5", "M2 12.5v3.5", "M22 12.5v3.5"],
  assistant: ["M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8z", "M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"],
  machine: ["M2.5 21h19", "M4 21V9.5l5 3v-3l5 3v-3l5 3V21", "M15.5 4h3v5.5h-3z", "M7 17h2", "M12 17h2"],
  globe: [ring(12, 12, 9), "M3 12h18", "M12 3c2.6 2.8 3.8 5.8 3.8 9s-1.2 6.2-3.8 9", "M12 3C9.4 5.8 8.2 8.8 8.2 12s1.2 6.2 3.8 9"],
  key: [ring(7.5, 15.5, 4), "M10.5 12.5L20 3", "M16.5 6.5l3 3", "M14 9l2 2"],
  cart: ["M3 4h2.2l2.4 11h10.8L21 7H6.2", ring(9, 19.5, 1.5), ring(17.5, 19.5, 1.5)],
  model: ["M7 7h10v10H7z", "M10 10h4v4h-4z", "M10 3v4", "M14 3v4", "M10 17v4", "M14 17v4", "M3 10h4", "M3 14h4", "M17 10h4", "M17 14h4"],
  attacker: ["M12 3l9.5 17h-19z", "M12 9.5v5", "M12 17.2v.3"],
  log: ["M6 3h9l4 4v14H6z", "M14.5 3v4.5H19", "M9 12h7", "M9 15.5h7", "M9 19h4"],
  graph: [ring(6, 6, 2.5), ring(18, 7, 2.5), ring(12, 18, 2.5), "M8.5 6.2L15.5 6.8", "M7.2 8.2L10.8 15.8", "M16.9 9.3L13.2 15.9"],
  sheet: ["M4 3h16v18H4z", "M4 8h16", "M4 13h16", "M4 18h16", "M10 3v18"],
  synth: ["M2 6h20v12H2z", "M7 13v5", "M12 13v5", "M17 13v5", "M6 6h2v7H6z", "M11 6h2v7h-2z", "M16 6h2v7h-2z"],
  pad: ["M3 3h18v18H3z", "M6 6h4v4H6z", "M14 6h4v4h-4z", "M6 14h4v4H6z", "M14 14h4v4h-4z"],
  keyboard: ["M2 6h20v12H2z", "M5.5 9.5h1", "M9 9.5h1", "M12.5 9.5h1", "M16 9.5h1", "M5.5 12.5h1", "M9 12.5h1", "M12.5 12.5h1", "M16 12.5h2.5", "M7 15.5h10"],
  box: ["M12 2.5l8.5 4.5v10L12 21.5 3.5 17V7z", "M3.5 7L12 11.5 20.5 7", "M12 11.5v10"],
  building: ["M2.5 21h19", "M4.5 21V4h10v17", "M14.5 9h5v12", "M7.5 7.5h4", "M7.5 11h4", "M7.5 14.5h4", "M16.5 12.5h1", "M16.5 16h1"],
  printer: ["M6.5 9V3h11v6", "M3 9h18v8h-3", "M6 17H3V9", "M6.5 14h11v7h-11z", "M17 11.5h1"],
  scanner: ["M3 13h18v6H3z", "M3 13l3-7h13", "M6.5 16h7", "M17 16h1"],
};

export function IconGlyph({ name, x, y, size }: { name: IconName; x: number; y: number; size: number }) {
  const k = size / 24;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} className="glyph">
      {ICONS[name].map((d, i) => (
        <path key={i} d={d} vectorEffect="non-scaling-stroke" />
      ))}
    </g>
  );
}
