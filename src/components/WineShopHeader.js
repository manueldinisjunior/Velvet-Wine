import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { languages, useLanguage } from "../i18n";
export default function WineShopHeader() {
  const { t, language, setLanguage } = useLanguage();
  const count = useSelector((state) =>
    state.wines.cart.reduce((sum, entry) => sum + entry.amount, 0),
  );
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  return (
    <>
      <div id="top" tabIndex={-1} className="announcement">
        {t("responsible")}
      </div>
      <header className="site-header">
        <Link
          to="/"
          className="wordmark"
          aria-label={`Velvet Essence · ${t("home")}`}
        >
          velvet<span>essence</span>
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? t("close") + " ×" : t("menu") + " ☰"}
        </button>
        <nav
          id="navigation"
          className={open ? "navigation is-open" : "navigation"}
          aria-label={t("menu")}
          onClick={() => setOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              document.querySelector(".menu-toggle")?.focus();
            }
          }}
        >
          {[
            ["/", "home"],
            ["/weinladen", "store"],
            ["/ueber-uns", "about"],
            ["/weinwissen", "guide"],
            ["/kontakt", "contact"],
          ].map(([url, key]) => (
            <Link
              key={url}
              to={url}
              aria-current={pathname === url ? "page" : undefined}
            >
              {t(key)}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
        <label className="language-picker">
          <span className="sr-only">{t("language")}</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {Object.entries(languages).map(([value, label]) => (
              <option key={value} value={value} lang={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <Link
          to="/cart"
          className="bag-link"
          aria-label={`Cart, ${count}`}
        >
          <span className="bag-name">Cart</span>
          <span aria-live="polite">{count}</span>
        </Link>
        </div>
      </header>
    </>
  );
}
