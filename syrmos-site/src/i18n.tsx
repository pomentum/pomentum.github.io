import { createContext, useContext } from "react";
import { ui, partText, type Ui } from "../content/en/ui";
import { textEn } from "../content";
import type { UseCaseText } from "../content/types";

// The site is in English. The words live in content/en, apart from the components.
export interface I18n {
  ui: Ui;
  text: (slug: string) => { t: UseCaseText; fallback: false } | null;
  parts: typeof partText;
}

export const i18n: I18n = {
  ui,
  text: (slug) => (textEn[slug] ? { t: textEn[slug], fallback: false } : null),
  parts: partText,
};

export const I18nContext = createContext<I18n>(i18n);
export const useI18n = () => useContext(I18nContext);
