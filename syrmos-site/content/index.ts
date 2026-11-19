// The list of use cases, in the order of the gallery. A new use case: a diagram file, a words file, and a line in each list below.
import type { UseCaseMeta, UseCaseText } from "./types";
import { coldRoom } from "./diagrams/cold-room";
import { onSite } from "./diagrams/on-site";
import { signedWebhooks } from "./diagrams/signed-webhooks";
import { polledDatabase } from "./diagrams/polled-database";
import { ordersReview } from "./diagrams/orders-review";
import { changingProduction } from "./diagrams/changing-production";
import { assistantDrafts } from "./diagrams/assistant-drafts";
import { outsideAgent } from "./diagrams/outside-agent";
import { manyTenants } from "./diagrams/many-tenants";
import { topicPerPipeline } from "./diagrams/topic-per-pipeline";
import { musicSpur } from "./diagrams/music-spur";
import { padShortcuts } from "./diagrams/pad-shortcuts";
import { odataConnector } from "./diagrams/odata-connector";
import { communityNode } from "./diagrams/community-node";
import { printScan } from "./diagrams/print-scan";
import { ragIngestion } from "./diagrams/rag-ingestion";
import { batchReview } from "./diagrams/batch-review";
import { deadLetters } from "./diagrams/dead-letters";
import { matrixRooms } from "./diagrams/matrix-rooms";
import { mcpTool } from "./diagrams/mcp-tool";
import { testsPromotion } from "./diagrams/tests-promotion";
import { coldRoom as coldRoomEn } from "./en/cold-room";
import { onSite as onSiteEn } from "./en/on-site";
import { signedWebhooks as signedWebhooksEn } from "./en/signed-webhooks";
import { polledDatabase as polledDatabaseEn } from "./en/polled-database";
import { ordersReview as ordersReviewEn } from "./en/orders-review";
import { changingProduction as changingProductionEn } from "./en/changing-production";
import { assistantDrafts as assistantDraftsEn } from "./en/assistant-drafts";
import { outsideAgent as outsideAgentEn } from "./en/outside-agent";
import { manyTenants as manyTenantsEn } from "./en/many-tenants";
import { topicPerPipeline as topicPerPipelineEn } from "./en/topic-per-pipeline";
import { musicSpur as musicSpurEn } from "./en/music-spur";
import { padShortcuts as padShortcutsEn } from "./en/pad-shortcuts";
import { odataConnector as odataConnectorEn } from "./en/odata-connector";
import { communityNode as communityNodeEn } from "./en/community-node";
import { printScan as printScanEn } from "./en/print-scan";
import { ragIngestion as ragIngestionEn } from "./en/rag-ingestion";
import { batchReview as batchReviewEn } from "./en/batch-review";
import { deadLetters as deadLettersEn } from "./en/dead-letters";
import { matrixRooms as matrixRoomsEn } from "./en/matrix-rooms";
import { mcpTool as mcpToolEn } from "./en/mcp-tool";
import { testsPromotion as testsPromotionEn } from "./en/tests-promotion";

export const useCases: UseCaseMeta[] = [
  coldRoom,
  topicPerPipeline,
  onSite,
  musicSpur,
  padShortcuts,
  printScan,
  signedWebhooks,
  matrixRooms,
  polledDatabase,
  deadLetters,
  odataConnector,
  communityNode,
  ordersReview,
  batchReview,
  changingProduction,
  testsPromotion,
  assistantDrafts,
  ragIngestion,
  mcpTool,
  outsideAgent,
  manyTenants,
];

export const textEn: Record<string, UseCaseText> = {
  "cold-room": coldRoomEn,
  "on-site": onSiteEn,
  "signed-webhooks": signedWebhooksEn,
  "polled-database": polledDatabaseEn,
  "orders-review": ordersReviewEn,
  "changing-production": changingProductionEn,
  "assistant-drafts": assistantDraftsEn,
  "outside-agent": outsideAgentEn,
  "many-tenants": manyTenantsEn,
  "topic-per-pipeline": topicPerPipelineEn,
  "music-spur": musicSpurEn,
  "pad-shortcuts": padShortcutsEn,
  "odata-connector": odataConnectorEn,
  "community-node": communityNodeEn,
  "print-scan": printScanEn,
  "rag-ingestion": ragIngestionEn,
  "batch-review": batchReviewEn,
  "dead-letters": deadLettersEn,
  "matrix-rooms": matrixRoomsEn,
  "mcp-tool": mcpToolEn,
  "tests-promotion": testsPromotionEn,
};

/** Five ideas behind every scenario, and the use cases that show each best (How it works). */
export const ideas = [
  { part: "cell", best: ["many-tenants", "cold-room"] },
  { part: "protected-cell", best: ["changing-production", "cold-room"] },
  { part: "promotion", best: ["changing-production", "tests-promotion"] },
  { part: "gateway", best: ["cold-room", "community-node", "many-tenants"] },
  { part: "bus", best: ["topic-per-pipeline", "polled-database"] },
] as const;

export const otherParts = ["bridge", "tracing", "review", "audit", "mcp", "assistant", "registry", "spur"] as const;
