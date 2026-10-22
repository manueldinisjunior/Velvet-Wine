import GiftSection from "../components/GiftSection";
import FlavourTicker from "../components/FlavourTicker";
import Icon from "../components/Icon";
import { useLanguage } from "../i18n";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import WineShopBanner from "../components/WineShopBanner";
import WineItem from "../components/WineItem";
import WineQuickView from "../components/WineQuickView";
import { winesLoad } from "../redux/winesLoad";

export function selectWines(wines, country, type, query, sort) {
  const result = wines.filter((wine) => {
    const origin = wine.region[0].toLowerCase();
    const regionMatches =
      !country ||
      (country === "new-world"
        ? [
            "usa",
            "chile",
            "australia",
            "argentina",
            "new zealand",
            "south africa",
            "yar",
          ].some((value) => origin.startsWith(value))
        : origin === country);
    return (
      regionMatches &&
      (type === "all" || wine.type.toLowerCase() === type) &&
      `${wine.name} ${wine.region.join(" ")} ${wine.grapeSort.join(" ")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase())
    );
  });
  if (sort === "price-low") result.sort((a, b) => a.price - b.price);
  if (sort === "price-high") result.sort((a, b) => b.price - a.price);
  if (sort === "rating") result.sort((a, b) => b.raiting - a.raiting);
  return result;
}
export const PageMain = () => {
  const { pathname } = useLocation();
  const country = ["italy", "france", "spain", "new-world"].includes(
    pathname.slice(1),
  )
    ? pathname.slice(1)
    : "";
  return <Catalog key={pathname} country={country} home={pathname === "/"} />;
};
function Catalog({ country, home }) {
  const { t } = useLanguage();
  const location = useLocation();
  const searchRef = useRef(null);
  useEffect(() => {
    if (location.hash === "#wein-suche") {
      searchRef.current?.focus({ preventScroll: true });
      searchRef.current?.scrollIntoView({ block: "center" });
    }
  }, [location]);
  const CollectionHeading = home ? "h2" : "h1";
  const { initialData, dataLoadState, dataLoadError } = useSelector(
    (state) => state.wines,
  );
  const dispatch = useDispatch();
  const [quickView, setQuickView] = useState(null);
  const resultsRef = useRef(null);
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [limit, setLimit] = useState(12);
  useEffect(() => {
    const element = resultsRef.current;
    if (!element || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
    const animation = element.animate?.([{ opacity: 0.35 }, { opacity: 1 }], { duration: 180, easing: "ease-out" });
    return () => animation?.cancel();
  }, [type, query, sort, limit, dataLoadState]);
  const wines = selectWines(initialData || [], country, type, query, sort);
  const preserveHeight = () => {
    if (resultsRef.current) resultsRef.current.style.minHeight = `${resultsRef.current.getBoundingClientRect().height}px`;
  };
  const reset = () => {
    preserveHeight();
    setType("all");
    setQuery("");
    setSort("featured");
    setLimit(12);
  };
  return (
    <main id="main" tabIndex={-1}>
      {home && <WineShopBanner />}
      {home && <FlavourTicker />}
      <section
        className="collection"
        id="collection"
        aria-labelledby="collection-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Velvet Essence</p>
            <CollectionHeading id="collection-title"><em>{t(home ? "explore" : "store")}</em></CollectionHeading>
          </div>
          <p>{t("intro")}</p>
        </div>
        <nav className="region-links" aria-label={t("regions")}>
          {[
            ["", ""],
            ["italy", "Italia"],
            ["france", "France"],
            ["spain", "España"],
            ["new-world", "USA · Chile · Australia"],
          ].map(([value, label]) => (
            <Link
              key={value}
              className={country === value ? "selected" : ""}
              aria-current={country === value ? "page" : undefined}
              to={value ? "/" + value + "#collection" : "/weinladen#collection"}
            >
              {value ? label : t("all")}
            </Link>
          ))}
        </nav>
        <div className="collection-controls">
          <div className="filter-tabs" aria-label={t("store")}>
            {["all", "red", "white", "pink"].map((value) => (
              <button
                key={value}
                aria-pressed={type === value}
                onClick={() => {
                  preserveHeight();
                  setType(value);
                  setLimit(12);
                }}
              >
                {t(value)}
              </button>
            ))}
          </div>
          <div className="search-sort">
            <label className="search">
              <span className="sr-only">{t("search")}</span>
              <input
                id="wein-suche"
                ref={searchRef}
                type="search"
                placeholder={t("search")}
                value={query}
                onChange={(e) => {
                  preserveHeight();
                  setQuery(e.target.value);
                  setLimit(12);
                }}
              />
            </label>
            <label>
              <span className="sr-only">{t("featured")}</span>
              <select value={sort} onChange={(e) => { preserveHeight(); setSort(e.target.value); }}>
                {[
                  ["featured", "featured"],
                  ["price-low", "low"],
                  ["price-high", "high"],
                  ["rating", "rating"],
                ].map(([value, key]) => (
                  <option key={value} value={value}>
                    {t(key)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        {dataLoadState !== 2 && <>
          <p role="status">{t("loading")}</p>
          <div className="wine-grid" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <div className="wine-card wine-skeleton" key={index}><div className="wine-visual skeleton-bottle" /><div className="wine-details"><p className="wine-meta skeleton-text">&nbsp;</p><h3 className="skeleton-text">&nbsp;</h3><p className="wine-grape skeleton-text">&nbsp;</p><div className="wine-buy"><div className="skeleton-price" /></div></div></div>)}</div>
        </>}
        {dataLoadError && (
          <p className="catalog-notice">
            {t("offline")}{" "}
            <button onClick={() => dispatch(winesLoad)}>{t("retry")}</button>
          </p>
        )}
        {dataLoadState === 2 && (
          <div ref={resultsRef} className="catalog-results">
            <p className="result-count" role="status">
              {wines.length} {t("count")}
            </p>
            <div className="wine-grid wine-results">
              {wines.slice(0, limit).map((item) => (
                <WineItem key={item.id} item={item} onQuickView={(wine, opener) => setQuickView({ item: wine, opener })} />
              ))}
            </div>
            {!wines.length && (
              <div className="empty-state">
                <h3>{t("empty")}</h3>
                <button className="button" onClick={reset}>
                  {t("reset")}
                </button>
              </div>
            )}
            {wines.length > limit && (
              <div className="load-more">
                <p>
                  {Math.min(limit, wines.length)} / {wines.length}
                </p>
                <button
                  className="button button-outline"
                  onClick={() => setLimit(limit + 12)}
                >
                  {t("load")} <Icon name="down" />
                </button>
              </div>
            )}
          </div>
        )}
      </section>
      {quickView && <WineQuickView {...quickView} onClose={() => setQuickView(null)} />}
      <GiftSection />
      <section id="story" className="story">
        <div>
          <p className="eyebrow">Velvet Essence</p>
          <h2>{t("spiritFirst")}<br /><em>{t("spiritSecond")}</em></h2>
        </div>
        <div>
          <p>{t("story")}</p>
          <Link className="button button-light" to="/weinladen#collection">
            {t("explore")} <Icon name="external" />
          </Link>
        </div>
      </section>
    </main>
  );
}
