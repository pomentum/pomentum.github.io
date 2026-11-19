import { useI18n } from "../i18n";

export function Legend() {
  const { ui } = useI18n();
  const l = ui.legend;
  return (
    <ul className="legend">
      <li><i className="ld k-data" />{l.data}</li>
      <li><i className="ld k-control" />{l.control}</li>
      <li><i className="ld k-gateway" />{l.gateway}</li>
      <li><i className="ld k-fail" />{l.fail}</li>
      <li><i className="lb t-open" />{l.open}</li>
      <li><i className="lb t-protected" />{l.protected}</li>
      <li><i className="lx" aria-hidden="true">×</i>{l.blocked}</li>
    </ul>
  );
}
