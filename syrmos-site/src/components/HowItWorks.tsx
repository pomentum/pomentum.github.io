import { ideas, otherParts, useCases } from "../../content";
import { prose } from "./Terms";
import { overview } from "../../content/diagrams/overview";
import type { PartId } from "../../content/types";
import { useI18n } from "../i18n";
import { href } from "../router";
import { Diagram } from "./Diagram";
import { StageScroll } from "./StageScroll";
import { Legend } from "./Legend";
import { ViewSwitch } from "./ViewSwitch";

function SeeIn({ slugs }: { slugs: readonly string[] }) {
  const i18n = useI18n();
  const known = slugs.filter((s) => useCases.some((m) => m.slug === s));
  if (!known.length) return null;
  return (
    <p className="see-in">
      <span>{i18n.ui.how.seeIn}</span>
      {known.map((s) => (
        <a key={s} href={href.step(s, 1)}>
          {i18n.text(s)?.t.title}
        </a>
      ))}
    </p>
  );
}

/** The use cases that name a part in "What Syrmos does here". */
const usedBy = (p: PartId) => useCases.filter((m) => m.parts.includes(p)).map((m) => m.slug);

export function HowItWorks() {
  const i18n = useI18n();
  const { ui, parts } = i18n;
  return (
    <div className="wrap how">
      <header className="how-head">
        <h1 className="page-title">{ui.how.title}</h1>
        <p className="how-lede">{ui.how.lede}</p>
      </header>
      <figure className="overview">
        <StageScroll>
          <Diagram def={overview} step={0} label={ui.overview.caption} />
        </StageScroll>
        <div className="overview-foot">
          <Legend />
          <ViewSwitch />
        </div>
        <figcaption className="lines">{ui.overview.caption}</figcaption>
      </figure>
      <h2 className="section-title">{ui.how.five}</h2>
      <ol className="ideas">
        {ideas.map((idea, n) => (
          <li key={idea.part} id={`part-${idea.part}`} tabIndex={-1}>
            <span className="idea-n">0{n + 1}</span>
            <h3>{parts[idea.part].name}</h3>
            <p className="idea-line">{parts[idea.part].line}</p>
            <p>{parts[idea.part].body}</p>
            <SeeIn slugs={idea.best} />
          </li>
        ))}
      </ol>
      <h2 className="section-title">{ui.how.more}</h2>
      <ul className="parts">
        {otherParts.map((p) => (
          <li key={p} id={`part-${p}`} tabIndex={-1}>
            <h3>{parts[p].name}</h3>
            <p className="idea-line">{parts[p].line}</p>
            <p>{parts[p].body}</p>
            <SeeIn slugs={usedBy(p)} />
          </li>
        ))}
      </ul>
      <h2 className="section-title" id="part-words" tabIndex={-1}>
        {ui.how.words.title}
      </h2>
      <dl className="faq words">
        {ui.how.words.items.map((x) => (
          <div key={x.k}>
            <dt>{x.k}</dt>
            <dd>{x.v}</dd>
          </div>
        ))}
      </dl>
      <h2 className="section-title">{ui.how.faq}</h2>
      <dl className="faq">
        {ui.faq.map((f) => (
          <div key={f.q}>
            <dt>{f.q}</dt>
            <dd>{prose(f.a, new Set(["cell", "tenant", "governed", "protected-cell", "promotion"]))}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
