import { useI18n } from "../i18n";
import { useView, type View } from "../view";

export function ViewSwitch() {
  const { ui } = useI18n();
  const { view, setView } = useView();
  return (
    <div className="view-switch" role="group" aria-label={ui.page.viewLabel}>
      {(["iso", "flat"] as View[]).map((v) => (
        <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>
          {v === "iso" ? ui.page.view3d : ui.page.viewFlat}
        </button>
      ))}
    </div>
  );
}
