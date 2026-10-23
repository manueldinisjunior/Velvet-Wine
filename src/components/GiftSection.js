import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import { useLanguage } from "../i18n";

export default function GiftSection() {
  const { t } = useLanguage();
  return <section className="gift-section" aria-labelledby="gift-title" id="geschenke">
    <div className="gift-teaser-inner">
      <img src="/images/gift-reference-1.webp" alt="" width="800" height="800" loading="lazy" />
      <div className="gift-teaser-copy">
        <p className="eyebrow">{t("giftEyebrow")}</p>
        <h2 id="gift-title">{t("giftTitle")}</h2>
        <p>{t("giftPageIntro")}</p>
        <Link className="button" to="/geschenke">{t("giftDiscover")} <Icon name="external" /></Link>
      </div>
    </div>
  </section>;
}
