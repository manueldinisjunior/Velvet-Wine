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
  return (
    <section className="gift-section" aria-labelledby="gift-title" id="geschenke">
      <div className="gift-visual">
        <img className="gift-basket-art" src="/images/gift-basket.webp" alt="" width="900" height="900" loading="lazy" />
        {selected && <div className="gift-bottle" key={selected.id}><WineImage item={selected} /></div>}
        <img className="gift-basket-front" src="/images/gift-basket.webp" alt="" width="900" height="900" loading="lazy" />
        <span className="gift-seal"><Icon name="gift" size={24} />{t("giftEyebrow")}</span>
      </div>
      <div className="gift-copy">
        <p className="eyebrow">{t("giftEyebrow")}</p>
        <h2 id="gift-title">{t("giftTitle")}<br /><em>{t("giftTitleAccent")}</em></h2>
        <p className="gift-intro">{t("giftBasketText")}</p>
        {selected && <>
          <fieldset className="gift-picker">
            <legend>{t("giftChoose")}</legend>
            <div>{choices.map(wine => <button type="button" key={wine.id} aria-pressed={wine.id === selected.id} onClick={() => setSelectedId(wine.id)}>{t(wine.type.toLowerCase())}</button>)}</div>
          </fieldset>
          <div className="gift-wine-detail" aria-live="polite" aria-atomic="true">
            <p className="gift-wine-name">{selected.name.replace(/"/g, "")}</p>
            <span>{selected.region[0]} · {selected.volume} L</span>
            <strong>{money(selected.price, language)} <small>{t("giftWineOnly")}</small></strong>
          </div>
          <button type="button" className="button gift-main-action" aria-haspopup="dialog" onClick={event => onQuickView(selected, event.currentTarget)}>{t("quickView")} <Icon name="external" /></button>
        </>}
        <Link className="gift-contact" to="/kontakt">{t("giftContact")} <Icon name="external" size={18} /></Link>
        <p className="gift-caption">{t("giftTailored")}</p>
        <p className="gift-note">{t("giftIllustration")}</p>
      </div>
    </section>
  );
}
