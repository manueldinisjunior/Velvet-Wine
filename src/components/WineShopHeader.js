import Icon from "./Icon";
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LanguagePicker from "./LanguagePicker";
import { useLanguage } from "../i18n";
export default function WineShopHeader() {
  const { t } = useLanguage();
  const count = useSelector((state) =>
    state.wines.cart.reduce((sum, entry) => sum + entry.amount, 0),
  );
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const menuRef = useRef(null);
  const headerRef = useRef(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event) => {
      if (event.type === "keydown" && event.key === "Escape") {
        setOpen(false);
        menuRef.current?.focus();
      } else if (event.type === "pointerdown" && !headerRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", dismiss);
    return () => {
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", dismiss);
    };
  }, [open]);
  return (
    <>
      <div id="top" tabIndex={-1} className="announcement">
        {t("responsible")}
      </div>
      <header ref={headerRef} className="site-header">
        <Link
          to="/"
          className="wordmark"
          aria-label={`Velvet Essence · ${t("home")}`}
        >
          velvet<span>essence</span>
        </Link>
        <nav
          id="navigation"
          className={open ? "navigation is-open" : "navigation"}
          aria-label={t("menu")}
          onClick={() => setOpen(false)}

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
        <LanguagePicker />
        <Link
          to="/weinladen#wein-suche"
          className="header-icon-link"
          aria-label={t("search")}
          title={t("search")}
          onClick={() => setOpen(false)}
        >
          <Icon name="search" size={23} />
        </Link>
        <Link
          to="/cart"
          className="header-icon-link header-cart"
          aria-label={`Cart, ${count}`}
          title={`Cart, ${count}`}
        >
          <Icon name="cart" size={24} />
          {count > 0 && <span className="header-cart-count" aria-hidden="true">{count > 99 ? "99+" : count}</span>}
        </Link>
        <button ref={menuRef} type="button" className="menu-toggle" aria-label={open ? t("close") : t("menu")} aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}>
          <Icon name={open ? "close" : "menu"} size={22} />
        </button>
        </div>
      </header>
    </>
  );
}
