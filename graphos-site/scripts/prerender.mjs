// After `vite build`: the landing page's first view written into index.html (src/ssr.tsx; its sections, In 30 seconds to the
// documentation, are in it), and a plain HTML page per use case, the list of them and How it works (the landing page's
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
const { firstScreen } = await vite.ssrLoadModule("/src/ssr.tsx");
const landing = firstScreen();
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
${image ? `<meta property="og:image" content="${image}">\n<meta name="twitter:card" content="summary_large_image">\n` : ""}<link rel="icon" href="${up}favicon.svg" type="image/svg+xml">
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
      image: m.shot ? `${BASE}/ui/${m.shot}.webp` : OG,
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
      image: OG,
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
      image: OG,
      up: "../",
      body,
      ld: { "@context": "https://schema.org", "@type": "TechArticle", headline: "How graphos works", url: `${BASE}/how/`, inLanguage: "en", about, publisher },
    }),
  );
}

// the overview's address, from when the landing page's words were written out there: the landing page carries them now
write(
  "overview/index.html",
  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Moved: graphos</title>
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
  const noscript = `<noscript><div style="padding:24px;font-family:system-ui;max-width:760px"><p>The animated use cases need JavaScript. Each is also written out on a page of its own:</p><ul>${list}</ul><p><a href="use-cases/">All graphos use cases</a> · <a href="how/">How graphos works</a></p></div></noscript>`;
  const withWords = html.replace('<div id="root"></div>', `<div id="root">${landing}</div>`);
  if (withWords === html) throw new Error("prerender: no empty #root in the built index.html");
  const next = withWords.replace(/<noscript>[\s\S]*?<\/noscript>/, noscript);
  if (next === withWords) throw new Error("prerender: no <noscript> in the built index.html");
  writeFileSync(file, next);
}

console.log(`prerender: ${useCases.length} use cases, the landing page's first view, the list and How it works; sitemap.xml and llms.txt; graphos ${LATEST}`);
