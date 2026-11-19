// graphos's use cases, in the order of the gallery. A new use case: a diagram file, a words file, and a line in each list below.
import type { UseCaseMeta, UseCaseText } from "./types";
import { manyServices } from "./diagrams/many-services";
import { bulkLoad } from "./diagrams/bulk-load";
import { reconcile } from "./diagrams/reconcile";
import { csvImport } from "./diagrams/csv-import";
import { changeFeed } from "./diagrams/change-feed";
import { demoEcosystem } from "./diagrams/demo-ecosystem";
import { communities } from "./diagrams/communities";
import { mcpAgents } from "./diagrams/mcp-agents";
import { tenantsSso } from "./diagrams/tenants-sso";
import { leaveAnytime } from "./diagrams/leave-anytime";
import { manyServices as manyServicesEn } from "./en/many-services";
import { bulkLoad as bulkLoadEn } from "./en/bulk-load";
import { reconcile as reconcileEn } from "./en/reconcile";
import { csvImport as csvImportEn } from "./en/csv-import";
import { changeFeed as changeFeedEn } from "./en/change-feed";
import { demoEcosystem as demoEcosystemEn } from "./en/demo-ecosystem";
import { communities as communitiesEn } from "./en/communities";
import { mcpAgents as mcpAgentsEn } from "./en/mcp-agents";
import { tenantsSso as tenantsSsoEn } from "./en/tenants-sso";
import { leaveAnytime as leaveAnytimeEn } from "./en/leave-anytime";

export const useCases: UseCaseMeta[] = [
  manyServices,
  bulkLoad,
  reconcile,
  csvImport,
  changeFeed,
  demoEcosystem,
  communities,
  mcpAgents,
  tenantsSso,
  leaveAnytime,
];

export const textEn: Record<string, UseCaseText> = {
  "many-services": manyServicesEn,
  "bulk-load": bulkLoadEn,
  reconcile: reconcileEn,
  "csv-import": csvImportEn,
  "change-feed": changeFeedEn,
  "demo-ecosystem": demoEcosystemEn,
  communities: communitiesEn,
  "mcp-agents": mcpAgentsEn,
  "tenants-sso": tenantsSsoEn,
  "leave-anytime": leaveAnytimeEn,
};

/** Five ideas behind every use case, and the use cases that show each best (How it works). */
export const ideas = [
  { part: "api", best: ["many-services", "mcp-agents"] },
  { part: "tenant", best: ["tenants-sso", "many-services"] },
  { part: "writes", best: ["bulk-load", "reconcile"] },
  { part: "algorithms", best: ["communities", "demo-ecosystem"] },
  { part: "plain-age", best: ["leave-anytime", "bulk-load"] },
] as const;

export const otherParts = ["reconcile", "changes", "mcp", "access", "ui", "client", "audit"] as const;
