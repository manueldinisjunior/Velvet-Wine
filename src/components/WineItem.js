import { useLanguage } from "../i18n";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  changeItemAmount,
  deleteItemFromCart,
} from "../redux/winesSlice";
export const money = (value, language = "de") =>
  new Intl.NumberFormat(language, {
    style: "currency",
    currency: "EUR",
  }).format(value);
export function WineImage({ item }) {
  const { t } = useLanguage();
  const [failed, setFailed] = useState(false);
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
      src={item.imgSmall}
      alt={item.name}
      loading="lazy"
      width="180"
      height="240"
      onError={() => setFailed(true)}
    />
  );
}
export default function WineItem({ item }) {
  const { t, language } = useLanguage();
  const amount = useSelector(
    (state) =>
      state.wines.cart.find((entry) => entry.item.id === item.id)?.amount || 0,
  );
  const dispatch = useDispatch();
  function change(delta) {
    if (!amount) dispatch(addItemToCart({ item, amount: 1 }));
    else if (amount + delta === 0) dispatch(deleteItemFromCart(item.id));
    else
      dispatch(
        changeItemAmount({
          currentItemId: item.id,
          currentAmount: amount + delta,
        }),
      );
  }
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
        <h3>{item.name.replace(/"/g, "")}</h3>
        <p className="wine-grape">{item.grapeSort.join(" · ")}</p>
        <div className="wine-buy">
          <strong>{money(item.price, language)}</strong>
          {amount ? (
            <div className="quantity">
              <button
                onClick={() => change(-1)}
                aria-label={`${t("less")}: ${item.name}`}
              >
                −
              </button>
              <span aria-live="polite">{amount}</span>
              <button
                onClick={() => change(1)}
                aria-label={`${t("more")}: ${item.name}`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              className="add-button"
              onClick={() => change(1)}
              aria-label={`${t("add")}: ${item.name}`}
            >
              {t("add")} <span>+</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
