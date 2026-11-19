import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";
import { href, type Route } from "../router";
import type { Theme } from "../store";

/** Get started: the landing page's own section, as on the graphos page (its commands, then the installation guide). */
export const README = "#/start";
export const REPO = "https://github.com/pomentum/graphos";

export function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

/** The top bar every pomentum.dev page has (as on www.pomentum.dev/graphos/): the name after a square of the accent, the
 * sections in small capitals, a Sections menu on a narrow screen, and the Light / Dark switch. */
export function TopBar(props: { theme: Theme; onTheme: (t: Theme) => void; onSearch: () => void; route: Route }) {
  const { ui } = useI18n();
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => setOpen(false), [props.route]);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menu.current?.querySelector("summary")?.focus();
      }
    };
    const click = (e: MouseEvent) => {
      if (menu.current && !menu.current.contains(e.target as Node)) setOpen(false);
    };
    addEventListener("keydown", key);
    addEventListener("click", click);
    return () => {
      removeEventListener("keydown", key);
      removeEventListener("click", click);
    };
  }, [open]);

  const current = props.route.page;
  const search = () => {
    setOpen(false);
    props.onSearch();
  };
  return (
    <header className="bar">
      <div className="bar-inner">
        <span className="bar-brand">
          <a className="bar-home" href="/">
            Pomentum
          </a>
          <span className="bar-sep" aria-hidden="true">
            /
          </span>
          <a className="bar-name" href={href.home()}>
            graphos <span className="bar-sub">use cases</span>
          </a>
        </span>
        <nav className="bar-links" aria-label="Site">
          <a href={href.gallery()} aria-current={current === "home" || current === "case" ? "page" : undefined}>
            {ui.nav.useCases}
          </a>
          <a href={href.how()} aria-current={current === "how" ? "page" : undefined}>
            {ui.nav.how}
          </a>
          <button type="button" className="bar-search" onClick={props.onSearch} aria-label={`${ui.nav.search} (${isMac ? "⌘" : "Ctrl"} K)`}>
            {ui.nav.search} <kbd>{isMac ? "⌘" : "Ctrl"} K</kbd>
          </button>
          <a href={REPO} rel="noopener">
            {ui.nav.github}
          </a>
          <a className="keep" href={README}>
            {ui.nav.getStarted}
          </a>
        </nav>
        <details className="toc" ref={menu} open={open}>
          <summary
            aria-label={ui.nav.menu}
            onClick={(e) => {
              e.preventDefault();
              setOpen((o) => !o);
            }}
          >
            <span className="bars" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="toc-label">{ui.nav.menu}</span>
          </summary>
          <div className="panel">
            <ol>
              <li>
                <a href={href.gallery()}>{ui.nav.useCases}</a>
              </li>
              <li>
                <a href={href.how()}>{ui.nav.how}</a>
              </li>
              <li>
                <button type="button" onClick={search}>
                  {ui.nav.search}
                </button>
              </li>
              <li>
                <a href={README}>{ui.nav.getStarted}</a>
              </li>
              <li>
                <a href={REPO} rel="noopener">
                  {ui.nav.github}
                </a>
              </li>
            </ol>
          </div>
        </details>
        <div className="mode" role="group" aria-label={ui.theme.label}>
          {(["light", "dark"] as const).map((t) => (
            <button key={t} type="button" aria-pressed={props.theme === t} onClick={() => props.onTheme(t)}>
              {t === "light" ? ui.theme.light : ui.theme.dark}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
