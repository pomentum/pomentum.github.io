import type { Status } from "../../content/types";
import { useI18n } from "../i18n";

/** One label for a card: the status, or "Partly shown" where its steps mix evidence (each step inside says which). */
export function CardStatus({ statuses }: { statuses: Status[] }) {
  const { ui } = useI18n();
  if (statuses.length === 1) return <Badge status={statuses[0]} />;
  return (
    <span className="badge st-partly" title={ui.partlyHelp}>
      {ui.partly}
    </span>
  );
}

export function Badge({ status }: { status: Status }) {
  const { ui } = useI18n();
  return (
    <span className={`badge st-${status}`} title={ui.statusHelp[status]}>
      {ui.status[status]}
    </span>
  );
}
