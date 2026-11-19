// After `vite build`: a plain HTML page per use case, the list of them, How it works and the overview (the landing page's
// sections: In 30 seconds, At a glance, Benchmarks, the web UI, Get started, the documentation), so that search engines and AI tools,
// which mostly read a page without running its JavaScript, find every use case at an address of its own. Each page is written
// from the same content files as the animated walkthrough, and links to it. Also writes sitemap.xml and llms.txt (the pages
// workflow moves both to the site's root) and lists the pages in the app's <noscript>.
//   node scripts/prerender.mjs        (npm run build runs it)
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const OUT = join(ROOT, "..", "graphos");
const SITE = "https://www.pomentum.dev";
const BASE = `${SITE}/graphos`;
const REPO = "https://github.com/pomentum/graphos";
const REPO_PUBLIC = true; // graphos is public

// the content, loaded as the app loads it
const vite = await createServer({ root: ROOT, logLevel: "error", server: { middlewareMode: true }, appType: "custom" });
const { useCases, textEn, ideas, otherParts } = await vite.ssrLoadModule("/content/index.ts");
const { ui, partText, shots } = await vite.ssrLoadModule("/content/en/ui.ts");
const more = await vite.ssrLoadModule("/content/en/more.ts");
const { VERSION } = await vite.ssrLoadModule("/content/version.ts");
// graphos's latest release, as the app reads it in the browser (src/latest.ts); these plain pages take it at each build, and
// the release the page was built with when GitHub does not answer
const LATEST = await fetch("https://api.github.com/repos/pomentum/graphos/releases/latest", { headers: { Accept: "application/vnd.github+json" } })
  .then((r) => (r.ok ? r.json() : null))
  .then((j) => /^v?(\d+\.\d+\.\d+(?:[-+][\w.-]+)?)$/.exec(j?.tag_name ?? "")?.[1] ?? VERSION)
  .catch(() => VERSION);
await vite.close();

