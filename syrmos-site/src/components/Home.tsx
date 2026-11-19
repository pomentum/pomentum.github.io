import { useMemo, useState } from "react";
import { useCases } from "../../content";
import { overview } from "../../content/diagrams/overview";
import type { Kind, Status, UseCaseMeta } from "../../content/types";
import { useI18n } from "../i18n";
import { href } from "../router";
import { Diagram } from "./Diagram";
import { StageScroll } from "./StageScroll";
import { Legend } from "./Legend";
import { ViewSwitch } from "./ViewSwitch";
import { Badge } from "./Badge";
import { GitHubMark, README, REPO } from "./TopBar";
import { OutLink } from "./OutLink";

const KINDS: Kind[] = ["plant", "devices", "integrations", "people", "ai", "tenants"];
const STATUSES: Status[] = ["shown", "target", "dev"];

export function Card({ m, visited }: { m: UseCaseMeta; visited: boolean }) {
  const i18n = useI18n();
  const w = i18n.text(m.slug);
  if (!w) return null;
  const t = w.t;
  return (
    <li className={`card ${visited ? "visited" : ""}`}>
      <a href={href.step(m.slug, 1)}>
        <div className="thumb">
          <Diagram def={m.diagram} step={m.thumb} still />
        </div>
        <div className="card-body">
          <div className="card-meta">
            <span className="tag kind">{i18n.ui.kinds[m.kind]}</span>
            <Badge status={m.status} />
          </div>
          <h3>{t.title}</h3>
          {t.caveat && <p className="caveat">{t.caveat}</p>}
          <p>{t.situation}</p>
          <p className="card-foot">
            <span>{t.team}</span>
            <span>{i18n.ui.gallery.steps(t.steps.length)}</span>
            {visited && (
              <span className="seen">
                <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8.5l3 3 7-7" />
                </svg>
                {i18n.ui.gallery.visited}
              </span>
            )}
          </p>
        </div>
      </a>
    </li>
  );
}

export function Gallery({ visited }: { visited: string[] }) {
  const i18n = useI18n();
  const { ui } = i18n;
  const [kind, setKind] = useState<Kind | "all">("all");
  const [status, setStatus] = useState<Status | "all">("all");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return useCases.filter((m) => {
      if (kind !== "all" && m.kind !== kind) return false;
      if (status !== "all" && m.status !== status) return false;
      if (!words.length) return true;
      const t = i18n.text(m.slug)?.t;
      const hay = t ? [t.title, t.situation, t.team, ui.kinds[m.kind], ...t.steps.map((s) => s.title)].join(" ").toLowerCase() : "";
      return words.every((w) => hay.includes(w));
    });
  }, [kind, status, q, i18n, ui]);

  return (
    <section className="gallery" id="gallery" aria-labelledby="gallery-title">
      <div className="section-head">
        <h2 id="gallery-title">{ui.gallery.title}</h2>
        <p>{ui.gallery.lede}</p>
      </div>
      <div className="filters">
        <div className="filter-row" role="group" aria-label={ui.gallery.kind}>
          <span className="filter-name">{ui.gallery.kind}</span>
          <div className="chips">
            {(["all", ...KINDS] as const).map((k) => (
              <button key={k} type="button" className="chip" aria-pressed={kind === k} onClick={() => setKind(k)}>
                {k === "all" ? ui.gallery.all : ui.kinds[k]}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-row" role="group" aria-label={ui.gallery.status}>
          <span className="filter-name">{ui.gallery.status}</span>
          <div className="chips">
            {(["all", ...STATUSES] as const).map((s) => (
              <button key={s} type="button" className={`chip st-${s}`} aria-pressed={status === s} onClick={() => setStatus(s)} title={s === "all" ? undefined : ui.statusHelp[s]}>
                {s === "all" ? ui.gallery.all : ui.status[s]}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-row">
          <label className="filter-name" htmlFor="filter-q">
            {ui.gallery.find}
          </label>
          <div className="filter-find">
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4.5 4.5" />
            </svg>
            <input
              id="filter-q"
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape" && q) {
                  e.stopPropagation();
                  setQ("");
                }
              }}
              placeholder={ui.gallery.searchPlaceholder}
              aria-describedby="filter-count"
            />
            {q && (
              <button type="button" className="filter-x" onClick={() => setQ("")} aria-label={ui.gallery.clear}>
                ×
              </button>
            )}
          </div>
          <span className="filter-count" id="filter-count" aria-live="polite">
            {ui.gallery.count(list.length, useCases.length)}
          </span>
          {(q || kind !== "all" || status !== "all") && (
            <button
              type="button"
              className="filter-reset"
              onClick={() => {
                setQ("");
                setKind("all");
                setStatus("all");
              }}
            >
              {ui.gallery.clearAll}
            </button>
          )}
        </div>
      </div>
      <p className="status-help">
        {STATUSES.map((s) => (
          <span key={s}>
            <Badge status={s} /> {ui.statusHelp[s]}
          </span>
        ))}
      </p>
      {list.length ? (
        <ul className="cards">
          {list.map((m) => (
            <Card key={m.slug} m={m} visited={visited.includes(m.slug)} />
          ))}
        </ul>
      ) : (
        <p className="none">{ui.gallery.none}</p>
      )}
    </section>
  );
}

export function Home({ visited }: { visited: string[] }) {
  const { ui } = useI18n();
  return (
    <div className="wrap">
      <header className="hero top">
        <p className="entry">
          <dfn className="headword" lang="el">
            {ui.entry.headword}
          </dfn>{" "}
          <span className="pron">{ui.entry.pron}</span> <span className="pos">{ui.entry.pos}</span>{" "}
          <span className="def">
            {ui.entry.def}
            <em>{ui.entry.defEm}</em>.
          </span>
        </p>
        <h1 className="name">syrmos</h1>
        <p className="lede">
          {ui.hero.title.split(/(?<=\.)\s+/).map((part, i) => (
            <span key={i} className="lede-line">
              {part}
            </span>
          ))}
        </p>
        <p className="audience">{ui.hero.audience}</p>
        <p className="meta">{ui.hero.lede}</p>
        <div className="cta">
          <a className="btn primary" href={href.gallery()}>
            {ui.hero.explore}
          </a>
          {/* greyed, going nowhere, until the repository is public (OutLink's PUBLIC) */}
          <OutLink className="btn" href={README} tag={false} label={ui.nav.getStarted}>
            {ui.nav.getStarted}
          </OutLink>
          <OutLink className="btn gh" href={REPO} tag={false} label="GitHub: pomentum/syrmos">
            <GitHubMark />
            {ui.nav.github}
          </OutLink>
        </div>
        <p className="eyebrow line">{ui.hero.eyebrow}</p>
        <p className="meta">{ui.hero.early}</p>
      </header>
      <figure className="overview">
        <StageScroll>
          <Diagram def={overview} step={0} label={ui.overview.caption} />
        </StageScroll>
        <div className="overview-foot">
          <Legend />
          <ViewSwitch />
        </div>
        <figcaption>{ui.overview.caption}</figcaption>
      </figure>
      <Gallery visited={visited} />
    </div>
  );
}
