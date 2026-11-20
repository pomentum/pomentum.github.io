// What a reader worries about, and the walkthrough that answers it: the site's main way in. A problem's question, what Syrmos
// does, and its before and after are that walkthrough's own situation, context and metrics (content/en/<slug>.ts).

export type ProblemId = "apart" | "change" | "nothing-lost" | "person" | "connect" | "ai" | "on-site";

// each with the one line its card shows: the everyday situation, in the reader's words
export const problems: { id: ProblemId; slug: string; card: string }[] = [
  { id: "apart", slug: "customers-apart", card: "One customer's mistake, or its code, never reaches another's." },
  { id: "change", slug: "change-safely", card: "Try a change first, approve it, and go back if it misfires." },
  { id: "nothing-lost", slug: "nothing-lost", card: "A failed batch is kept, and sent again once fixed." },
  { id: "person", slug: "person-decides", card: "Large orders and batches wait for a person; the rest goes straight through." },
  { id: "connect", slug: "connect-services", card: "Chat, code hosting, an ERP: each reached with a password the automation never sees." },
  { id: "ai", slug: "ai-helps", card: "Draft or fix an automation with AI; it never changes production by itself." },
  { id: "on-site", slug: "beside-the-machines", card: "The show keeps running on the venue's machine when the internet drops." },
];

/** A walkthrough's card line. */
export const cardOf = (slug: string): string | undefined => problems.find((p) => p.slug === slug)?.card;

/** The walkthrough that answers a problem. */
export const slugOf = (id: string): string => problems.find((p) => p.id === id)?.slug ?? id;

/** The one story to start with: every promise in one walkthrough. */
export const tour = {
  slug: "cold-room",
  title: "Start with one story: cold room alerts",
  line: "Fridges report their temperatures; when one warms up, the person on call is told, and nobody can change that alert unchecked.",
};

export const problemWords = {
  stepFrom: "This step:",
};
