import React, { useEffect, useRef } from "react";
import { useLanguage } from "../i18n";
import Icon from "./Icon";
import { money, WineImage } from "./WineItem";
import WinePurchase from "./WinePurchase";

export default function WineQuickView({ item, opener, onClose }) {
  const dialog = useRef(null);
  const { t, language } = useLanguage();
  useEffect(() => {
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [opener]);
  return <dialog ref={dialog} className="wine-quick-view" aria-labelledby="quick-view-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    if (event.target !== dialog.current) return;
    const rect = dialog.current.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
  }}>
    <button autoFocus className="quick-view-close header-icon-link" aria-label={t("close")} onClick={onClose}><Icon name="close" /></button>
    <div className="quick-view-image"><WineImage item={item} /></div>
    <p className="eyebrow">{t(item.type.toLowerCase())}</p>
    <h2 id="quick-view-title">{item.name.replace(/"/g, "")}</h2>
    <dl className="quick-view-facts">
      <dt>{t("regions")}</dt><dd>{item.region.join(" · ")}</dd>
      <dt>{t("grapes")}</dt><dd>{item.grapeSort.join(" · ")}</dd>
      {item.production && <><dt>{t("producer")}</dt><dd>{item.production}</dd></>}
    </dl>
    <p>{item.volume} L · {item.alcohol}% ABV</p>
    {typeof item.tastingNotes === "string" && item.tastingNotes.trim() && <section><h3>{t("tastingNotes")}</h3><p>{item.tastingNotes}</p></section>}
    {typeof item.foodPairings === "string" && item.foodPairings.trim() && <section><h3>{t("foodPairings")}</h3><p>{item.foodPairings}</p></section>}
    <div className="quick-view-purchase"><strong>{money(item.price, language)}</strong><WinePurchase item={item} /></div>
    <p className="quick-view-demo">{t("demo")}</p>
  </dialog>;
}
