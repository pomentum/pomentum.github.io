import { renderToString } from "react-dom/server";
import { I18nContext, i18n } from "./i18n";
import { ViewContext } from "./view";
import { TopBar } from "./components/TopBar";
import { Home } from "./components/Home";
import { Footer } from "./components/Footer";

/**
 * The landing page as the app first draws it, as HTML: scripts/prerender.mjs writes it into the built index.html, so a reader
 * that runs no JavaScript (an AI tool, a link preview) gets the page's words from its own address. The app replaces it as it
 * starts (main.tsx); the words come from the same content files, written once.
 */
export function firstScreen(): string {
  return renderToString(
    <I18nContext.Provider value={i18n}>
      <ViewContext.Provider value={{ view: "iso", setView: () => undefined }}>
        <a className="skip" href="#main">
          Skip to the content
        </a>
        <TopBar theme="dark" onTheme={() => undefined} onSearch={() => undefined} route={{ page: "home" }} />
        <main id="main" tabIndex={-1}>
          <Home visited={[]} />
        </main>
        <Footer />
      </ViewContext.Provider>
    </I18nContext.Provider>,
  );
}
