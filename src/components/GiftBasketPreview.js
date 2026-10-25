import React from "react";
import { WineImage } from "./WineItem";
import { GIFT_BASKETS } from "../data/gifts";
import { useLanguage } from "../i18n";

export default function GiftBasketPreview({ presentation, wines = [], onChoose, decorative = false }) {
  const { t } = useLanguage();
  const config = GIFT_BASKETS[presentation];
  return <div className={`basket-preview basket-preview-${presentation}`} style={{aspectRatio:config.aspect, "--basket-ratio":`calc(${config.aspect})`}} aria-hidden={decorative || undefined}>
    <img className="basket-back" src={`/images/gift-base-${presentation}.webp`} alt={decorative ? "" : `${t("giftPresentation")} ${presentation}`} width="1000" height={presentation === 2 ? 625 : 1000} loading="lazy" />
    {wines.slice(0, config.slots).map((wine, index) => {
      const {rotate, ...position} = config.bottles[index];
      const style = {...position, transform:`rotate(${rotate})`};
      return onChoose
        ? <button key={index} style={style} className="basket-bottle" type="button" onClick={() => onChoose(index)} aria-label={`${t("giftChoose")} ${index + 1}: ${wine.name}`}><WineImage key={wine.id} item={wine} highResolution cutout /></button>
        : <div key={index} style={style} className="basket-bottle"><WineImage key={wine.id} item={wine} highResolution cutout /></div>;
    })}
    {config.rim && <img className="basket-rim" src={`/images/gift-base-${presentation}.webp`} style={{clipPath:config.rim}} alt="" width="1000" height={presentation === 2 ? 625 : 1000} loading="lazy" />}
  </div>;
}
