import { useI18n } from "../i18n";

/** The footer every pomentum.dev page has: a row of links ending with Pomentum, and a line of notes. */
export function Footer() {
  const { ui } = useI18n();
  return (
    <footer className="foot">
      <div className="wrap">
        <div>
          <p className="cols">
            <a href="https://www.pomentum.dev/">{ui.footer.pomentum}</a>
            <a href="https://github.com/pomentum" rel="noopener">
              GitHub
            </a>
          </p>
          <p>{ui.footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
