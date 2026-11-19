import { useState, type ReactNode } from "react";
import { glossary, shots } from "../../content/en/ui";
import { bench, docs, glance, latestAt, sections, start, summary, uiShots } from "../../content/en/more";
import { useLatestVersion } from "../latest";
import { href } from "../router";
import { prose } from "./Terms";

// The rest of the graphos page, on the landing page: In 30 seconds under the name, At a glance before the use cases, and after
// them Benchmarks, the web UI, Get started and the documentation. The FAQ is on How it works. The words are in content/en/more.ts.

/** Prose with `code` and links, without the glossary's explanations: these sections are reference, not a walkthrough. */
const plain = (text: string): ReactNode[] => prose(text, new Set(glossary.map((g) => g.id)));

function Head({ id, num, title }: { id: string; num: string; title: string }) {
  return (
    <div className="section-head more-head">
      <p className="eyebrow">{num}</p>
      <h2 id={`${id}-title`}>{title}</h2>
    </div>
  );
}

export function Summary() {
  return (
    <section className="summary" id="summary" tabIndex={-1} aria-labelledby="summary-title">
      <h2 id="summary-title">{sections.summary}</h2>
      <dl>
        {summary.map((r) => (
          <div key={r.k}>
            <dt>{r.k}</dt>
            <dd>{plain(r.v)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Glance() {
  const version = useLatestVersion();
  return (
    <section id="glance" tabIndex={-1} aria-labelledby="glance-title">
      <Head id="glance" {...sections.glance} />
      <dl className="glance">
        {glance.map((r) => (
          <div key={r.k}>
            <dt>{r.k}</dt>
            <dd>{plain(r.k === "Latest" ? latestAt(version) : r.v)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function What({ what, sub }: { what: string; sub?: string }) {
  return (
    <th scope="row">
      {what}
      {sub && <small>{plain(sub)}</small>}
    </th>
  );
}

/** A factor on a log scale, 1 to 5,000; a range draws its low end solid and its high end lighter. */
const at = (x: number) => `${Math.min(100, (Math.log10(x) / Math.log10(5000)) * 100).toFixed(1)}%`;

function Benchmarks() {
  const f = bench.factor;
  return (
    <section id="benchmarks" tabIndex={-1} aria-labelledby="benchmarks-title">
      <Head id="benchmarks" {...sections.bench} />
      <p className="more-lead">{plain(bench.lead)}</p>
      {[bench.reads, bench.writes].map((t) => (
        <div className="tbl" key={t.caption}>
          <table className="bench">
            <caption>{t.caption}</caption>
            <thead>
              <tr>
                {t.head.map((h, i) => (
                  <th key={h} scope="col" className={i ? "n" : undefined}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.rows.map((r) => (
                <tr key={r.what}>
                  <What what={r.what} sub={r.sub} />
                  {r.cells.map((c) => (
                    <td key={c} className="n after" colSpan={r.span ? 2 : undefined}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <details className="more-details">
        <summary>{f.summary}</summary>
        <div className="tbl">
          <table className="bench factor">
            <caption>{plain(f.caption)}</caption>
            <thead>
              <tr>
                {f.head.map((h, i) => (
                  <th key={h} scope="col" className={i === 3 ? "bar-cell" : i ? "n" : undefined}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {f.rows.map((r) => (
                <tr key={r.what}>
                  <What what={r.what} sub={r.sub} />
                  <td className="n">{r.before}</td>
                  <td className="n after">{r.after}</td>
                  <td className="bar-cell">
                    <div className="meter" role="img" aria-label={r.label}>
                      {r.hi && <b style={{ width: at(r.hi) }} />}
                      <s style={{ width: at(r.lo) }} />
                    </div>
                  </td>
                  <td className="n">{r.x}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="more-note">{plain(f.note)}</p>
      </details>
    </section>
  );
}

function WebUi() {
  return (
    <section id="ui" tabIndex={-1} aria-labelledby="ui-title">
      <Head id="ui" {...sections.ui} />
      <div className="shots">
        {uiShots.map((k, i) => (
          <figure className="shot" key={k}>
            <a href={`ui/${k}.webp`} title="Open full size">
              <img src={`ui/${k}.webp`} alt={shots[k].alt} width={shots[k].w} height={shots[k].h} loading="lazy" decoding="async" />
            </a>
            <figcaption>
              <span className="eyebrow">UI 0{i + 1}</span>
              <span>{plain(shots[k].caption)}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Start() {
  const [copied, setCopied] = useState(false);
  return (
    <section id="start" tabIndex={-1} aria-labelledby="start-title">
      <Head id="start" {...sections.start} />
      <p className="more-lead">{plain(start.lead)}</p>
      <div className="record-wrap">
        <pre className="record">
          <code>{start.commands}</code>
        </pre>
        <button
          type="button"
          className="btn small copy"
          onClick={() => {
            navigator.clipboard?.writeText(start.commands).then(
              () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              },
              () => undefined,
            );
          }}
        >
          {copied ? start.copied : start.copy}
        </button>
      </div>
      <ol className="more-next">
        {start.next.map((n) => (
          <li key={n}>{plain(n)}</li>
        ))}
      </ol>
    </section>
  );
}

function Docs() {
  return (
    <section id="docs" tabIndex={-1} aria-labelledby="docs-title">
      <Head id="docs" {...sections.docs} />
      <dl className="glance docs">
        {docs.map((d) => (
          <div key={d.href}>
            <dt>
              <a href={d.href} rel="noopener">
                {d.name}
              </a>
            </dt>
            <dd>{plain(d.what)}</dd>
          </div>
        ))}
      </dl>
      <p className="more-faq">
        <a href={href.how("faq")}>{sections.faq} →</a>
      </p>
    </section>
  );
}

function Rest() {
  return (
    <>
      <Benchmarks />
      <WebUi />
      <Start />
      <Docs />
    </>
  );
}

export const More = { Glance, Rest };
