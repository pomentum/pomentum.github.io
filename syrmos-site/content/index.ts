// The walkthroughs, in the order to learn Syrmos: the cold room story, then one per problem a reader has. Each problem's
// walkthrough is built from the steps of earlier walkthroughs (content/walkthroughs.ts); their old addresses redirect here.
import type { UseCaseMeta, UseCaseText } from "./types";
import { coldRoom } from "./diagrams/cold-room";
import { aiHelps, besideTheMachines, changeSafely, connectServices, customersApart, nothingLost, personDecides } from "./walkthroughs";
import { coldRoom as coldRoomEn } from "./en/cold-room";
import { customersApart as customersApartEn } from "./en/customers-apart";
import { changeSafely as changeSafelyEn } from "./en/change-safely";
import { nothingLost as nothingLostEn } from "./en/nothing-lost";
import { personDecides as personDecidesEn } from "./en/person-decides";
import { connectServices as connectServicesEn } from "./en/connect-services";
import { aiHelps as aiHelpsEn } from "./en/ai-helps";
import { besideTheMachines as besideTheMachinesEn } from "./en/beside-the-machines";

export const useCases: UseCaseMeta[] = [coldRoom, customersApart, changeSafely, nothingLost, personDecides, connectServices, aiHelps, besideTheMachines];

export const textEn: Record<string, UseCaseText> = {
  "cold-room": coldRoomEn,
  "customers-apart": customersApartEn,
  "change-safely": changeSafelyEn,
  "nothing-lost": nothingLostEn,
  "person-decides": personDecidesEn,
  "connect-services": connectServicesEn,
  "ai-helps": aiHelpsEn,
  "beside-the-machines": besideTheMachinesEn,
};

/**
 * Where each earlier walkthrough now lives: the walkthrough built from it, at the first step it gave (1-based). An old address,
 * #/use-cases/<old>/<n> or /syrmos/use-cases/<old>/, opens there.
 */
export const redirects: Record<string, { to: string; step: number }> = {
  // earlier walkthroughs no step is drawn from any more: the walkthrough that mentions them
  "on-site": { to: "beside-the-machines", step: 1 },
  "pad-shortcuts": { to: "beside-the-machines", step: 1 },
  "print-scan": { to: "beside-the-machines", step: 1 },
  ...Object.fromEntries(
    useCases.flatMap((m) =>
      (m.scenes ?? [])
        .map((s, i) => [s.from, { to: m.slug, step: i + 1 }] as const)
        .filter(([from], i, all) => all.findIndex(([f]) => f === from) === i),
    ),
  ),
};

/** Five ideas behind every scenario, and the walkthroughs that show each best (How it works). */
export const ideas = [
  { part: "cell", best: ["customers-apart", "cold-room"] },
  { part: "protected-cell", best: ["change-safely", "cold-room"] },
  { part: "promotion", best: ["change-safely", "ai-helps"] },
  { part: "gateway", best: ["cold-room", "connect-services", "customers-apart"] },
  { part: "bus", best: ["nothing-lost", "connect-services"] },
] as const;

export const otherParts = ["bridge", "tracing", "review", "audit", "mcp", "assistant", "registry", "spur"] as const;
