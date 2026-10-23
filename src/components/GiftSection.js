import React from "react";
import { useSelector } from "react-redux";
import GiftBasketPreview from "./GiftBasketPreview";
import { giftWines } from "../data/gifts";
import { Link } from "react-router-dom";
import useGiftCarousel from "../hooks/useGiftCarousel";
import Icon from "./Icon";
import { useLanguage } from "../i18n";

export default function GiftSection() {
  const { t } = useLanguage();
  const wines = useSelector(state => state.wines.initialData) || [];
  const { ref, presentation, interactions } = useGiftCarousel();
  return <section className="gift-section" aria-labelledby="gift-title" id="geschenke">
    <div className="gift-teaser-inner">
      <div className="gift-teaser-carousel" ref={ref} {...interactions} tabIndex={0} role="region" aria-label={t("gifts")}><GiftBasketPreview presentation={presentation} wines={giftWines(presentation, [], wines)} /></div>
      <div className="gift-teaser-copy">
        <p className="eyebrow">{t("giftEyebrow")}</p>
        <h2 id="gift-title">{t("giftTitle")}</h2>
        <p>{t("giftPageIntro")}</p>
        <Link className="button" to="/geschenke">{t("giftDiscover")} <Icon name="external" /></Link>
      </div>
    </div>
  </section>;
}
