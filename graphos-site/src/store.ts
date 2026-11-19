// What the page remembers, where the browser allows it; the page works the same where it does not.
// The theme shares its key with every pomentum.dev page, so a pick made on one holds on the others.
const THEME = "graphos-theme";
const VISITED = "graphos-use-cases-visited";

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode or blocked storage: nothing is kept */
  }
}

export type Theme = "dark" | "light";
export const loadTheme = (): Theme => {
  const asked = /[?&]theme=(light|dark)/.exec(location.search)?.[1];
  return (asked ?? read(THEME)) === "light" ? "light" : "dark";
};
export const saveTheme = (t: Theme) => write(THEME, t);

export function loadVisited(): string[] {
  try {
    const v = JSON.parse(read(VISITED) ?? "[]");
    return Array.isArray(v) ? v.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}
export function addVisited(slug: string): string[] {
  const now = loadVisited();
  if (!now.includes(slug)) now.push(slug);
  write(VISITED, JSON.stringify(now));
  return now;
}
