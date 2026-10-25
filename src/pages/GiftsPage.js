import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../i18n";
import { money, WineImage } from "../components/WineItem";
import WineQuickView from "../components/WineQuickView";
import useGiftCarousel, { GIFT_PRESENTATIONS } from "../hooks/useGiftCarousel";
import GiftBasketPreview from "../components/GiftBasketPreview";
import { giftWines, makeGiftBundle } from "../data/gifts";
import Icon from "../components/Icon";
import { winesLoad } from "../redux/winesLoad";

export default function GiftsPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const { initialData, dataLoadState, dataLoadError } = useSelector(state => state.wines);
  const wines = initialData || [];
  const [selections, setSelections] = useState({});
  const [quickView, setQuickView] = useState(null);
  const [choosingWine, setChoosingWine] = useState(false);
  const { ref, presentation, setPresentation, interactions } = useGiftCarousel(Boolean(quickView) || choosingWine);
  const selected = giftWines(presentation, selections[presentation], wines);
  useEffect(() => { document.title = `${t("gifts")} · Velvet Essence`; }, [t]);
  const bundle = makeGiftBundle(presentation, selected, t("gifts"));
  function chooseWine(index, id) {
    setSelections(current => ({ ...current, [presentation]: selected.map((wine, slot) => slot === index ? id : String(wine.id)) }));
  }
  return <main id="main" tabIndex={-1} className="gifts-page">
    <header className="gifts-intro">
      <p className="eyebrow">Velvet Essence</p>
      <h1>{t("giftTitle")}</h1>
      <p>{t("giftPageIntro")}</p>
    </header>
    <div className="gifts-layout">
      <div className="gifts-gallery" ref={ref} {...interactions}>
        <div className="gifts-featured" role="group" aria-label={`${t("giftPresentation")} ${presentation}`}><GiftBasketPreview presentation={presentation} wines={selected} onChoose={index => document.getElementById(`gift-wine-${index}`)?.focus()} /></div>
        <fieldset className="gift-thumbnails">
          <legend>{t("giftPresentation")}</legend>
          <div>{GIFT_PRESENTATIONS.map(number => <button type="button" key={number} aria-pressed={presentation === number} aria-label={`${t("giftPresentation")} ${number}`} onClick={() => setPresentation(number)}><GiftBasketPreview presentation={number} wines={giftWines(number,selections[number],wines)} decorative /><span>{String(number).padStart(2, "0")}</span></button>)}</div>
        </fieldset>
        <p className="gift-note">{t("giftReferenceNote")}</p>
      </div>
      <section className="gift-builder" aria-labelledby="gift-builder-title">
        <p className="eyebrow">{t("gifts")} / {String(presentation).padStart(2,"0")}</p>
        <h2 id="gift-builder-title">{t("giftChoose")}</h2>
        {dataLoadState !== 2 && <p role="status">{t("loading")}</p>}
        {dataLoadError && <p className="catalog-notice">{t("offline")} <button onClick={() => dispatch(winesLoad)}>{t("retry")}</button></p>}
        {bundle ? <>
          {selected.map((wine,index) => <div className="gift-wine-choice" key={index}>
            <div className="gift-wine-photo"><WineImage key={wine.id} item={wine} highResolution cutout /></div>
            <label htmlFor={`gift-wine-${index}`}>{t("giftWineLabel")} {index + 1}</label>
            <select onFocus={() => setChoosingWine(true)} onBlur={() => setChoosingWine(false)} id={`gift-wine-${index}`} value={String(wine.id)} onChange={event => chooseWine(index,event.target.value)}>{wines.map(option => <option key={option.id} value={String(option.id)}>{option.name.replace(/"/g, "")} · {money(option.price, language)}</option>)}</select>
          </div>)}
          <div aria-live="polite" aria-atomic="true">
            <dl className="gift-price-breakdown">{selected.map((wine,index) => <React.Fragment key={index}><dt>{wine.name.replace(/"/g, "")}</dt><dd>{money(wine.price, language)}</dd></React.Fragment>)}<dt>{t("giftComponents")}</dt><dd>{money(10, language)}</dd><dt>{t("giftTotal")}</dt><dd>{money(bundle.price, language)}</dd></dl>
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
