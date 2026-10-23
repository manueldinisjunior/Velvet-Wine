import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../i18n";
import { money } from "../components/WineItem";
import WineQuickView from "../components/WineQuickView";
import Icon from "../components/Icon";
import { winesLoad } from "../redux/winesLoad";

export default function GiftsPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const { initialData, dataLoadState, dataLoadError } = useSelector(state => state.wines);
  const wines = initialData || [];
  const [presentation, setPresentation] = useState(1);
  const [wineId, setWineId] = useState("");
  const [quickView, setQuickView] = useState(null);
  const selected = wines.find(wine => String(wine.id) === wineId) || wines[0];
  useEffect(() => { document.title = `${t("gifts")} · Velvet Essence`; }, [t]);
  const bundle = selected && {
    ...selected, id: `gift-${presentation}-${selected.id}`,
    name: `${t("gifts")} ${String(presentation).padStart(2, "0")} · ${selected.name}`,
    price: (Math.round(Number(selected.price) * 100) + 1000) / 100,
    giftWinePrice: Number(selected.price), giftSupplement: 10,
  };
  return <main id="main" tabIndex={-1} className="gifts-page">
    <header className="gifts-intro">
      <p className="eyebrow">Velvet Essence</p>
      <h1>{t("giftTitle")}</h1>
      <p>{t("giftPageIntro")}</p>
    </header>
    <div className="gifts-layout">
      <div className="gifts-gallery">
        <div className="gifts-featured"><img key={presentation} src={`/images/gift-reference-${presentation}.webp`} alt={`${t("giftPresentation")} ${presentation}`} width="800" height="800" /></div>
        <fieldset className="gift-thumbnails">
          <legend>{t("giftPresentation")}</legend>
          <div>{[1,2,3,4,5,6].map(number => <button type="button" key={number} aria-pressed={presentation === number} aria-label={`${t("giftPresentation")} ${number}`} onClick={() => setPresentation(number)}><img src={`/images/gift-reference-${number}.webp`} width="100" height="100" alt="" loading="lazy" /><span>{String(number).padStart(2, "0")}</span></button>)}</div>
        </fieldset>
        <p className="gift-note">{t("giftReferenceNote")}</p>
      </div>
      <section className="gift-builder" aria-labelledby="gift-builder-title">
        <p className="eyebrow">{t("gifts")} / {String(presentation).padStart(2,"0")}</p>
        <h2 id="gift-builder-title">{t("giftChoose")}</h2>
        {dataLoadState !== 2 && <p role="status">{t("loading")}</p>}
        {dataLoadError && <p className="catalog-notice">{t("offline")} <button onClick={() => dispatch(winesLoad)}>{t("retry")}</button></p>}
        {selected ? <>
          <label htmlFor="gift-wine">{t("giftWineLabel")}</label>
          <select id="gift-wine" value={String(selected.id)} onChange={event => setWineId(event.target.value)}>{wines.map(wine => <option key={wine.id} value={String(wine.id)}>{wine.name.replace(/"/g, "")} · {money(wine.price, language)}</option>)}</select>
          <div aria-live="polite" aria-atomic="true">
            <p className="gift-selected-wine">{selected.name.replace(/"/g, "")}</p>
            <p className="gift-origin">{selected.region.join(" · ")} · {selected.volume} L</p>
            <dl className="gift-price-breakdown"><dt>{t("giftWineLabel")}</dt><dd>{money(selected.price, language)}</dd><dt>{t("giftComponents")}</dt><dd>{money(10, language)}</dd><dt>{t("giftTotal")}</dt><dd>{money(bundle.price, language)}</dd></dl>
          </div>
          <button type="button" className="button gift-main-action" aria-haspopup="dialog" onClick={event => setQuickView({item:bundle,opener:event.currentTarget})}>{t("quickView")} <Icon name="external" /></button>
        </> : dataLoadState === 2 && <p role="status">{t("empty")}</p>}
        <Link className="gift-contact" to="/kontakt">{t("giftContact")} <Icon name="external" size={18} /></Link>
        <p className="gift-note">{t("giftShortNote")}</p>
      </section>
    </div>
    {quickView && <WineQuickView {...quickView} onClose={() => setQuickView(null)} />}
  </main>;
}
