import type { ReactNode } from "react";
import { useI18n } from "../i18n";

/**
 * A link to a repository that is not public yet is shown, greyed and marked "not public yet", but goes nowhere (graphos's is public, so HELD is empty). Set
 * PUBLIC to true on the day it opens, and every such link works again.
 */
export const PUBLIC = false;
const HELD: string[] = []; // graphos is public: nothing is held

export const held = (href: string) => !PUBLIC && HELD.some((h) => href === h || href.startsWith(h.endsWith("/") ? h : `${h}/`) || href.startsWith(`${h}#`));

export function OutLink({ href, className, children, label, tag = true }: { href: string; className?: string; children: ReactNode; label?: string; tag?: boolean }) {
  const { ui } = useI18n();
  if (!held(href)) {
    return (
      <a className={className} href={href} rel="noopener" aria-label={label}>
        {children}
      </a>
    );
  }
  return (
    <span className={`${className ?? ""} held`} aria-disabled="true" title={ui.notPublic} aria-label={label ? `${label} (${ui.notPublic})` : undefined}>
      {children}
      {tag && <span className="held-tag">{ui.notPublic}</span>}
    </span>
  );
}
