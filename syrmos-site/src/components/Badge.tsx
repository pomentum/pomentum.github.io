import type { Status } from "../../content/types";
import { useI18n } from "../i18n";

export function Badge({ status }: { status: Status }) {
  const { ui } = useI18n();
  return (
    <span className={`badge st-${status}`} title={ui.statusHelp[status]}>
      {ui.status[status]}
    </span>
  );
}
