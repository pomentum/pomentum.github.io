// After `vite build`: the landing page's first view written into index.html (src/ssr.tsx), and a plain HTML page per use case,
// the list of them and How it works, so that search engines, AI tools and link previews,
// which mostly read a page without running its JavaScript, find every use case at an address of its own. Each page is written
// from the same content files as the animated walkthrough, and links to it. Also writes sitemap.xml and llms.txt (the pages
// workflow moves both to the site's root), lists the pages in the app's <noscript>, and leaves redirects at the first
// addresses, /use-cases/..., in ../use-cases/.
//   node scripts/prerender.mjs        (npm run build runs it)
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const OUT = join(ROOT, "..", "syrmos");
const OLD = join(ROOT, "..", "use-cases"); // where the app lived first: redirects only
const SITE = "https://www.pomentum.dev";
const BASE = `${SITE}/syrmos`;
const REPO = "https://github.com/pomentum/syrmos";
const REPO_PUBLIC = false; // as PUBLIC in src/components/OutLink.tsx

// the content, loaded as the app loads it
const vite = await createServer({ root: ROOT, logLevel: "error", server: { middlewareMode: true }, appType: "custom" });
const { useCases, textEn, ideas, otherParts, redirects } = await vite.ssrLoadModule("/content/index.ts");
const { statusesOf, sceneAt } = await vite.ssrLoadModule("/content/walkthroughs.ts");
const { ui, partText, shots } = await vite.ssrLoadModule("/content/en/ui.ts");
const { tour, slugOf, problemWords } = await vite.ssrLoadModule("/content/en/problems.ts");
const { firstScreen } = await vite.ssrLoadModule("/src/ssr.tsx");
const landing = firstScreen();
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
const pageUrl = (slug) => `${BASE}/use-cases/${slug}/`;
/** The preview a shared link shows: the first screen, 1200 × 630 (public/og.png, made by scripts/og-image.mjs). */
const OG = `${BASE}/og.png`;
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
${image ? `<meta property="og:image" content="${image}">\n<meta name="twitter:card" content="summary_large_image">\n` : ""}<link rel="icon" href="${up}favicon.svg?v=20261119" type="image/svg+xml">
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
<span class="bar-brand"><a class="bar-home" href="/">Pomentum</a><span class="bar-sep" aria-hidden="true">/</span><a class="bar-name" href="${up}">syrmos</a></span>
<nav class="bar-links" aria-label="Site"><a href="${up}use-cases/">${esc(ui.nav.useCases)}</a><a href="${up}how/">${esc(ui.nav.how)}</a></nav>
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

const badges = (m) => statusesOf(m, textEn[m.slug]).map(badge).join("");
const badge = (status) => `<span class="badge st-${status}">${esc(ui.status[status])}</span>`;
const publisher = { "@type": "Organization", name: "Pomentum", url: `${SITE}/` };
const about = { "@type": "SoftwareApplication", name: "Syrmos", applicationCategory: "DeveloperApplication", operatingSystem: "Linux, Windows", license: "https://www.apache.org/licenses/LICENSE-2.0" };

// one page per walkthrough
for (const m of useCases) {
  const t = textEn[m.slug];
  const up = "../../";
  const steps = t.steps
    .map((s, i) => {
      const metrics = Object.entries(s.metrics ?? {})
        .map(([k, v]) => `${esc(t.metricLabels[k] ?? k)}: ${esc(v)}`)
        .join(" · ");
      const from = s.tag !== "problem" && statusesOf(m, t).length > 1 ? ` <span class="m">${esc(problemWords.stepFrom)} ${badge(sceneAt(m, i).status)}</span>` : "";
      return `<li>
<h3><span class="tag step-tag tag-${s.tag}">${esc(ui.tags[s.tag])}</span> ${i + 1}. ${esc(s.title)}${from}</h3>
${s.body.map((p) => `<p>${prose(p)}</p>`).join("\n")}${metrics ? `\n<p class="m">${metrics}</p>` : ""}
</li>`;
    })
    .join("\n");
  const parts = m.parts.map((p) => `<dt>${esc(partText[p].name)}</dt><dd>${prose(t.parts[p] ?? partText[p].line)}</dd>`).join("\n");
  const shot = m.shot ? shots[m.shot] : null;
  const tryLink = t.tryIt.href
    ? held(t.tryIt.href)
      ? ""
      : `<p><a class="btn primary" href="${t.tryIt.href}" rel="noopener">${esc(t.tryIt.linkText ?? ui.page.tryIt)}</a></p>`
    : "";
  const related = m.related
    .map((r) => useCases.find((u) => u.slug === r))
    .filter(Boolean)
    .map((r) => `<li><a href="../${r.slug}/">${esc(textEn[r.slug].title)}</a> · ${esc(textEn[r.slug].situation)}</li>`)
    .join("\n");
  const body = `<nav class="crumbs" aria-label="Breadcrumb"><a href="${up}">${esc(ui.first.start.title)}</a></nav>
<h1 class="page-title">${esc(t.title)}</h1>
<p class="case-situation">${esc(t.situation)}</p>
<div class="pills"><span class="tag">${esc(t.team)}</span><span class="tag">${esc(ui.gallery.steps(t.steps.length))}</span>${badges(m)}</div>
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
<h2 class="eyebrow">${esc(ui.page.whyStatus)}: ${statusesOf(m, t).map((st) => esc(ui.status[st])).join(", ")}</h2>
<p>${prose(t.statusNote)}</p>
${statusesOf(m, t).map((st) => `<p class="muted">${badge(st)} ${esc(ui.statusHelp[st])}</p>`).join("\n")}
${shot ? `<figure class="shot"><figcaption><span class="eyebrow">${esc(ui.page.seeIt)}</span><span>${esc(shot.caption)}</span></figcaption><img src="${up}ui/${m.shot}.webp" alt="${esc(shot.alt)}" width="${shot.w}" height="${shot.h}" loading="lazy"></figure>\n` : ""}<section class="try"><h2 class="eyebrow">${esc(ui.page.tryIt)}</h2><p>${prose(t.tryIt.text)}</p>${tryLink}</section>
<h2 class="eyebrow">${esc(ui.page.related)}</h2>
<ul>
${related}
</ul>`;
  write(
    `use-cases/${m.slug}/index.html`,
    page({
      title: `${t.title} · Syrmos use cases`,
      description: t.situation,
      canonical: pageUrl(m.slug),
      up,
      body,
      image: m.shot ? `${BASE}/ui/${m.shot}.webp` : OG,
      ld: { "@context": "https://schema.org", "@type": "TechArticle", headline: t.title, description: t.situation, url: pageUrl(m.slug), inLanguage: "en", about, publisher },
    }),
  );
}

