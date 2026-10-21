import Icon from "./Icon";
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n";
export default function WineShopBanner() {
  const { t } = useLanguage();
  const headline = t("hero").split(/[.。]/).map(part => part.trim()).filter(Boolean);
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">Velvet Essence</p>
        <h1 id="hero-title">{headline[0]}.<br /><em>{headline.slice(1).join(". ")}.</em></h1>
        <p>{t("intro")}</p>
        <div className="hero-actions">
        <Link className="button button-light" to="/weinladen">
          {t("explore")} <span aria-hidden="true"><Icon name="external" /></span>
        </Link>
          <span>{t("responsible")}</span>
        </div>
      </div>
      <div className="hero-image">
        <img
          src={`${process.env.PUBLIC_URL}/images/wine-cover.jpg`}
          alt=""
          width="1200"
          height="631"
          fetchpriority="high"
        />
        <span className="hero-seal">
          VELVET
          <br />
          ESSENCE
          <br />
          <b aria-hidden="true"><Icon name="sparkle" /></b>
        </span>
      </div>
    </section>
  );
}
