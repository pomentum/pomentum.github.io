import type { UseCaseMeta } from "../types";
import { api, caller, db, intoApi, outside, row, tenant } from "./kit";

// Many teams, one service: tenants registered by an admin or a user allowed to create them, grants to the provider's groups,
// OpenID Connect sign-on, 15-minute tokens, an audit log that names the person, secrets sealed at rest. Sources (graphos main):
// docs/index.html (At a glance, FAQ), docs/guide/usage.md §2–3, sso.md, installation.md, features.md.

const base = ["person", "app", "api", "db", "t-red", "t-blue", "r1", "r2", "idp"];

export const tenantsSso: UseCaseMeta = {
  slug: "tenants-sso",
  kind: "platform",
  status: "target",
  thumb: 3,
  metrics: ["who", "token", "secrets"],
  parts: ["access", "tenant", "audit", "api"],
  related: ["many-services", "mcp-agents", "leave-anytime"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      caller("person", "person", "an analyst", 0, "signs in with your provider"),
      caller("app", "box", "an internal app", 1, "forwards the person's token"),
      caller("admin", "reviewer", "an admin", 2),
      api("users · grants · OpenID Connect"),
      db(),
      tenant("t-red", "team_red", 0),
      tenant("t-blue", "team_blue", 1),
      row("r1", "grant: oidc-group:red · write", 0, 0, 0),
      row("r2", "grant: oidc-group:blue · read", 1, 0, 0),
      outside("idp", "key", "your identity provider", 0, "OpenID Connect"),
      { id: "token", kind: "pill", x: 600, y: 140, w: 180, h: 26, label: "token · 15 minutes" },
      { id: "audit", kind: "pill", x: 744, y: 300, w: 200, h: 26, label: "audit: the analyst" },
      { id: "vault", kind: "pill", x: 744, y: 440, w: 200, h: 26, label: "keys sealed · AES-256-GCM", tone: "protected" },
      { id: "shared", kind: "panel", x: 250, y: 196, w: 480, h: 290, label: "one service account", sub: "every audit line says the same name", tone: "danger" },
    ],
    flows: [
      { id: "same", kind: "fail", pts: [[164, 235], [376, 235], [376, 300]], label: "who asked?", labelAt: 0.3 },
      { id: "register", kind: "control", pts: [[164, 385], [224, 385], [224, 104], [248, 104]], label: "POST /v1/tenants", labelAt: 0.1 },
      { id: "sso", kind: "control", pts: [[798, 85], [584, 85]], label: "sign in · PKCE", labelAt: 0.5 },
      { id: "p-api", kind: "control", pts: intoApi(0), msg: "token" },
      { id: "app-api", kind: "control", pts: intoApi(1), msg: "their token" },
      { id: "to-red", kind: "gateway", pts: [[376, 118], [376, 254]] },
      { id: "audit-l", kind: "control", pts: [[584, 100], [740, 100], [740, 313], [742, 313]] },
      { id: "vault-l", kind: "gateway", pts: [[732, 453], [742, 453]] },
    ],
    steps: [
      // 1 PROBLEM: one account for everyone
      { show: ["app", "shared", "same"], active: ["same"], state: { shared: "bad" } },
      // 2 a tenant per team
      { show: [...base, "admin", "register"], active: ["register"], state: { "t-red": "hi", "t-blue": "hi" } },
      // 3 sign in with your provider
      { show: [...base, "sso", "p-api"], active: ["sso", "p-api"], state: { idp: "ok", r1: "ok" } },
      // 4 a token that lasts 15 minutes
      { show: [...base, "token", "p-api", "to-red"], active: ["p-api", "to-red"], state: { token: "hi" } },
      // 5 the person, on the record
      { show: [...base, "audit", "app-api", "audit-l"], active: ["app-api", "audit-l"], state: { audit: "ok" } },
      // 6 secrets sealed at rest
      { show: [...base, "audit", "vault", "vault-l"], active: ["vault-l"], state: { vault: "hi" } },
    ],
  },
};