// the list of them
{
  // one list, in the order to learn Syrmos (content/index.ts)
  const groups = `<h2 class="eyebrow">${esc(ui.gallery.lede)}</h2>\n<ol class="static-list">\n${useCases
    .map(
      (m, i) =>
        `<li><h3>${i + 1}. <a href="${m.slug}/">${esc(textEn[m.slug].title)}</a> ${badges(m)}</h3><p>${esc(textEn[m.slug].situation)}</p></li>`,
    )
    .join("\n")}\n</ol>`;
  const help = Object.keys(ui.status).map((s) => `<dt>${badge(s)}</dt><dd>${esc(ui.statusHelp[s])}</dd>`).join("\n");
  const body = `<h1 class="page-title">Syrmos use cases</h1>
<p class="case-situation">${esc(ui.hero.title)}</p>
<p>${prose(ui.hero.plain)}</p>
<p class="muted">${esc(ui.hero.engineers)} · ${esc(ui.hero.audience)}</p>
<p>${esc(ui.hero.lede)} ${esc(ui.hero.early)}</p>
<p class="cta"><a class="btn primary" href="../#/use-cases">Explore them, animated →</a></p>
<dl style="margin-top:22px">
${help}
</dl>
${groups}`;
  write(
    `use-cases/index.html`,
    page({
      title: "Syrmos use cases",
      description: `${ui.hero.title} ${ui.hero.plain}`,
      canonical: `${BASE}/use-cases/`,
      up: "../",
      body,
      image: OG,
      ld: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Syrmos use cases", url: `${BASE}/use-cases/`, inLanguage: "en", about, publisher },
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
<p class="case-situation">${esc(ui.hero.title)}</p>
<p>${prose(ui.hero.plain)}</p>
<p class="muted">${esc(ui.hero.engineers)} · ${esc(ui.hero.audience)}</p>
<p>${esc(ui.overview.caption)}</p>
<p class="cta"><a class="btn primary" href="../#/how">See the diagram, animated →</a></p>
${idea}
<h2 class="eyebrow">The other parts you meet</h2>
<dl>
${other}
</dl>
<h2 class="eyebrow">${esc(ui.how.words.title)}</h2>
<dl>
${ui.how.words.items.map((x) => `<dt>${esc(x.k)}</dt><dd>${esc(x.v)}</dd>`).join("\n")}
</dl>
<h2 class="eyebrow">${esc(ui.how.faq)}</h2>
<dl>
${ui.faq.map((f) => `<dt>${esc(f.q)}</dt><dd>${prose(f.a)}</dd>`).join("\n")}
</dl>`;
  write(
    `how/index.html`,
    page({
      title: "How Syrmos works · Syrmos use cases",
      description: partText.cell.line,
      canonical: `${BASE}/how/`,
      up: "../",
      body,
      image: OG,
      ld: { "@context": "https://schema.org", "@type": "TechArticle", headline: "How Syrmos works", url: `${BASE}/how/`, inLanguage: "en", about, publisher },
    }),
  );
}

// the overview's address, from when the landing page's words were written out there: the landing page carries them now
write(
  "overview/index.html",
  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Moved: Syrmos</title>
<link rel="canonical" href="${BASE}/"><meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${BASE}/">
</head><body><p>This page has moved to <a href="${BASE}/">${BASE}/</a>.</p></body></html>
`,
);

// sitemap.xml and llms.txt, moved to the site's root by the pages workflow
{
  const urls = [`${SITE}/`, `${BASE}/`, `${BASE}/use-cases/`, `${BASE}/how/`, ...useCases.map((m) => pageUrl(m.slug))];
  write(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`,
  );
  const line = (m) => `- [${textEn[m.slug].title}](${pageUrl(m.slug)}): ${textEn[m.slug].situation} ${textEn[m.slug].context} Status: ${statusesOf(m, textEn[m.slug]).map((st) => ui.status[st]).join(", ")}.`;
  write(
    "llms.txt",
    `# Pomentum

> Pomentum is an open-source hub. We explore ideas and turn them into real solutions. Its projects: Syrmos, which hosts
> Node-RED for many tenants with every change governed, and graphos, a multi-tenant property-graph service.

Syrmos in plain words: ${ui.hero.title} ${ui.hero.plain}

Syrmos is early and not yet released. Each use case below is written out step by step on a page of its own, with its status
(${Object.keys(ui.status).map((s) => `${ui.status[s]}: ${ui.statusHelp[s]}`).join(" ")}) and what that status rests on.

## What Syrmos solves

${useCases.map(line).join("\n")}

## Syrmos, the whole picture

- [Syrmos](${BASE}/): the page: what Syrmos is, the platform drawn, and the use cases, animated step by step.
- [How Syrmos works](${BASE}/how/): the five ideas every use case rests on (cells, protected cells, promotion, the credential gateway, the bus) and the other parts.
- [All Syrmos use cases](${BASE}/use-cases/): the list, in the order to learn Syrmos, with each one's kind and status.

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
  const list = useCases.map((m) => `<li><a href="use-cases/${m.slug}/">${esc(textEn[m.slug].title)}</a></li>`).join("");
  const noscript = `<noscript><div style="padding:24px;font-family:system-ui;max-width:760px"><p>The animated pages need JavaScript. Each walkthrough is also written out on a page of its own:</p><ul>${list}</ul><p><a href="use-cases/">All Syrmos use cases</a> · <a href="how/">How Syrmos works</a></p></div></noscript>`;
  const withWords = html.replace('<div id="root"></div>', `<div id="root">${landing}</div>`);
  if (withWords === html) throw new Error("prerender: no empty #root in the built index.html");
  const next = withWords.replace(/<noscript>[\s\S]*?<\/noscript>/, noscript);
  if (next === withWords) throw new Error("prerender: no <noscript> in the built index.html");
  writeFileSync(file, next);
}

// the first addresses, /use-cases/..., moved to /syrmos/...: small pages that send a reader on and tell search engines where
{
  const stub = (to, script = "") => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Moved: Syrmos</title>
<link rel="canonical" href="${to}"><meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${to}">${script}
</head><body><p>This page has moved to <a href="${to}">${to}</a>.</p></body></html>
`;
  rmSync(OLD, { recursive: true, force: true });
  const put = (rel, html) => {
    mkdirSync(dirname(join(OLD, rel)), { recursive: true });
    writeFileSync(join(OLD, rel), html);
  };
  // the app's old hash addresses (#/syrmos/<use case>/<step>, #/syrmos/how) carried on to the same view at /syrmos/
  const hashMove = `<script>try{var h=location.hash.slice(1);if(h.charAt(0)=="/")h=h.slice(1);if(h.indexOf("syrmos")==0){h=h.slice(6);if(h.charAt(0)=="/")h=h.slice(1)}var to="${BASE}/"+(h?(h.indexOf("how")==0||h.indexOf("use-cases")==0?"#/"+h:"#/use-cases/"+h):"");location.replace(to)}catch(e){}</script>`;
  put("index.html", stub(`${BASE}/`, hashMove));
  put("syrmos/index.html", stub(`${BASE}/use-cases/`));
  put("syrmos/how/index.html", stub(`${BASE}/how/`));
  for (const m of useCases) put(`syrmos/${m.slug}/index.html`, stub(pageUrl(m.slug)));
  for (const [old, to] of Object.entries(redirects)) {
    put(`syrmos/${old}/index.html`, stub(pageUrl(to.to)));
    // the earlier walkthrough's own plain page, at /syrmos/use-cases/<old>/
    const file = join(OUT, "use-cases", old, "index.html");
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, stub(pageUrl(to.to), `<script>location.replace(${JSON.stringify(`${BASE}/#/use-cases/${to.to}/${to.step}`)})</script>`));
  }
}

console.log(`prerender: ${useCases.length} walkthroughs, the landing page's first view, the list and How it works; sitemap.xml and llms.txt; redirects from ${Object.keys(redirects).length} earlier walkthroughs and /use-cases/`);
