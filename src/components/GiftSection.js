import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Icon from "./Icon";
import { WineImage, money } from "./WineItem";
import { useLanguage } from "../i18n";

export default function GiftSection({ onQuickView }) {
  const { t, language } = useLanguage();
  const wines = useSelector(state => state.wines.initialData) || [];
  const choices = ["red", "white", "pink"].map(type => wines.find(wine => wine.type.toLowerCase() === type)).filter(Boolean);
  const [selectedId, setSelectedId] = useState(null);
  const selected = choices.find(wine => wine.id === selectedId) || choices[0];
  const bundle = selected && { ...selected, id: `gift-${selected.id}`, name: `${t("giftEyebrow")} · ${selected.name}`, price: (Math.round(Number(selected.price) * 100) + 1000) / 100, giftWinePrice: Number(selected.price), giftSupplement: 10 };
  return (
    <section className="gift-section" aria-labelledby="gift-title" id="geschenke">
      <header className="gift-heading"><p className="eyebrow">{t("giftEyebrow")}</p><h2 id="gift-title">{t("giftTitle")}</h2></header>
      <div className="gift-visual">
        <img className="gift-basket-art" src="/images/gift-basket.webp" alt="" width="900" height="900" loading="lazy" />
        {selected && <div className="gift-bottle" key={selected.id}><WineImage item={selected} /></div>}
        <img className="gift-basket-front" src="/images/gift-basket.webp" alt="" width="900" height="900" loading="lazy" />

      </div>
      <div className="gift-copy">
        {selected && <>
          <fieldset className="gift-picker">
            <legend>{t("giftChoose")}</legend>
            <div>{choices.map(wine => <button type="button" key={wine.id} aria-pressed={wine.id === selected.id} onClick={() => setSelectedId(wine.id)}>{t(wine.type.toLowerCase())}</button>)}</div>
          </fieldset>
          <div className="gift-wine-detail" aria-live="polite" aria-atomic="true">
            <p className="gift-wine-name">{selected.name.replace(/"/g, "")}</p>
            <span>{selected.region[0]} · {selected.volume} L</span>
            <strong>{money(bundle.price, language)} <small>{t("giftIncluded")}</small></strong>
          </div>
          <button type="button" className="button gift-main-action" aria-haspopup="dialog" onClick={event => onQuickView(bundle, event.currentTarget)}>{t("quickView")} <Icon name="external" /></button>
        </>}
        <Link className="gift-contact" to="/kontakt">{t("giftContact")} <Icon name="external" size={18} /></Link>
        <p className="gift-note">{t("giftShortNote")}</p>
      </div>
    </section>
  );
}
