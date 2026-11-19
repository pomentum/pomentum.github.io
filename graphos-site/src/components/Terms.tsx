import type { ReactNode } from "react";
import { glossary } from "../../content/en/ui";

/**
 * A paragraph with `code` spans, and the first use on the page of each of graphos's words explained in place: a
 * dotted underline, its definition shown on hover or focus (a tap focuses it on a phone). `seen` carries the words already
 * explained higher up the page, so each is explained once. A function, not a component, so the page's own render fills `seen`
 * in reading order and a second render (React's strict mode) starts it afresh.
 */
export function prose(text: string, seen: Set<string>): ReactNode[] {
  const out: ReactNode[] = [];
  text.split("`").forEach((part, k) => {
    if (k % 2) {
      out.push(<code key={`c${k}`}>{part}</code>);
      return;
    }
    // [words](https://...) is a link to a source, [words](#/...) one to a page here; the words are not explained as terms
    part.split(/(\[[^\]]+\]\((?:https:\/\/|#\/)[^)\s]+\))/).forEach((bit, j) => {
      const m = /^\[([^\]]+)\]\(((?:https:\/\/|#\/)[^)\s]+)\)$/.exec(bit);
      if (m) out.push(<a key={`l${k}-${j}`} href={m[2]} rel={m[2].startsWith("#") ? undefined : "noopener"}>{m[1]}</a>);
      else out.push(...terms(bit, seen, `t${k}-${j}`));
    });
  });
  return out;
}

function terms(text: string, seen: Set<string>, key: string): ReactNode[] {
  // the earliest match of a word not explained yet; "protected cell" is listed before "cell", so it wins where both match
  let best: { at: number; len: number; id: string; def: string } | null = null;
  for (const g of glossary) {
    if (seen.has(g.id)) continue;
    const m = g.re.exec(text);
    if (m && (!best || m.index < best.at)) best = { at: m.index, len: m[0].length, id: g.id, def: g.def };
  }
  if (!best) return [text];
  seen.add(best.id);
  if (best.id === "protected-cell") seen.add("cell");
  const word = text.slice(best.at, best.at + best.len);
  const tip = `term-${best.id}-${key}`;
  return [
    text.slice(0, best.at),
    <span key={tip} className="term" tabIndex={0} aria-describedby={tip}>
      {word}
      <span role="tooltip" id={tip} className="term-tip">
        {best.def}
      </span>
    </span>,
    ...terms(text.slice(best.at + best.len), seen, `${key}x`),
  ];
}