const css = readdirSync(join(OUT, "static")).find((f) => f.endsWith(".css"));
const today = new Date().toISOString().slice(0, 10);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const held = (href) => !REPO_PUBLIC && href.startsWith(REPO);
/** The app's own address #/how/faq-licence, as a plain page's: how/#faq-licence; `up` leads to /graphos/. */
const local = (hash, up) => {
  const m = /^#\/how\/(faq[\w-]*)$/.exec(hash);
  return m ? `${up}how/#${m[1]}` : `${up}${hash}`;
};
/** The words as the app shows them: `code`, [words](https://...) as a link, and [words](#/...) as a link to a page here. */
function prose(text, up = "") {
  return String(text)
    .split("`")
    .map((part, i) =>
      i % 2
        ? `<code>${esc(part)}</code>`
        : esc(part)
            .replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, (_, t, u) => `<a href="${u}" rel="noopener">${t}</a>`)
            .replace(/\[([^\]]+)\]\((#\/[^)\s]+)\)/g, (_, t, u) => `<a href="${local(u, up)}">${t}</a>`),
    )
    .join("");
}
const pageUrl = (slug) => `${BASE}/use-cases/${slug}/`;
const write = (rel, html) => {
  const file = join(OUT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
};

function page({ title, description, canonical, up, body, ld, image }) {
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="dark light">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
${image ? `<meta property="og:image" content="${image}">\n` : ""}<link rel="icon" href="${up}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500&display=swap">
<link rel="stylesheet" href="${up}static/${css}">
<style>
.static { padding-top: 28px; padding-bottom: 8px; max-width: 920px; }
.static h2.eyebrow { margin: 34px 0 12px; }
.static .cta { margin: 18px 0 0; }
.static-steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.static-steps li { border: 1px solid var(--line); border-radius: 4px; background: var(--panel); padding: 16px 18px; }
.static-steps h3 { margin: 0 0 8px; font-size: 18px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.static-steps p { margin: 0 0 8px; }
.static-steps .m { font-size: 13.5px; color: var(--mute); margin: 6px 0 0; }
.static-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.static-list li { border: 1px solid var(--line); border-radius: 4px; background: var(--panel); padding: 14px 16px; }
.static-list h3 { margin: 0 0 4px; font-size: 18px; }
.static-list p { margin: 4px 0 0; }
.static dl { margin: 0; display: grid; gap: 10px; }
.static dt { font-weight: 600; }
.static dd { margin: 0; color: var(--mute); }
.static table { width: 100%; border-collapse: collapse; margin: 0 0 18px; font-size: 14.5px; }
.static caption { caption-side: top; text-align: left; color: var(--mute); padding: 0 0 8px; }
.static th, .static td { text-align: left; vertical-align: top; padding: 8px 10px; border-top: 1px solid var(--line); }
.static td.n { text-align: right; white-space: nowrap; }
.static small { display: block; color: var(--mute); font-weight: 400; }
.static pre { overflow-x: auto; padding: 14px 16px; border: 1px solid var(--line); border-radius: 4px; background: var(--panel); font-size: 13px; }
.static pre code { border: 0; padding: 0; background: none; }
.static figure { margin: 0 0 18px; }
.static figure img { width: 100%; height: auto; border: 1px solid var(--line); border-radius: 4px; }
.static code { font-size: 0.86em; padding: 1px 5px; border: 1px solid var(--line); border-radius: 2px; background: var(--bg); }
</style>
<script>try{var t=localStorage.getItem('graphos-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}</script>
${ld ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n` : ""}</head>
<body>
<header class="bar"><div class="bar-inner">
<span class="bar-brand"><a class="bar-home" href="/">Pomentum</a><span class="bar-sep" aria-hidden="true">/</span><a class="bar-name" href="${up}">graphos</a></span>
<nav class="bar-links" aria-label="Site"><a href="${up}overview/">Overview</a><a href="${up}use-cases/">${esc(ui.nav.useCases)}</a><a href="${up}how/">${esc(ui.nav.how)}</a></nav>
</div></header>
<main class="wrap static">
${body}
</main>
<footer class="foot"><div class="wrap"><div>
<p class="cols"><a href="${SITE}/">${esc(ui.footer.pomentum)}</a></p>
<p>${esc(ui.footer.note)}</p>
</div></div></footer>
</body>
</html>
`;
}

const badge = (status) => `<span class="badge st-${status}">${esc(ui.status[status])}</span>`;
const publisher = { "@type": "Organization", name: "Pomentum", url: `${SITE}/` };
const about = { "@type": "SoftwareApplication", name: "graphos", applicationCategory: "DeveloperApplication", softwareVersion: LATEST, license: "https://www.apache.org/licenses/LICENSE-2.0", codeRepository: REPO };

// one page per use case
for (const m of useCases) {
  const t = textEn[m.slug];
  const up = "../../";
  const steps = t.steps
    .map((s, i) => {
      const metrics = Object.entries(s.metrics ?? {})
        .map(([k, v]) => `${esc(t.metricLabels[k] ?? k)}: ${esc(v)}`)
        .join(" · ");
      return `<li>
<h3><span class="tag step-tag tag-${s.tag}">${esc(ui.tags[s.tag])}</span> ${i + 1}. ${esc(s.title)}</h3>
${s.body.map((p) => `<p>${prose(p)}</p>`).join("\n")}${metrics ? `\n<p class="m">${metrics}</p>` : ""}
</li>`;
    })
    .join("\n");
  const parts = m.parts.map((p) => `<dt>${esc(partText[p].name)}</dt><dd>${prose(t.parts[p] ?? partText[p].line)}</dd>`).join("\n");
  const shot = m.shot ? shots[m.shot] : null;
  const tryLink = t.tryIt.href
    ? held(t.tryIt.href)
      ? `<p class="muted">${esc(ui.guidesLater)}</p>`
      : `<p><a class="btn primary" href="${t.tryIt.href}" rel="noopener">${esc(t.tryIt.linkText ?? ui.page.tryIt)}</a></p>`
    : "";
  const related = m.related
    .map((r) => useCases.find((u) => u.slug === r))
    .filter(Boolean)
    .map((r) => `<li><a href="../${r.slug}/">${esc(textEn[r.slug].title)}</a> · ${esc(textEn[r.slug].situation)}</li>`)
    .join("\n");
  const body = `<nav class="crumbs" aria-label="Breadcrumb"><a href="../">${esc(ui.page.crumbs)}</a> <span aria-hidden="true">/</span> <span>${esc(ui.kinds[m.kind])}</span></nav>
<h1 class="page-title">${esc(t.title)}</h1>
<p class="case-situation">${esc(t.situation)}</p>
<div class="pills"><span class="tag">${esc(t.team)}</span><span class="tag">${esc(ui.gallery.steps(t.steps.length))}</span>${badge(m.status)}</div>
${t.caveat ? `<p class="caveat">${esc(t.caveat)}</p>\n` : ""}<p class="cta"><a class="btn primary" href="${up}#/use-cases/${m.slug}/1">Step through it, animated →</a></p>
<section class="context"><h2 class="eyebrow">${esc(ui.page.situation)}</h2><p>${prose(t.context)}</p></section>
<h2 class="eyebrow">Step by step</h2>
<ol class="static-steps">
${steps}
</ol>
<h2 class="eyebrow">${esc(ui.page.does)}</h2>
<dl>
${parts}
</dl>
<h2 class="eyebrow">${esc(ui.page.whyStatus)}: ${esc(ui.status[m.status])}</h2>
<p>${prose(t.statusNote)}</p>
<p class="muted">${esc(ui.statusHelp[m.status])}</p>
${shot ? `<figure class="shot"><figcaption><span class="eyebrow">${esc(ui.page.seeIt)}</span><span>${prose(shot.caption, up)}</span></figcaption><img src="${up}ui/${m.shot}.webp" alt="${esc(shot.alt)}" width="${shot.w}" height="${shot.h}" loading="lazy"></figure>\n` : ""}<section class="try"><h2 class="eyebrow">${esc(ui.page.tryIt)}</h2><p>${prose(t.tryIt.text)}</p>${tryLink}</section>
<h2 class="eyebrow">${esc(ui.page.related)}</h2>
<ul>
${related}
</ul>`;
  write(
    `use-cases/${m.slug}/index.html`,
    page({
      title: `${t.title} · graphos use cases`,
      description: t.situation,
      canonical: pageUrl(m.slug),
      up,
      body,
      image: m.shot ? `${BASE}/ui/${m.shot}.webp` : undefined,
      ld: { "@context": "https://schema.org", "@type": "TechArticle", headline: t.title, description: t.situation, url: pageUrl(m.slug), inLanguage: "en", about, publisher },
    }),
  );
}

// the list of them
{
  const kinds = [...new Set(useCases.map((m) => m.kind))];
  const groups = kinds
    .map((k) => {
      const items = useCases
        .filter((m) => m.kind === k)
        .map((m) => `<li><h3><a href="${m.slug}/">${esc(textEn[m.slug].title)}</a> ${badge(m.status)}</h3><p>${esc(textEn[m.slug].situation)}</p></li>`)
        .join("\n");
      return `<h2 class="eyebrow">${esc(ui.kinds[k])}</h2>\n<ul class="static-list">\n${items}\n</ul>`;
    })
    .join("\n");
  const help = Object.keys(ui.status).map((s) => `<dt>${badge(s)}</dt><dd>${esc(ui.statusHelp[s])}</dd>`).join("\n");
  const body = `<h1 class="page-title">graphos use cases</h1>
<p class="case-situation">${esc(ui.hero.title)} ${esc(ui.hero.audience)}</p>
<p>${esc(ui.hero.lede)} ${esc(ui.hero.early)}</p>
<p class="cta"><a class="btn primary" href="../#/use-cases">Explore them, animated →</a></p>
<dl style="margin-top:22px">
${help}
</dl>
${groups}`;
  write(
    `use-cases/index.html`,
    page({
      title: "graphos use cases",
      description: `${ui.hero.title} ${ui.hero.lede}`,
      canonical: `${BASE}/use-cases/`,
      up: "../",
      body,
      ld: { "@context": "https://schema.org", "@type": "CollectionPage", name: "graphos use cases", url: `${BASE}/use-cases/`, inLanguage: "en", about, publisher },
    }),
  );
}

// How it works
{
  const idea = ideas
    .map((d, i) => {
      const p = partText[d.part];
      const see = d.best.map((s) => `<a href="../use-cases/${s}/">${esc(textEn[s].title)}</a>`).join(", ");
      return `<h2 class="eyebrow">${String(i + 1).padStart(2, "0")} · ${esc(p.name)}</h2>\n<p><strong>${esc(p.line)}</strong></p>\n<p>${esc(p.body)}</p>\n<p class="muted">See it in: ${see}</p>`;
    })
    .join("\n");
  const other = otherParts.map((k) => `<dt>${esc(partText[k].name)}</dt><dd>${esc(partText[k].line)} ${esc(partText[k].body)}</dd>`).join("\n");
  const body = `<nav class="crumbs" aria-label="Breadcrumb"><a href="../use-cases/">${esc(ui.page.crumbs)}</a></nav>
<h1 class="page-title">${esc(ui.nav.how)}</h1>
<p class="case-situation">${esc(ui.hero.title)} ${esc(ui.hero.audience)}</p>
<p>${esc(ui.overview.caption)}</p>
<p class="cta"><a class="btn primary" href="../#/how">See the diagram, animated →</a></p>
${idea}
<h2 class="eyebrow">The other parts you meet</h2>
<dl>
${other}
</dl>
<h2 class="eyebrow" id="faq">${esc(ui.how.faq)}</h2>
<dl>
${ui.faq.map((f) => `<dt${f.id ? ` id="${f.id}"` : ""}>${esc(f.q)}</dt><dd>${prose(f.a, "../")}</dd>`).join("\n")}
</dl>`;
  write(
    `how/index.html`,
    page({
      title: "How graphos works · graphos use cases",
      description: partText.api.line,
      canonical: `${BASE}/how/`,
      up: "../",
      body,
      ld: { "@context": "https://schema.org", "@type": "TechArticle", headline: "How graphos works", url: `${BASE}/how/`, inLanguage: "en", about, publisher },
    }),
  );
}

// the overview: the landing page's sections, written out
{
  const up = "../";
  const dl = (rows) => `<dl>\n${rows.map((r) => `<dt>${esc(r.k)}</dt><dd>${prose(r.v, up)}</dd>`).join("\n")}\n</dl>`;
  const th = (r) => `<th scope="row">${esc(r.what)}${r.sub ? `<small>${prose(r.sub, up)}</small>` : ""}</th>`;
  const table = (t) =>
    `<table><caption>${prose(t.caption, up)}</caption>\n<thead><tr>${t.head.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead>\n<tbody>\n${t.rows
      .map((r) => `<tr>${th(r)}${r.cells.map((c) => `<td class="n"${r.span ? ' colspan="2"' : ""}>${esc(c)}</td>`).join("")}</tr>`)
      .join("\n")}\n</tbody></table>`;
  const f = more.bench.factor;
  const factor = `<table><caption>${prose(f.caption, up)}</caption>\n<thead><tr>${[f.head[0], f.head[1], f.head[2], f.head[4]]
    .map((h) => `<th scope="col">${esc(h)}</th>`)
    .join("")}</tr></thead>\n<tbody>\n${f.rows
    .map((r) => `<tr>${th(r)}<td class="n">${esc(r.before)}</td><td class="n">${esc(r.after)}</td><td class="n">${esc(r.x)}</td></tr>`)
    .join("\n")}\n</tbody></table>`;
  const figs = more.uiShots
    .map(
      (k, i) =>
        `<figure><img src="${up}ui/${k}.webp" alt="${esc(shots[k].alt)}" width="${shots[k].w}" height="${shots[k].h}" loading="lazy"><figcaption class="muted">UI 0${i + 1} · ${prose(shots[k].caption, up)}</figcaption></figure>`,
    )
    .join("\n");
  const S = more.sections;
  const body = `<h1 class="page-title">graphos</h1>
<p class="case-situation">${esc(ui.hero.title)}</p>
<p>${esc(ui.hero.audience)}</p>
<p class="cta"><a class="btn primary" href="${up}">See it drawn, with the use cases animated →</a></p>
<h2 class="eyebrow" id="summary">${esc(S.summary)}</h2>
${dl(more.summary)}
<h2 class="eyebrow" id="why">${esc(ui.overview.title)}</h2>
<p>${esc(ui.overview.caption)}</p>
<h2 class="eyebrow" id="glance">${esc(S.glance.num)} · ${esc(S.glance.title)}</h2>
${dl(more.glance.map((r) => (r.k === "Latest" ? { ...r, v: more.latestAt(LATEST) } : r)))}
<h2 class="eyebrow" id="features">${esc(ui.gallery.title)}</h2>
<ul>
${useCases.map((m) => `<li><a href="${up}use-cases/${m.slug}/">${esc(textEn[m.slug].title)}</a> · ${esc(textEn[m.slug].situation)}</li>`).join("\n")}
</ul>
<h2 class="eyebrow" id="benchmarks">${esc(S.bench.num)} · ${esc(S.bench.title)}</h2>
<p>${prose(more.bench.lead, up)}</p>
${table(more.bench.reads)}
${table(more.bench.writes)}
<h3>${esc(f.summary)}</h3>
${factor}
<p class="muted">${prose(f.note, up)}</p>
<h2 class="eyebrow" id="ui">${esc(S.ui.num)} · ${esc(S.ui.title)}</h2>
${figs}
<h2 class="eyebrow" id="start">${esc(S.start.num)} · ${esc(S.start.title)}</h2>
<p>${prose(more.start.lead, up)}</p>
<pre><code>${esc(more.start.commands)}</code></pre>
<ol>
${more.start.next.map((n) => `<li>${prose(n, up)}</li>`).join("\n")}
</ol>
<h2 class="eyebrow" id="faq">${esc(ui.how.faq)}</h2>
<p><a href="${up}how/#faq">${esc(ui.how.faq)}, on How graphos works</a></p>
<h2 class="eyebrow" id="docs">${esc(S.docs.num)} · ${esc(S.docs.title)}</h2>
<dl>
${more.docs.map((d) => `<dt><a href="${d.href}" rel="noopener">${esc(d.name)}</a></dt><dd>${prose(d.what, up)}</dd>`).join("\n")}
</dl>`;
  write(
    `overview/index.html`,
    page({
      title: "graphos · a multi-tenant property-graph service on PostgreSQL",
      description: `${ui.hero.title} ${ui.hero.audience}`,
      canonical: `${BASE}/overview/`,
      up,
      body,
      image: `${BASE}/ui/explore-graph.webp`,
      ld: { "@context": "https://schema.org", "@type": "TechArticle", headline: "graphos", description: ui.hero.title, url: `${BASE}/overview/`, inLanguage: "en", about, publisher },
    }),
  );
}

// sitemap.xml and llms.txt, moved to the site's root by the pages workflow
{
  const urls = [`${SITE}/`, `${BASE}/`, `${BASE}/overview/`, `${BASE}/use-cases/`, `${BASE}/how/`, ...useCases.map((m) => pageUrl(m.slug))];
  write(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`,
  );
  const line = (m) => `- [${textEn[m.slug].title}](${pageUrl(m.slug)}): ${textEn[m.slug].situation} Status: ${ui.status[m.status]}.`;
  write(
    "llms.txt",
    `# graphos

> ${ui.hero.title} ${ui.hero.audience}

graphos is open source under the Apache License 2.0, at version ${LATEST}. Each use case below is written out step by step on a
page of its own, with its status (${Object.keys(ui.status).map((s) => `${ui.status[s]}: ${ui.statusHelp[s]}`).join(" ")}) and
what that status rests on.

## graphos use cases

${useCases.map(line).join("\n")}

## graphos, the whole picture

- [graphos](${BASE}/): what graphos is, drawn, and its use cases, animated step by step.
- [graphos, written out](${BASE}/overview/): in 30 seconds, at a glance, benchmarks, the web UI, getting started and the documentation.
- [How graphos works](${BASE}/how/): the ideas every use case rests on, and the questions people ask first.
- [All graphos use cases](${BASE}/use-cases/): the list, by kind and status.
- [Source](${REPO}): the repository, its guides and its changelog.
`,
  );
}

// the app's <noscript>: every page, for a reader or a crawler without JavaScript
{
  const file = join(OUT, "index.html");
  const html = readFileSync(file, "utf8");
  const list = useCases.map((m) => `<li><a href="use-cases/${m.slug}/">${esc(textEn[m.slug].title)}</a></li>`).join("");
  const noscript = `<noscript><div style="padding:24px;font-family:system-ui;max-width:760px"><p>The animated use cases need JavaScript. Each is also written out on a page of its own:</p><ul>${list}</ul><p><a href="overview/">graphos, written out</a> · <a href="use-cases/">All graphos use cases</a> · <a href="how/">How graphos works</a></p></div></noscript>`;
  const next = html.replace(/<noscript>[\s\S]*?<\/noscript>/, noscript);
  if (next === html) throw new Error("prerender: no <noscript> in the built index.html");
  writeFileSync(file, next);
}

console.log(`prerender: ${useCases.length} use cases, the list, How it works and the overview; sitemap.xml and llms.txt; graphos ${LATEST}`);
