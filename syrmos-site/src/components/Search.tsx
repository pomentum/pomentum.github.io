import { useEffect, useMemo, useRef, useState } from "react";
import { useCases } from "../../content";
import { useI18n } from "../i18n";
import { href } from "../router";

interface Hit {
  slug: string;
  step: number;
  title: string;
  where: string;
  text: string;
}

/** The text with each searched word marked. */
function Marked({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>;
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return (
    <>
      {text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))}
    </>
  );
}

/** Search across the use cases and their steps; every word must appear. */
export function Search({ onClose }: { onClose: () => void }) {
  const i18n = useI18n();
  const { ui } = i18n;
  const [q, setQ] = useState("");
  const [at, setAt] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const back = useRef<Element | null>(document.activeElement);

  const index = useMemo(() => {
    const out: (Hit & { hay: string })[] = [];
    for (const m of useCases) {
      const w = i18n.text(m.slug);
      if (!w) continue;
      const t = w.t;
      out.push({ slug: m.slug, step: 1, title: t.title, where: `${ui.search.useCase} · ${ui.kinds[m.kind]}`, text: t.situation, hay: [t.title, t.situation, t.team, t.context, ui.kinds[m.kind]].join(" ").toLowerCase() });
      t.steps.forEach((s, i) =>
        out.push({ slug: m.slug, step: i + 1, title: s.title, where: `${t.title} · ${ui.search.stepOf(i + 1)}`, text: (s.body[0] ?? "").replace(/`/g, ""), hay: [s.title, ...s.body].join(" ").toLowerCase() }),
      );
    }
    return out;
  }, [i18n, ui]);

  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = words.length ? index.filter((h) => words.every((w) => h.hay.includes(w))).slice(0, 12) : index.filter((h) => h.step === 1 && h.where.startsWith(ui.search.useCase));

  useEffect(() => {
    input.current?.focus();
    const prev = back.current;
    return () => (prev as HTMLElement | null)?.focus?.();
  }, []);
  useEffect(() => setAt(0), [q]);

  const go = (h: Hit) => {
    location.hash = href.step(h.slug, h.step);
    onClose();
  };

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search" role="dialog" aria-modal="true" aria-label={ui.search.label}>
        <div className="search-head">
          <span>{ui.search.label}</span>
          <button type="button" className="esc" onClick={onClose}>
            Esc
          </button>
        </div>
        <div className="search-field">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5" />
          </svg>
          <input
            ref={input}
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={q}
            placeholder={ui.search.placeholder}
            aria-label={ui.search.label}
            aria-controls="search-results"
            aria-activedescendant={hits[at] ? `hit-${at}` : undefined}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              else if (e.key === "ArrowDown") {
                e.preventDefault();
                setAt((a) => Math.min(a + 1, hits.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setAt((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter" && hits[at]) go(hits[at]);
            }}
          />
        </div>
        <ul className="hits" id="search-results" role="listbox" aria-label={ui.search.label}>
          {hits.length === 0 && <li className="empty">{ui.search.empty}</li>}
          {hits.map((h, i) => (
            <li key={`${h.slug}-${h.step}-${h.where}`} id={`hit-${i}`} role="option" aria-selected={i === at}>
              <a href={href.step(h.slug, h.step)} onClick={onClose} onMouseEnter={() => setAt(i)}>
                <span className="hit-where">{h.where}</span>
                <span className="hit-title">
                  <Marked text={h.title} words={words} />
                </span>
                <span className="hit-text">
                  <Marked text={h.text} words={words} />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="search-hint">{ui.search.hint}</p>
      </div>
    </div>
  );
}
