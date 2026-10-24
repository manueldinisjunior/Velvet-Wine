import React from "react";
import { WineImage } from "./WineItem";
import { GIFT_BASKETS } from "../data/gifts";
import { useLanguage } from "../i18n";

export default function GiftBasketPreview({ presentation, wines = [], onChoose, decorative = false }) {
  const { t } = useLanguage();
  const config = GIFT_BASKETS[presentation];
  return <div className={`basket-preview basket-preview-${presentation}`} aria-hidden={decorative || undefined}>
    <img className="basket-back" src={`/images/gift-base-${presentation}.webp`} alt={decorative ? "" : `${t("giftPresentation")} ${presentation}`} width="1000" height={presentation === 2 ? 625 : 1000} loading="lazy" />
    <div className="basket-products">
      {wines.slice(0, config.slots).map((wine, index) => onChoose
        ? <button key={index} className="basket-bottle" type="button" onClick={() => onChoose(index)} aria-label={`${t("giftChoose")} ${index + 1}: ${wine.name}`}><WineImage key={wine.id} item={wine} highResolution /></button>
        : <div key={index} className="basket-bottle"><WineImage key={wine.id} item={wine} highResolution /></div>)}
    </div>
  </div>;
}
