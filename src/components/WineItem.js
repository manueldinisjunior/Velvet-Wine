import { useLanguage } from "../i18n";
import React, { useState, useEffect } from "react";
import { getBottleMask } from "./bottleMask";
import WinePurchase from "./WinePurchase";
export const money = (value, language = "de") =>
  new Intl.NumberFormat(language, {
    style: "currency",
    currency: "EUR",
  }).format(value);
export function WineImage({ item, highResolution = false, cutout = false }) {
  const { t } = useLanguage();
  const [failedSources, setFailedSources] = useState([]);
  const sources = [...new Set([highResolution && item.imgBig, item.imgSmall].filter(Boolean))];
  const source = sources.find(url => !failedSources.includes(url));
  const failed = !source;
  const [mask, setMask] = useState(null);
  useEffect(() => {
    let active = true;
    setMask(null);
    if (cutout && source) getBottleMask(source).then(value => { if (active) setMask(value); });
    return () => { active = false; };
  }, [cutout, source]);
  return failed ? (
    <div
      className="bottle-placeholder"
      role="img"
      aria-label={`${item.name}; ${t("image")}`}
    >
      <span>VELVET</span>
      <small>{t("image")}</small>
    </div>
  ) : (
    <img
      src={source}
      style={mask ? {maskImage:`url("${mask}")`, WebkitMaskImage:`url("${mask}")`, maskSize:"contain", WebkitMaskSize:"contain", maskRepeat:"no-repeat", WebkitMaskRepeat:"no-repeat", maskPosition:"center", WebkitMaskPosition:"center"} : undefined}
      alt={item.name}
      loading="lazy"
      width="180"
      height="240"
      decoding="async"
      onError={() => setFailedSources(previous => [...previous, source])}
    />
  );
}
export default function WineItem({ item, onQuickView }) {
  const { t, language } = useLanguage();
  return (
    <article className={`wine-card wine-${item.type.toLowerCase()}`}>
      <div className="wine-visual">
        <span className="wine-tag">{t(item.type.toLowerCase())}</span>
        <WineImage item={item} />
        <span className="wine-origin">{item.region[0]}</span>
      </div>
      <div className="wine-details">
        <p className="wine-meta">
          {item.volume} L <span>·</span> {item.alcohol}% ABV
        </p>
        <h3><button className="wine-title-button" aria-haspopup="dialog" onClick={event => onQuickView(item, event.currentTarget)} aria-label={`${t("quickView")}: ${item.name}`}>{item.name.replace(/"/g, "")}</button></h3>
        <p className="wine-grape">{item.grapeSort.join(" · ")}</p>
        <div className="wine-buy">
          <strong>{money(item.price, language)}</strong>
          <WinePurchase item={item} />
        </div>
      </div>
    </article>
  );
}
