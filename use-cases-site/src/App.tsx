import { useCallback, useEffect, useMemo, useState } from "react";
import { I18nContext, i18n } from "./i18n";
import { useRoute } from "./router";
import { addVisited, loadTheme, loadVisited, saveTheme, type Theme } from "./store";
import { TopBar } from "./components/TopBar";
import { Search } from "./components/Search";
import { Home } from "./components/Home";
import { UseCasePage } from "./components/UseCasePage";
import { HowItWorks } from "./components/HowItWorks";
import { Footer } from "./components/Footer";
import { loadView, saveView, ViewContext, type View } from "./view";

export function App() {
  const route = useRoute();
  const [theme, setTheme] = useState<Theme>(loadTheme);
  const [visited, setVisited] = useState<string[]>(loadVisited);
  const [searching, setSearching] = useState(false);
  const [view, setViewState] = useState<View>(loadView);
  const viewCtx = useMemo(() => ({ view, setView: (v: View) => { saveView(v); setViewState(v); } }), [view]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const chooseTheme = useCallback((t: Theme) => {
    saveTheme(t);
    setTheme(t);
  }, []);

  // Ctrl K / ⌘K opens the search from anywhere.
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearching(true);
      }
    };
    addEventListener("keydown", on);
    return () => removeEventListener("keydown", on);
  }, []);

  useEffect(() => {
    if (route.page === "case") setVisited(addVisited(route.slug));
  }, [route]);

  // A new page starts at its top; the gallery and a How it works part scroll to themselves.
  const pageKey = route.page === "case" ? `case:${route.slug}` : route.page === "how" ? `how:${route.part ?? ""}` : `home:${route.gallery ? "g" : ""}`;
  useEffect(() => {
    const target = route.page === "home" && route.gallery ? "gallery" : route.page === "how" && route.part ? `part-${route.part}` : null;
    if (target) requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ block: "start" }));
    else scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  useEffect(() => {
    const t = i18n.ui;
    if (route.page === "case") {
      const words = i18n.text(route.slug);
      document.title = words ? `${words.t.title} · syrmos use cases` : "syrmos · use cases";
    } else document.title = route.page === "how" ? `${t.how.title} · syrmos use cases` : "syrmos · use cases";
  }, [route]);

  return (
    <I18nContext.Provider value={i18n}>
      <ViewContext.Provider value={viewCtx}>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>
        Skip to the content
      </a>
      <TopBar theme={theme} onTheme={chooseTheme} onSearch={() => setSearching(true)} route={route} />
      <main id="main" tabIndex={-1}>
        {route.page === "home" && <Home visited={visited} />}
        {route.page === "how" && <HowItWorks />}
        {route.page === "case" && <UseCasePage key={route.slug} slug={route.slug} step={route.step} />}
      </main>
      <Footer />
      {searching && <Search onClose={() => setSearching(false)} />}
      </ViewContext.Provider>
    </I18nContext.Provider>
  );
}
