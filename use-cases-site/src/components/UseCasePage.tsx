import { useCallback, useEffect, useMemo, useState } from "react";
import { useCases } from "../../content";
import { useI18n } from "../i18n";
import { href, replaceHash } from "../router";
import { Diagram } from "./Diagram";
import { StageScroll } from "./StageScroll";
import { Legend } from "./Legend";
import { Badge } from "./Badge";
import { Card } from "./Home";
import { ViewSwitch } from "./ViewSwitch";
import { prose } from "./Terms";
import { OutLink } from "./OutLink";
import { shots } from "../../content/en/ui";

const typing = (el: EventTarget | null) => el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

export function UseCasePage({ slug, step }: { slug: string; step: number }) {
  const i18n = useI18n();
  const { ui } = i18n;
  const meta = useCases.find((m) => m.slug === slug);
  const words = i18n.text(slug);
  const [paused, setPaused] = useState(false);
  const [replay, setReplay] = useState(0);

  const total = words?.t.steps.length ?? 0;
  const i = Math.min(Math.max(step, 1), Math.max(total, 1)) - 1;

  const go = useCallback((n: number) => {
    if (n < 1 || n > total) return;
    setPaused(false);
    replaceHash(href.step(slug, n));
  }, [slug, total]);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || typing(e.target) || document.querySelector(".overlay")) return;
      if (e.key === "ArrowRight") go(i + 2);
      else if (e.key === "ArrowLeft") go(i);
      else if (e.key === "r" || e.key === "R") {
        setReplay((r) => r + 1);
        setPaused(false);
      } else if (e.key === " " && !(e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement)) {
        e.preventDefault();
        setPaused((p) => !p);
      } else return;
    };
    addEventListener("keydown", on);
    return () => removeEventListener("keydown", on);
  }, [go, i]);

  // Each metric's value at this step: the last value a step up to here gave it.
  const values = useMemo(() => {
    const out: Record<string, string> = {};
    words?.t.steps.slice(0, i + 1).forEach((s) => Object.assign(out, s.metrics ?? {}));
    return out;
  }, [words, i]);

  if (!meta || !words) {
    return (
      <div className="wrap narrow">
        <h1 className="page-title">{ui.page.notFound}</h1>
        <p>
          <a href={href.gallery()}>{ui.page.done}</a>
        </p>
      </div>
    );
  }
  const t = words.t;
  const s = t.steps[i];
  const next = t.steps[i + 1];
  const seen = new Set<string>();
  const related = meta.related.map((r) => useCases.find((m) => m.slug === r)).filter((m): m is NonNullable<typeof m> => !!m);

  return (
    <div className="wrap case">
      <nav className="crumbs" aria-label="Breadcrumb">
        <a href={href.gallery()}>{ui.page.crumbs}</a>
        <span aria-hidden="true">/</span>
        <span>{ui.kinds[meta.kind]}</span>
      </nav>
      <header className="case-head">
        <h1 className="page-title">{t.title}</h1>
        <p className="case-situation">{t.situation}</p>
        <div className="pills">
          <span className="tag">{t.team}</span>
          <span className="tag">{ui.gallery.steps(total)}</span>
          <Badge status={meta.status} />
        </div>
        {t.caveat && <p className="caveat">{t.caveat}</p>}
        <p className="one-page">
          <a href={`syrmos/${slug}/`}>{ui.page.onePage} →</a>
        </p>
        <details className="why">
          <summary>{ui.page.whyStatus}</summary>
          <p>{t.statusNote}</p>
          <p className="muted">{ui.statusHelp[meta.status]}</p>
        </details>
      </header>

      <section className="context" aria-labelledby="ctx">
        <h2 id="ctx" className="eyebrow">{ui.page.situation}</h2>
        <p>
          {prose(t.context, seen)}
        </p>
      </section>

      <div className="case-grid">
        <div className="case-main">
          <ul className="metrics" aria-label="Metrics">
            {meta.metrics.map((k) => (
              <li key={k} className="metric">
                <span className="m-label">{t.metricLabels[k] ?? k}</span>
                <span className="m-value" key={values[k] ?? "—"}>
                  {values[k] ?? "—"}
                </span>
              </li>
            ))}
          </ul>
          <div className="stage">
            <StageScroll>
              <Diagram def={meta.diagram} step={i} paused={paused} replay={replay} label={ui.page.diagramLabel(t.title, `${ui.page.step(i + 1, total)}: ${s.title}`)} describedBy="story-text" />
            </StageScroll>
            <p className="scroll-hint">{ui.page.scrollHint}</p>
          </div>
          <div className="stage-foot">
            <Legend />
            <div className="controls">
              <ViewSwitch />
              <button type="button" className="btn small" onClick={() => { setReplay((r) => r + 1); setPaused(false); }}>
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4.5h4.5" />
                </svg>
                {ui.page.replay}
              </button>
              <button type="button" className="btn small" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
                {paused ? (
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor"><path d="M7 5l12 7-12 7z" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
                )}
                {paused ? ui.page.play : ui.page.pause}
              </button>
            </div>
          </div>
          <nav className="timeline" aria-label={ui.page.timeline}>
            <ol>
              {t.steps.map((st, n) => (
                <li key={n} className={`${n === i ? "now" : ""} ${n < i ? "past" : ""} tag-${st.tag}`}>
                  <a href={href.step(slug, n + 1)} aria-current={n === i ? "step" : undefined} onClick={(e) => { e.preventDefault(); go(n + 1); }} title={st.title}>
                    <span className="num">{n + 1}</span>
                    <span className="tl-title">{st.title}</span>
                  </a>
                </li>
              ))}
            </ol>
            <p className="tl-now" aria-hidden="true">{s.title}</p>
          </nav>
          {meta.shot && (
            <figure className="shot">
              <figcaption>
                <span className="eyebrow">{ui.page.seeIt}</span>
                <span>{shots[meta.shot].caption}</span>
              </figcaption>
              <img src={`ui/${meta.shot}.webp`} alt={shots[meta.shot].alt} width={shots[meta.shot].w} height={shots[meta.shot].h} loading="lazy" decoding="async" />
            </figure>
          )}
        </div>

        <aside className="case-side">
          <section className="story" aria-live="polite">
            <p className="story-top">
              <span className="step-count">{ui.page.step(i + 1, total)}</span>
              <span className={`tag step-tag tag-${s.tag}`}>{ui.tags[s.tag]}</span>
            </p>
            <h2 className="story-title">{s.title}</h2>
            <div id="story-text">
              {s.body.map((p, n) => (
                <p key={n}>
                  {prose(p, seen)}
                </p>
              ))}
            </div>
            <div className="story-nav">
              <button type="button" className="btn" onClick={() => go(i)} disabled={i === 0}>
                ← {ui.page.back}
              </button>
              {next ? (
                <button type="button" className="btn primary" onClick={() => go(i + 2)}>
                  {ui.page.next(next.title)} →
                </button>
              ) : (
                <a className="btn primary" href={href.gallery()}>
                  {ui.page.done}
                </a>
              )}
            </div>
            <p className="kbd-hint">{ui.page.hint}</p>
          </section>
          <section className="does" aria-labelledby="does-title">
            <h2 id="does-title" className="eyebrow">{ui.page.does}</h2>
            <ul>
              {meta.parts.map((p) => (
                <li key={p}>
                  <a className="part-name" href={href.how(p)}>
                    {i18n.parts[p].name}
                  </a>
                  <span>{t.parts[p] ?? i18n.parts[p].line}</span>
                </li>
              ))}
            </ul>
            <a className="more" href={href.how()}>
              {ui.page.howLink} →
            </a>
          </section>
        </aside>
      </div>

      <section className="try" aria-labelledby="try-title">
        <h2 id="try-title" className="eyebrow">{ui.page.tryIt}</h2>
        <p>{t.tryIt.text}</p>
        {t.tryIt.href && (
          <OutLink className="btn primary" href={t.tryIt.href}>
            {t.tryIt.linkText ?? ui.page.tryIt}
          </OutLink>
        )}
      </section>

      {import.meta.env.DEV && t.verify && t.verify.length > 0 && (
        <section className="verify" aria-labelledby="verify-title">
          <h2 id="verify-title" className="eyebrow">{ui.page.verify}</h2>
          <ul>
            {t.verify.map((v, n) => (
              <li key={n}>{v}</li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="related" aria-labelledby="rel-title">
          <h2 id="rel-title" className="eyebrow">{ui.page.related}</h2>
          <ul className="cards three">
            {related.map((m) => (
              <Card key={m.slug} m={m} visited={false} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
