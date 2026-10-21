import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { languages, useLanguage } from "../i18n";

const countries = { de: "de", en: "gb", nl: "nl", sv: "se", nb: "no", fr: "fr", it: "it", es: "es", pt: "pt", ru: "ru", "zh-Hans": "cn" };
function Flag({ language }) {
  return <img className="language-flag" src={`${process.env.PUBLIC_URL}/images/flags/${countries[language]}.svg`} width="24" height="18" alt="" />;
}
export default function LanguagePicker() {
  const { t, language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const container = useRef(null);
  const trigger = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const dismiss = event => {
      if (event.type === "keydown" && event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      } else if (event.type === "pointerdown" && !container.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", dismiss);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", dismiss);
    };
  }, [open]);
  return <div className="language-control" ref={container} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <button id="language-toggle" ref={trigger} type="button" className="language-trigger" title={`${t("language")}: ${languages[language]}`} aria-label={`${t("language")}: ${languages[language]}`} aria-expanded={open} aria-controls="language-options" onClick={() => setOpen(value => !value)}>
      <Flag language={language} />
    </button>
    {open && <ul id="language-options" className="language-options" aria-label={t("language")}>
      {Object.entries(languages).map(([value, label]) => <li key={value}>
        <button type="button" lang={value} aria-pressed={language === value} onClick={() => {
          setLanguage(value);
          setOpen(false);
          trigger.current?.focus();
        }}><Flag language={value} /><span>{label}</span></button>
      </li>)}
    </ul>}
  </div>;
}
