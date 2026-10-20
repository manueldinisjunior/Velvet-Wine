import React, { createContext, useContext, useEffect, useState } from "react";
import messages from "./messages.json";
export const languages = {
  de: "Deutsch",
  en: "English",
  nl: "Nederlands",
  sv: "Svenska",
  nb: "Norsk bokmål",
  fr: "Français",
  it: "Italiano",
  es: "Español",
  pt: "Português",
  ru: "Русский",
  "zh-Hans": "简体中文",
};
const Context = createContext({
  language: "de",
  t: (key) => messages.de[key],
  setLanguage: () => {},
});
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem("velvet-language");
      return languages[saved] ? saved : "de";
    } catch {
      return "de";
    }
  });
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const choose = (value) => {
    if (!languages[value]) return;
    setLanguage(value);
    try {
      localStorage.setItem("velvet-language", value);
    } catch {}
  };
  const t = (key) => messages[language][key] ?? messages.de[key] ?? key;
  return (
    <Context.Provider value={{ language, setLanguage: choose, t }}>
      {children}
    </Context.Provider>
  );
}
export const useLanguage = () => useContext(Context);
