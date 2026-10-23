import React from "react";
import { Link } from "react-router-dom";
import useGiftCarousel from "../hooks/useGiftCarousel";
import Icon from "./Icon";
import { useLanguage } from "../i18n";

export default function GiftSection() {
  const { t } = useLanguage();
  const { ref, presentation, interactions } = useGiftCarousel();
  return <section className="gift-section" aria-labelledby="gift-title" id="geschenke">
    <div className="gift-teaser-inner">
      <div className="gift-teaser-carousel" ref={ref} {...interactions} tabIndex={0} role="region" aria-label={t("gifts")}><img key={presentation} src={`/images/gift-reference-${presentation}${presentation === 1 ? "-single" : ""}.webp`} alt={`${t("giftPresentation")} ${presentation}`} width="800" height="800" loading="lazy" /></div>
      <div className="gift-teaser-copy">
        <p className="eyebrow">{t("giftEyebrow")}</p>
        <h2 id="gift-title">{t("giftTitle")}</h2>
        <p>{t("giftPageIntro")}</p>
        <Link className="button" to="/geschenke">{t("giftDiscover")} <Icon name="external" /></Link>
      </div>
    </div>
  </section>;
}
