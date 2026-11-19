import { createContext, useContext } from "react";

export type View = "iso" | "flat";
const KEY = "syrmos-use-cases-view";

export function loadView(): View {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "flat" || saved === "iso") return saved;
  } catch {
    /* nothing kept: choose below */
  }
  // on a phone the flat drawing reads better; the 3D one stays a click away
  return typeof matchMedia !== "undefined" && matchMedia("(max-width: 600px)").matches ? "flat" : "iso";
}
export function saveView(v: View) {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* not kept */
  }
}

export const ViewContext = createContext<{ view: View; setView: (v: View) => void }>({ view: "iso", setView: () => undefined });
export const useView = () => useContext(ViewContext);
