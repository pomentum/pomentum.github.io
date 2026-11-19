// After `vite build`: a plain HTML page per use case, the list of them and How it works, so that search engines and AI tools,
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
const OUT = join(ROOT, "..", "use-cases");
const SITE = "https://www.pomentum.dev";
const BASE = `${SITE}/use-cases`;
const PROJECT = "syrmos";
const REPO = "https://github.com/pomentum/syrmos";
const REPO_PUBLIC = false; // as PUBLIC in src/components/OutLink.tsx

// the content, loaded as the app loads it
const vite = await createServer({ root: ROOT, logLevel: "error", server: { middlewareMode: true }, appType: "custom" });
const { useCases, textEn, ideas, otherParts } = await vite.ssrLoadModule("/content/index.ts");
const { ui, partText, shots } = await vite.ssrLoadModule("/content/en/ui.ts");
await vite.close();

const css = readdirSync(join(OUT, "static")).find((f) => f.endsWith(".css"));
const today = new Date().toISOString().slice(0, 10);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const held = (href) => !REPO_PUBLIC && href.startsWith(REPO);
/** The words as the app shows them: `code`, and [words](https://...) as a link. */
function prose(text) {
  return String(text)
    .split("`")
    .map((part, i) => (i % 2 ? `<code>${esc(part)}</code>` : esc(part).replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, (_, t, u) => `<a href="${u}" rel="noopener">${t}</a>`)))
    .join("");
}
const pageUrl = (slug) => `${BASE}/${PROJECT}/${slug}/`;
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
.static code { font-size: 0.86em; padding: 1px 5px; border: 1px solid var(--line); border-radius: 2px; background: var(--bg); }
</style>
<script>try{var t=localStorage.getItem('graphos-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}</script>
${ld ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n` : ""}</head>
<body>
<header class="bar"><div class="bar-inner">
<a class="bar-name" href="${up}#/${PROJECT}">${PROJECT} <span class="bar-sub">use cases</span></a>
<nav class="bar-links" aria-label="Site"><a href="${up}${PROJECT}/">${esc(ui.nav.useCases)}</a><a href="${up}${PROJECT}/how/">${esc(ui.nav.how)}</a></nav>
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
const about = { "@type": "SoftwareApplication", name: "Syrmos", applicationCategory: "DeveloperApplication", operatingSystem: "Linux, Windows", license: "https://www.apache.org/licenses/LICENSE-2.0" };

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
      ? `<p>${esc(t.tryIt.linkText ?? ui.page.tryIt)} (${esc(ui.notPublic.toLowerCase())})</p>`
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
${t.caveat ? `<p class="caveat">${esc(t.caveat)}</p>\n` : ""}<p class="cta"><a class="btn primary" href="${up}#/${PROJECT}/${m.slug}/1">Step through it, animated →</a></p>
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
${shot ? `<figure class="shot"><figcaption><span class="eyebrow">${esc(ui.page.seeIt)}</span><span>${esc(shot.caption)}</span></figcaption><img src="${up}ui/${m.shot}.webp" alt="${esc(shot.alt)}" width="${shot.w}" height="${shot.h}" loading="lazy"></figure>\n` : ""}<section class="try"><h2 class="eyebrow">${esc(ui.page.tryIt)}</h2><p>${prose(t.tryIt.text)}</p>${tryLink}</section>
<h2 class="eyebrow">${esc(ui.page.related)}</h2>
<ul>
${related}
</ul>`;
  write(
    `${PROJECT}/${m.slug}/index.html`,
    page({
      title: `${t.title} · Syrmos use cases`,
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
  const body = `<h1 class="page-title">Syrmos use cases</h1>
<p class="case-situation">${esc(ui.hero.title)} ${esc(ui.hero.audience)}</p>
<p>${esc(ui.hero.lede)} ${esc(ui.hero.early)}</p>
<p class="cta"><a class="btn primary" href="../#/${PROJECT}">Explore them, animated →</a></p>
<dl style="margin-top:22px">
${help}
</dl>
${groups}`;
  write(
    `${PROJECT}/index.html`,
    page({
      title: "Syrmos use cases",
      description: `${ui.hero.title} ${ui.hero.lede}`,
      canonical: `${BASE}/${PROJECT}/`,
      up: "../",
      body,
      ld: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Syrmos use cases", url: `${BASE}/${PROJECT}/`, inLanguage: "en", about, publisher },
    }),
  );
}

// How it works
{
  const idea = ideas
    .map((d, i) => {
      const p = partText[d.part];
      const see = d.best.map((s) => `<a href="../${s}/">${esc(textEn[s].title)}</a>`).join(", ");
      return `<h2 class="eyebrow">${String(i + 1).padStart(2, "0")} · ${esc(p.name)}</h2>\n<p><strong>${esc(p.line)}</strong></p>\n<p>${esc(p.body)}</p>\n<p class="muted">See it in: ${see}</p>`;
    })
    .join("\n");
  const other = otherParts.map((k) => `<dt>${esc(partText[k].name)}</dt><dd>${esc(partText[k].line)} ${esc(partText[k].body)}</dd>`).join("\n");
  const body = `<nav class="crumbs" aria-label="Breadcrumb"><a href="../">${esc(ui.page.crumbs)}</a></nav>
<h1 class="page-title">${esc(ui.nav.how)}</h1>
<p class="case-situation">${esc(ui.hero.title)} ${esc(ui.hero.audience)}</p>
<p>${esc(ui.overview.caption)}</p>
<p class="cta"><a class="btn primary" href="../../#/${PROJECT}/how">See the diagram, animated →</a></p>
${idea}
<h2 class="eyebrow">The other parts you meet</h2>
<dl>
${other}
</dl>`;
  write(
    `${PROJECT}/how/index.html`,
    page({
      title: "How Syrmos works · Syrmos use cases",
      description: partText.cell.line,
      canonical: `${BASE}/${PROJECT}/how/`,
      up: "../../",
      body,
      ld: { "@context": "https://schema.org", "@type": "TechArticle", headline: "How Syrmos works", url: `${BASE}/${PROJECT}/how/`, inLanguage: "en", about, publisher },
    }),
  );
}

// sitemap.xml and llms.txt, moved to the site's root by the pages workflow
{
  const urls = [`${SITE}/`, `${BASE}/`, `${BASE}/${PROJECT}/`, `${BASE}/${PROJECT}/how/`, ...useCases.map((m) => pageUrl(m.slug))];
  write(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`,
  );
  const line = (m) => `- [${textEn[m.slug].title}](${pageUrl(m.slug)}): ${textEn[m.slug].situation} Status: ${ui.status[m.status]}.`;
  write(
    "llms.txt",
    `# Pomentum

> Pomentum is an open-source hub. We explore ideas and turn them into real solutions. Its projects: Syrmos, which hosts
> Node-RED for many tenants with every change governed, and graphos, a multi-tenant property-graph service.

Syrmos is early and not yet released. Each use case below is written out step by step on a page of its own, with its status
(${Object.keys(ui.status).map((s) => `${ui.status[s]}: ${ui.statusHelp[s]}`).join(" ")}) and what that status rests on.

## Syrmos use cases

${useCases.map(line).join("\n")}

## Syrmos, the whole picture

- [How Syrmos works](${BASE}/${PROJECT}/how/): the five ideas every use case rests on (cells, protected cells, promotion, the credential gateway, the bus) and the other parts.
- [All Syrmos use cases](${BASE}/${PROJECT}/): the list, by kind and status.

## Pomentum

- [Pomentum](${SITE}/): the organisation's page and its projects.
- [graphos](${SITE}/graphos/): a multi-tenant property-graph service, PostgreSQL and Apache AGE behind a typed HTTP API.
`,
  );
}

// the app's <noscript>: every page, for a reader or a crawler without JavaScript
{
  const file = join(OUT, "index.html");
  const html = readFileSync(file, "utf8");
  const list = useCases.map((m) => `<li><a href="${PROJECT}/${m.slug}/">${esc(textEn[m.slug].title)}</a></li>`).join("");
  const noscript = `<noscript><div style="padding:24px;font-family:system-ui;max-width:760px"><p>The animated use cases need JavaScript. Each is also written out on a page of its own:</p><ul>${list}</ul><p><a href="${PROJECT}/">All Syrmos use cases</a> · <a href="${PROJECT}/how/">How Syrmos works</a></p></div></noscript>`;
  const next = html.replace(/<noscript>[\s\S]*?<\/noscript>/, noscript);
  if (next === html) throw new Error("prerender: no <noscript> in the built index.html");
  writeFileSync(file, next);
}

console.log(`prerender: ${useCases.length} use cases, the list and How it works; sitemap.xml and llms.txt`);
