import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n";
import BackToTop from "./BackToTop";
export const legalLinks = [["impressum","imprint"],["datenschutz","privacy"],["nutzungsbedingungen","terms"],["versand-zahlung","shipping"],["widerruf","withdrawal"],["barrierefreiheit","access"]];
export default function SiteFooter() {
  const { t } = useLanguage();
  return <footer id="contact">
    <div className="footer-top">
      <Link to="/" className="wordmark">velvet<span>essence</span></Link>
      <p>{t("hero")}</p>
      <BackToTop />
    </div>
    <div className="footer-bottom footer-business">
      <div className="company-details">
        <strong>Velvet Essence</strong>
        <span>Manuel Dinis Júnior</span>
        <a href="tel:+258875144228">+258 875 144 228</a>
        <a href="https://manueldinisjunior.de/" rel="noopener noreferrer">manueldinisjunior.de ↗</a>
      </div>
      <div className="social-links" aria-describedby="social-note">
        {[["Instagram","https://www.instagram.com/"],["Facebook","https://www.facebook.com/"],["Pinterest","https://www.pinterest.com/"]].map(([name,url])=><a key={name} href={url} rel="nofollow noopener noreferrer" target="_blank">{name} <span aria-hidden="true">↗</span></a>)}
      </div>
      <nav className="footer-legal" aria-label={t("imprint")}>{legalLinks.map(([url,key])=><Link key={url} to={"/"+url}>{t(key)}</Link>)}</nav>
      <p id="social-note" className="footer-note">{t("socialNote")}</p>
      <div className="footer-meta"><span>© {new Date().getFullYear()} Velvet Essence</span><span>{t("demo")}</span><span>{t("responsible")}</span></div>
    </div>
  </footer>;
}
