import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import WineShopBanner from "../components/WineShopBanner";
import WineItem from "../components/WineItem";
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
  return <Catalog key={pathname} country={pathname.slice(1)} />;
};
function Catalog({ country }) {
  const { initialData, dataLoadState, dataLoadError } = useSelector(
    (state) => state.wines,
  );
  const dispatch = useDispatch();
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [limit, setLimit] = useState(12);
  const wines = selectWines(initialData || [], country, type, query, sort);
  function reset() {
    setType("all");
    setQuery("");
    setSort("featured");
    setLimit(12);
  }
  return (
    <main id="main">
      <WineShopBanner />
      <div className="flavour-strip" aria-hidden="true">
        <span>BOLD REDS</span>✳<span>BRIGHT WHITES</span>✳
        <span>NEW FAVOURITES</span>✳<span>VELVET MOMENTS</span>
      </div>
      <section
        className="collection"
        id="collection"
        aria-labelledby="collection-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Find your flavour</p>
            <h2 id="collection-title">
              Your next <em>favourite.</em>
            </h2>
          </div>
          <p>
            Different places. Distinct personalities.
            <br />
            One delicious place to start.
          </p>
        </div>
        <nav className="region-links" aria-label="Wine regions">
          {[
            ["", "All regions"],
            ["italy", "Italy"],
            ["france", "France"],
            ["spain", "Spain"],
            ["new-world", "New World"],
          ].map(([value, label]) => (
            <Link
              key={value}
              className={country === value ? "selected" : ""}
              aria-current={country === value ? "page" : undefined}
              to={`/${value}#collection`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="collection-controls">
          <div className="filter-tabs" aria-label="Wine style">
            {[
              ["all", "All wines"],
              ["red", "Reds"],
              ["white", "Whites"],
              ["pink", "Rosé"],
            ].map(([value, label]) => (
              <button
                key={value}
                aria-pressed={type === value}
                onClick={() => {
                  setType(value);
                  setLimit(12);
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="search-sort">
            <label className="search">
              <span className="sr-only">Search wines</span>
              <input
                type="search"
                placeholder="Search wine, grape, region…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setLimit(12);
                }}
              />
            </label>
            <label>
              <span className="sr-only">Sort wines</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="rating">Highest rated</option>
              </select>
            </label>
          </div>
        </div>
        {dataLoadState === 1 && (
          <p role="status">Finding your next favourite…</p>
        )}
        {dataLoadError && (
          <p className="catalog-notice">
            {dataLoadState === 2
              ? "Showing our saved collection. Live availability could not be loaded."
              : "The collection could not be loaded."}{" "}
            <button onClick={() => dispatch(winesLoad)}>Try again</button>
          </p>
        )}
        {dataLoadState === 2 && (
          <>
            <p className="result-count" role="status">
              {wines.length} wines to discover
            </p>
            <div className="wine-grid">
              {wines.slice(0, limit).map((item) => (
                <WineItem key={item.id} item={item} />
              ))}
            </div>
            {!wines.length && (
              <div className="empty-state">
                <h3>No bottles found.</h3>
                <p>Try another grape, region or wine style.</p>
                <button className="button" onClick={reset}>
                  Reset filters
                </button>
              </div>
            )}
            {wines.length > limit && (
              <div className="load-more">
                <p>
                  Showing {Math.min(limit, wines.length)} of {wines.length}
                </p>
                <button
                  className="button button-outline"
                  onClick={() => setLimit(limit + 12)}
                >
                  Discover more ↓
                </button>
              </div>
            )}
          </>
        )}
      </section>
      <section id="story" className="story">
        <div>
          <p className="eyebrow">The Velvet spirit</p>
          <h2>
            Less ceremony.
            <br />
            <em>More discovery.</em>
          </h2>
        </div>
        <div>
          <p>
            Wine doesn’t need to be complicated. Explore a new region, find a
            grape you love, or bring something different to the table.
          </p>
          <Link className="button button-light" to="/france#collection">
            Explore the collection ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
