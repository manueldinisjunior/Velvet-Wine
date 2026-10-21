import PrivacySettings from "./PrivacySettings";
import Icon from "./Icon";
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
      <p>{t("footerFirst")}<br />{t("footerSecond")}</p>
      <Link className="footer-contact" to="/kontakt">{t("contact")} <Icon name="external" /></Link>
    </div>
    <div className="footer-bottom footer-business">
      <div className="social-links">
        {[["Instagram","https://www.instagram.com/"],["Facebook","https://www.facebook.com/"],["Pinterest","https://www.pinterest.com/"]].map(([name,url])=><a key={name} href={url} rel="nofollow noopener noreferrer" target="_blank">{name} <span aria-hidden="true"><Icon name="external" /></span></a>)}
      </div>
      <nav className="footer-legal" aria-label={t("imprint")}>{legalLinks.map(([url,key])=><Link key={url} to={"/"+url}>{t(key)}</Link>)}</nav>
      <div className="footer-privacy"><PrivacySettings /></div>
      <p className="footer-demo">{t("demo")}</p>
      <div className="footer-meta"><span>{t("allRightsReserved")} © {new Date().getFullYear()}</span><a className="developer-credit" href="https://manueldinisjunior.de/" rel="noopener noreferrer">Developed by manueldinisjunior.de <Icon name="external" /></a></div>
    </div>
    <BackToTop />
  </footer>;
}
