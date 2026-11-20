import { useMemo, useState } from "react";
import { useCases } from "../../content";
import { overview } from "../../content/diagrams/overview";
import type { Status, UseCaseMeta } from "../../content/types";
import { useI18n } from "../i18n";
import { href } from "../router";
import { Diagram } from "./Diagram";
import { StageScroll } from "./StageScroll";
import { Legend } from "./Legend";
import { ViewSwitch } from "./ViewSwitch";
import { Badge } from "./Badge";
import { GitHubMark, README, REPO } from "./TopBar";
import { OutLink } from "./OutLink";
import { prose } from "./Terms";
import { ICONS } from "./Icons";
import { slugOf, tour, problemWords } from "../../content/en/problems";
import { statusesOf } from "../../content/walkthroughs";
import type { IconName } from "../../content/types";

const STATUSES: Status[] = ["shown", "target", "dev"];

export function Card({ m, visited }: { m: UseCaseMeta; visited: boolean }) {
  const i18n = useI18n();
  const { ui } = i18n;
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
            {m.slug === tour.slug && <span className="tag kind">{ui.first.start.eyebrow}</span>}
            {statusesOf(m, t).map((st) => (
              <Badge key={st} status={st} />
            ))}
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
  const [status, setStatus] = useState<Status | "all">("all");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return useCases.filter((m) => {
      if (status !== "all" && !statusesOf(m, i18n.text(m.slug)?.t).includes(status)) return false;
      if (!words.length) return true;
      const t = i18n.text(m.slug)?.t;
      const hay = t ? [t.title, t.situation, t.team, ...t.steps.map((s) => s.title)].join(" ").toLowerCase() : "";
      return words.every((w) => hay.includes(w));
    });
  }, [status, q, i18n]);

  return (
    <section className="gallery" id="gallery" aria-labelledby="gallery-title">
      <div className="section-head">
        <h2 id="gallery-title">{ui.gallery.title}</h2>
        <p>{ui.gallery.lede}</p>
      </div>
      <div className="filters">
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
          {(q || status !== "all") && (
            <button
              type="button"
              className="filter-reset"
              onClick={() => {
                setQ("");
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

/** An icon of the diagrams' set, on its own: a 24-unit glyph in a box. */
function Glyph({ name }: { name: IconName }) {
  return (
    <svg className="reason-icon" viewBox="0 0 24 24" aria-hidden="true">
      {ICONS[name].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

export function Home(_props: { visited: string[] }) {
  const i18n = useI18n();
  const { ui } = i18n;
  // the first use on the page of cell, tenant, pipeline and spur is explained in place, once, in reading order
  const seen = new Set<string>(["governed", "promotion"]);
  const words = (text: string) => prose(text, seen);
  const tourMeta = useCases.find((m) => m.slug === tour.slug);
  const textOf = (slug: string) => i18n.text(slug)?.t;
  return (
    <div className="wrap">
      <header className="hero top first">
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
        <p className="lede">{ui.hero.title}</p>
        <p className="plain-line">{words(ui.hero.plain)}</p>
        <p className="who">{ui.hero.who}</p>
        <p className="not-yet">{ui.hero.notYet}</p>
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
      </header>
      <section className="summary" aria-labelledby="summary-title">
        <h2 id="summary-title">{ui.first.summary.title}</h2>
        <dl>
          {ui.first.summary.rows.map((r) => (
            <div key={r.k}>
              <dt>{r.k}</dt>
              <dd>{words(r.v)}</dd>
            </div>
          ))}
        </dl>
      </section>
      <ul className="reasons promises" aria-label={ui.first.promisesLabel}>
        {ui.first.promises.map((r) => (
          <li key={r.title}>
            <a href={href.step(slugOf(r.problem), 1)}>
              <Glyph name={r.icon} />
              <h2>{r.title}</h2>
              <p>{r.line}</p>
            </a>
          </li>
        ))}
      </ul>
      <section className="ways" aria-label={ui.first.ways.label}>
        <div className="way">
          <h2>{ui.first.ways.forYou.title}</h2>
          <p className="muted">{ui.first.ways.forYou.lede}</p>
          <ul className="questions">
            {ui.first.ways.forYou.questions.map((q) => (
              <li key={q.q}>
                <a href={href.step(slugOf(q.problem), 1)}>{q.q}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="way">
          <h2>{ui.first.ways.forOthers.title}</h2>
          <p className="muted">{ui.first.ways.forOthers.lede}</p>
          <p className="way-cta">
            <a className="btn primary" href={href.step(tour.slug, 1)}>
              {ui.first.ways.forOthers.tour} →
            </a>
            <a className="btn" href={href.how()}>
              {ui.first.ways.forOthers.how}
            </a>
          </p>
        </div>
      </section>
      <section className="featured" id="start" tabIndex={-1} aria-labelledby="start-title">
        <div className="section-head stacked">
          <p className="eyebrow">{ui.first.start.eyebrow}</p>
          <h2 id="start-title">{ui.first.start.title}</h2>
          <p>{words(ui.first.start.lede)}</p>
        </div>
        {tourMeta && (
          <a className="tour" href={href.step(tour.slug, 1)}>
            <div className="thumb">
              <Diagram def={tourMeta.diagram} step={tourMeta.thumb} still />
            </div>
            <div className="tour-body">
              <h3>{tour.title}</h3>
              <p>{tour.line}</p>
              <p className="card-foot">
                <Badge status={tourMeta.status} />
              </p>
            </div>
          </a>
        )}
        <ol className="problem-cards">
          {useCases
            .filter((m) => m.slug !== tour.slug)
            .map((m, i) => {
              const w = textOf(m.slug);
              return w ? (
                <li key={m.slug}>
                  <a href={href.step(m.slug, 1)}>
                    <span className="problem-n">{i + 1}</span>
                    <h3>{w.title}</h3>
                    <p>{w.situation}</p>
                    <p className="card-foot">
                      <span>{problemWords.count(w.steps.length)}</span>
                      {statusesOf(m, w).map((st) => (
                        <Badge key={st} status={st} />
                      ))}
                    </p>
                  </a>
                </li>
              ) : null;
            })}
        </ol>
        <p className="see-all">
          <a className="btn" href={href.gallery()}>
            {ui.first.start.all} →
          </a>
        </p>
      </section>
      <details className="system">
        <summary>
          <span>{ui.first.system.summary}</span>
          <small>{ui.first.system.hint}</small>
        </summary>
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
      </details>
    </div>
  );
}

/** Every use case, with its filters: #/use-cases. */
export function AllUseCases({ visited }: { visited: string[] }) {
  return (
    <div className="wrap">
      <Gallery visited={visited} />
    </div>
  );
}
