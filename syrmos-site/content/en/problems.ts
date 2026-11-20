// What a reader worries about, and the walkthrough that answers it: the site's main way in. A problem's question, what Syrmos
// does, and its before and after are that walkthrough's own situation, context and metrics (content/en/<slug>.ts).

export type ProblemId = "apart" | "change" | "nothing-lost" | "person" | "connect" | "ai" | "on-site";

export const problems: { id: ProblemId; slug: string }[] = [
  { id: "apart", slug: "customers-apart" },
  { id: "change", slug: "change-safely" },
  { id: "nothing-lost", slug: "nothing-lost" },
  { id: "person", slug: "person-decides" },
  { id: "connect", slug: "connect-services" },
  { id: "ai", slug: "ai-helps" },
  { id: "on-site", slug: "beside-the-machines" },
];

/** The walkthrough that answers a problem. */
export const slugOf = (id: string): string => problems.find((p) => p.id === id)?.slug ?? id;

/** The one story to start with: every promise in one walkthrough. */
export const tour = {
  slug: "cold-room",
  title: "Start with one story: cold room alerts",
  line: "Fridges report their temperatures; when one warms up, the person on call is told. Eight short steps put the promises below in one place, each saying what shows it.",
};

export const problemWords = {
  stepFrom: "This step:",
  count: (n: number) => `${n} steps`,
};
