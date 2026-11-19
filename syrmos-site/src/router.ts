import { useEffect, useState } from "react";

// Hash routes, each under its project's name, so the one folder can hold more projects' use cases later:
//   #/syrmos                    the home page
//   #/syrmos/use-cases          the gallery
//   #/syrmos/how, /how/<part>   How it works
//   #/syrmos/<use-case>/<step>  a step, every one linkable
// A link without the project (#/cold-room/2, as the first version wrote them) still opens, and is rewritten in place.
export const PROJECT = "syrmos";

export type Route =
  | { page: "home"; gallery?: boolean }
  | { page: "how"; part?: string }
  | { page: "case"; slug: string; step: number };

export function parse(hash: string): Route {
  let parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  if (parts[0] === PROJECT) parts = parts.slice(1);
  if (parts.length === 0) return { page: "home" };
  if (parts[0] === "use-cases") return { page: "home", gallery: true };
  if (parts[0] === "how") return { page: "how", part: parts[1] };
  const n = Number.parseInt(parts[1] ?? "1", 10);
  return { page: "case", slug: parts[0], step: Number.isFinite(n) && n > 0 ? n : 1 };
}

const at = (path = "") => `#/${PROJECT}${path}`;

export const href = {
  home: () => at(),
  gallery: () => at("/use-cases"),
  how: (part?: string) => at(part ? `/how/${part}` : "/how"),
  step: (slug: string, step = 1) => at(`/${slug}/${step}`),
};

/** The canonical hash of a route. */
function hashOf(r: Route): string {
  if (r.page === "case") return href.step(r.slug, r.step);
  if (r.page === "how") return href.how(r.part);
  return r.gallery ? href.gallery() : href.home();
}

/** Puts the project's name in an address that lacks it, without a history entry. */
function canonical(r: Route) {
  const want = hashOf(r);
  if (location.hash !== want) history.replaceState(null, "", want);
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
