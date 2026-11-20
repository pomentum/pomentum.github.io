import { useEffect, useState } from "react";
import { redirects } from "../content";
import { slugOf } from "../content/en/problems";

// The app is Syrmos's page at www.pomentum.dev/syrmos/. Its routes, by hash:
//   #/                            the landing page: the name, the platform drawn, and the use cases
//   #/use-cases                   the use cases' gallery
//   #/use-cases/<use-case>/<step> a step of a walkthrough, every one linkable
//   #/how, #/how/<part>           How it works
// Older addresses still open and are rewritten in place: #/syrmos/... (when the app lived at /use-cases/) and #/<use-case>/<step>.
export type Route =
  | { page: "home"; gallery?: boolean; start?: boolean }
  | { page: "how"; part?: string }
  | { page: "case"; slug: string; step: number };

const stepOf = (s?: string) => {
  const n = Number.parseInt(s ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
};

export function parse(hash: string): Route {
  let parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  if (parts[0] === "syrmos") parts = parts.slice(1);
  if (parts.length === 0) return { page: "home" };
  if (parts[0] === "how") return { page: "how", part: parts[1] };
  if (parts[0] === "start") return { page: "home", start: true };
  if (parts[0] === "problems") return parts[1] ? { page: "case", slug: slugOf(parts[1]), step: 1 } : { page: "home", start: true };
  if (parts[0] === "use-cases") return parts[1] ? caseOf(parts[1], parts[2]) : { page: "home", gallery: true };
  return caseOf(parts[0], parts[1]);
}

/** A walkthrough at a step; an earlier walkthrough opens the one built from it, at the step it gave. */
function caseOf(slug: string, step?: string): Route {
  const moved = redirects[slug];
  return moved ? { page: "case", slug: moved.to, step: moved.step } : { page: "case", slug, step: stepOf(step) };
}

export const href = {
  home: () => "#/",
  gallery: () => "#/use-cases",
  how: (part?: string) => (part ? `#/how/${part}` : "#/how"),
  step: (slug: string, step = 1) => `#/use-cases/${slug}/${step}`,
  start: () => "#/start",
};

/** The canonical hash of a route. */
function hashOf(r: Route): string {
  if (r.page === "case") return href.step(r.slug, r.step);
  if (r.page === "how") return href.how(r.part);
  if (r.start) return href.start();
  return r.gallery ? href.gallery() : href.home();
}

/** Rewrites an older or partial address to the canonical one, without a history entry. */
function canonical(r: Route) {
  const want = hashOf(r);
  if (location.hash !== want && !(want === "#/" && location.hash === "")) history.replaceState(null, "", want);
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parse(location.hash));
  useEffect(() => {
    canonical(route);
    const on = () => {
      const r = parse(location.hash);
      canonical(r);
      setRoute(r);
    };
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return route;
}

/** Moves to another step without a history entry per arrow press. */
export function replaceHash(h: string) {
  history.replaceState(null, "", h);
  dispatchEvent(new HashChangeEvent("hashchange"));
}
