// The walkthroughs, one per problem a reader has, each built from the steps of the earlier walkthroughs (the sources). A step
// is drawn with its source's diagram at that source's step, and shows that source's status: a walkthrough never borrows a
// better status than its evidence. The sources stay here for their drawings and statuses; their words are no longer shown.
import type { Kind, PartId, Status, UseCaseMeta, UseCaseText } from "./types";
import { manyTenants } from "./diagrams/many-tenants";
import { changingProduction } from "./diagrams/changing-production";
import { testsPromotion } from "./diagrams/tests-promotion";
import { deadLetters } from "./diagrams/dead-letters";
import { polledDatabase } from "./diagrams/polled-database";
import { batchReview } from "./diagrams/batch-review";
import { ordersReview } from "./diagrams/orders-review";
import { matrixRooms } from "./diagrams/matrix-rooms";
import { signedWebhooks } from "./diagrams/signed-webhooks";
import { topicPerPipeline } from "./diagrams/topic-per-pipeline";
import { odataConnector } from "./diagrams/odata-connector";
import { communityNode } from "./diagrams/community-node";
import { outsideAgent } from "./diagrams/outside-agent";
import { mcpTool } from "./diagrams/mcp-tool";
import { ragIngestion } from "./diagrams/rag-ingestion";
import { assistantDrafts } from "./diagrams/assistant-drafts";
import { onSite } from "./diagrams/on-site";
import { musicSpur } from "./diagrams/music-spur";
import { padShortcuts } from "./diagrams/pad-shortcuts";
import { printScan } from "./diagrams/print-scan";

/** The earlier walkthroughs, by slug: each step of a walkthrough below is drawn from one of them. */
export const sources: Record<string, UseCaseMeta> = Object.fromEntries(
  [
    manyTenants,
    changingProduction,
    testsPromotion,
    deadLetters,
    polledDatabase,
    batchReview,
    ordersReview,
    matrixRooms,
    signedWebhooks,
    topicPerPipeline,
    odataConnector,
    communityNode,
    outsideAgent,
    mcpTool,
    ragIngestion,
    assistantDrafts,
    onSite,
    musicSpur,
    padShortcuts,
    printScan,
  ].map((m) => [m.slug, m]),
);

const RANK: Record<Status, number> = { dev: 0, target: 1, shown: 2 };

function walk(slug: string, kind: Kind, steps: [string, number][], metrics: string[], parts: PartId[], related: string[], evidence?: Record<number, Status>): UseCaseMeta {
  const scenes = steps.map(([from, at]) => ({ from, at }));
  const first = sources[scenes[0].from];
  // the walkthrough's own status is its most cautious step's: the badge never says more than every step shows
  const status = scenes.map((s) => sources[s.from].status).sort((a, b) => RANK[a] - RANK[b])[0];
  return { slug, kind, status, diagram: first.diagram, thumb: first.thumb, metrics, parts, related, scenes, evidence };
}

export const customersApart = walk(
  "customers-apart",
  "tenants",
  [["many-tenants", 0], ["many-tenants", 1], ["many-tenants", 2], ["many-tenants", 3], ["many-tenants", 4], ["many-tenants", 5], ["many-tenants", 6]],
  ["reach", "secrets", "limits"],
  ["cell", "gateway", "bus"],
  ["cold-room", "change-safely", "connect-services"],
);

export const changeSafely = walk(
  "change-safely",
  "people",
  [["changing-production", 0], ["changing-production", 1], ["changing-production", 2], ["tests-promotion", 2], ["tests-promotion", 5], ["changing-production", 4], ["changing-production", 5], ["changing-production", 7]],
  ["direct", "approval", "tests"],
  ["protected-cell", "promotion", "review", "audit"],
  ["cold-room", "person-decides", "ai-helps"],
  // the step back is built, but not among the trial's checks
  { 7: "target" },
);

export const nothingLost = walk(
  "nothing-lost",
  "integrations",
  [["dead-letters", 0], ["dead-letters", 1], ["dead-letters", 2], ["dead-letters", 3], ["dead-letters", 4], ["polled-database", 4], ["polled-database", 5]],
  ["batch", "retries", "restart"],
  ["bus", "tracing", "bridge"],
  ["cold-room", "person-decides", "connect-services"],
);

export const personDecides = walk(
  "person-decides",
  "people",
  [["orders-review", 0], ["orders-review", 3], ["orders-review", 4], ["orders-review", 5], ["batch-review", 2], ["batch-review", 3], ["batch-review", 5]],
  ["waiting", "decided", "batch"],
  ["review", "tracing", "audit"],
  ["change-safely", "nothing-lost", "ai-helps"],
);

export const connectServices = walk(
  "connect-services",
  "integrations",
  [["matrix-rooms", 0], ["matrix-rooms", 2], ["matrix-rooms", 3], ["signed-webhooks", 1], ["signed-webhooks", 4], ["topic-per-pipeline", 2], ["odata-connector", 5], ["community-node", 3]],
  ["password", "forged", "twice"],
  ["gateway", "bridge", "registry"],
  ["cold-room", "customers-apart", "nothing-lost"],
);

export const aiHelps = walk(
  "ai-helps",
  "ai",
  [["outside-agent", 0], ["assistant-drafts", 4], ["outside-agent", 2], ["outside-agent", 3], ["outside-agent", 4], ["mcp-tool", 1], ["mcp-tool", 4], ["rag-ingestion", 2]],
  ["actsAs", "production", "tools"],
  ["mcp", "assistant", "gateway", "promotion"],
  ["change-safely", "person-decides", "connect-services"],
);

export const besideTheMachines = walk(
  "beside-the-machines",
  "devices",
  [["music-spur", 0], ["music-spur", 1], ["music-spur", 2], ["music-spur", 3], ["music-spur", 4], ["music-spur", 5], ["music-spur", 6], ["music-spur", 7]],
  ["chord", "clock", "offline"],
  ["spur", "cell"],
  ["cold-room", "customers-apart", "connect-services"],
);

/**
 * The statuses a walkthrough's steps show, the most cautious first. A problem step (the situation before Syrmos) is no evidence
 * and counts for nothing; a step with evidence of its own counts by that.
 */
export function statusesOf(m: UseCaseMeta, t?: UseCaseText): Status[] {
  const n = t?.steps.length ?? m.scenes?.length ?? 0;
  const all = new Set<Status>();
  for (let i = 0; i < n; i++) if (t?.steps[i]?.tag !== "problem") all.add(sceneAt(m, i).status);
  if (!all.size) all.add(m.status);
  return [...all].sort((a, b) => RANK[a] - RANK[b]);
}

/** What step i of a walkthrough draws, and the status of what shows it: the step's own evidence, or its source walkthrough's. */
export function sceneAt(m: UseCaseMeta, i: number): { def: UseCaseMeta["diagram"]; at: number; status: Status; from?: string } {
  const s = m.scenes?.[i];
  const own = m.evidence?.[i];
  if (!s) return { def: m.diagram, at: i, status: own ?? m.status };
  const src = sources[s.from];
  return { def: src.diagram, at: s.at, status: own ?? src.status, from: s.from };
}
