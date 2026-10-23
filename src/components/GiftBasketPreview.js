import React from "react";
import { WineImage } from "./WineItem";
import { GIFT_BASKETS } from "../data/gifts";
import { useLanguage } from "../i18n";

export default function GiftBasketPreview({ presentation, wines = [], onChoose, decorative = false }) {
  const { t } = useLanguage();
  const config = GIFT_BASKETS[presentation];
  const source = `/images/gift-base-${presentation}.webp`;
  return <div className={`basket-preview basket-preview-${presentation}`} style={{aspectRatio:config.aspect}} aria-hidden={decorative || undefined}>
    <img className="basket-back" src={source} alt={decorative ? "" : `${t("giftPresentation")} ${presentation}`} width="1000" height={presentation === 2 ? 625 : 1000} loading="lazy" />
    {wines.slice(0,config.slots).map((wine,index) => {
      const position = config.bottles[index];
      const style = {...position, transform:`rotate(${position.rotate})`};
      delete style.rotate;
      return onChoose ? <button key={index} className="basket-bottle" style={style} type="button" onClick={() => onChoose(index)} aria-label={`${t("giftChoose")} ${index + 1}: ${wine.name}`}><WineImage key={wine.id} item={wine} /></button> : <div key={index} className="basket-bottle" style={style}><WineImage key={wine.id} item={wine} /></div>;
    })}
    {config.rim && <img className="basket-rim" src={source} style={{clipPath:config.rim}} alt="" width="1000" height={presentation === 2 ? 625 : 1000} loading="lazy" />}
  </div>;
}
