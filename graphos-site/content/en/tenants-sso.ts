import type { UseCaseText } from "../types";

export const tenantsSso: UseCaseText = {
  title: "Many teams, one service, single sign-on",
  situation: "Each team gets a graph of its own, people sign in with the company's provider, and the record says who asked.",
  team: "Platform and security teams",
  context:
    "For a team that runs graphos for others: several teams, each with its own data, and people who already have a company sign-in. With one shared service account instead, every audit line carries that account's name, and the application must keep its own record of who asked.",
  metricLabels: {
    who: "The audit log names",
    token: "A leaked token works for",
    secrets: "Signing keys at rest",
  },
  steps: [
    {
      tag: "problem",
      title: "One account for everyone",
      body: ["An internal app calls the graph with one service account for all its users. Every line of the record says the same name, and nothing shows who asked."],
      metrics: { who: "the shared account", token: "—", secrets: "—" },
    },
    {
      tag: "product",
      title: "A tenant per team",
      body: [
        "An admin registers a tenant per team with `POST /v1/tenants`, or lets a user create tenants whose names match a pattern; whoever creates one owns it.",
        "On first start, the built-in admin must change its password, at least 12 characters, before it can do anything else.",
      ],
    },
    {
      tag: "product",
      title: "Sign in with your provider",
      body: [
        "graphos signs people in with OpenID Connect: Authorization Code with PKCE, as a public client. Grants can name the provider's groups, roles or people (`oidc-group:red`), and a first sign-in creates nothing by itself.",
        "Changes to someone's groups at the provider apply at their next sign-in.",
      ],
    },
    {
      tag: "how",
      title: "Tokens that last 15 minutes",
      body: [
        "Access tokens last 900 seconds by default, settable from 60 seconds to 24 hours; the web UI and the Python client renew theirs by themselves. Five failed sign-ins lock an account for 15 minutes.",
      ],
      metrics: { token: "minutes, not months" },
    },
    {
      tag: "product",
      title: "The person, on the record",
      body: [
        "The audit log writes one JSON line per request: the method, the path, the tenant, who made it, the status and the time it took. Writes are logged by default; reads by a setting.",
        "An app in front of graphos can pass on the person's own token, so the log names the analyst, not the app.",
      ],
      metrics: { who: "the person who asked" },
    },
    {
      tag: "how",
      title: "Secrets sealed at rest",
      body: [
        "With a master key file set, graphos seals its signing keys and each session's ID token with AES-256-GCM, a key per row. Without the key, it can't open what it sealed and refuses to start.",
        "Unset, they are stored in clear, with a warning.",
      ],
      metrics: { secrets: "sealed, with a master key" },
    },
  ],
  parts: {
    access: "Tenants, levels, OpenID Connect sign-on, 15-minute tokens.",
    tenant: "A graph per team, reached only with a grant.",
    audit: "One line per request, naming the person.",
    api: "Signs people in and checks every call's grant.",
  },
  tryIt: {
    text: "The single sign-on guide registers graphos at an OpenID Connect provider, with a Keycloak example.",
    href: "https://github.com/pomentum/graphos/blob/main/docs/guide/sso.md",
    linkText: "Read the sign-on guide",
  },
  statusNote:
    "Tested: graphos's tests check that a person signs in and gets the access of their groups, that an analyst's token passed on is audited as the analyst, that resealing moves everything to the newest master key, and that the audit follows each operation's declared access; sign-on was tried by hand with Keycloak 26. The teams, groups and app drawn are examples.",
};
