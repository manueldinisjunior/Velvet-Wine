import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n";
import BackToTop from "./BackToTop";
export const legalLinks = [
  ["impressum", "imprint"],
  ["datenschutz", "privacy"],
  ["nutzungsbedingungen", "terms"],
  ["versand-zahlung", "shipping"],
  ["widerruf", "withdrawal"],
  ["barrierefreiheit", "access"],
];
export default function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer id="contact">
      <div className="footer-top">
        <Link to="/" className="wordmark">
          velvet<span>essence</span>
        </Link>
        <p>{t("hero")}</p>
        <BackToTop />
      </div>
      <div className="footer-columns">
        <nav aria-label={t("menu")}>
          {[
            ["weinladen", "store"],
            ["ueber-uns", "about"],
            ["weinwissen", "guide"],
            ["kontakt", "contact"],
          ].map(([url, key]) => (
            <Link key={url} to={"/" + url}>
              {t(key)}
            </Link>
          ))}
        </nav>
        <nav aria-label={t("imprint")}>
          {legalLinks.map(([url, key]) => (
            <Link key={url} to={"/" + url}>
              {t(key)}
            </Link>
          ))}
        </nav>
        <div>
          <div className="social-links">
            {[
              ["Instagram", "https://www.instagram.com/"],
              ["Facebook", "https://www.facebook.com/"],
              ["Pinterest", "https://www.pinterest.com/"],
            ].map(([name, url]) => (
              <a
                key={name}
                href={url}
                rel="nofollow noopener noreferrer"
                target="_blank"
              >
                {name} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
          <p className="footer-note">{t("socialNote")}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Velvet Essence</span>
        <span>{t("demo")}</span>
        <span>{t("responsible")}</span>
      </div>
    </footer>
  );
}
