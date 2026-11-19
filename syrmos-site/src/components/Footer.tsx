import { useI18n } from "../i18n";
import { REPO } from "./TopBar";
import { OutLink } from "./OutLink";

/** The footer every pomentum.dev page has: a row of links ending with Pomentum, and a line of notes. */
export function Footer() {
  const { ui } = useI18n();
  return (
    <footer className="foot">
      <div className="wrap">
        <div>
          <p className="cols">
            <OutLink href={REPO} tag={false}>
              {ui.footer.source}
            </OutLink>
            <OutLink href={`${REPO}/blob/main/LICENSE`} tag={false}>
              {ui.footer.licence}
            </OutLink>
            <OutLink href={`${REPO}/blob/main/NOTICE`} tag={false}>
              {ui.footer.notice}
            </OutLink>
            <a href="https://www.pomentum.dev/">{ui.footer.pomentum}</a>
          </p>
          <p>{ui.footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
