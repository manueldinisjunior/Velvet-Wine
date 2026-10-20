import { useLanguage } from "../i18n";
import React from "react";
import { useDispatch } from "react-redux";
import { changeItemAmount, deleteItemFromCart } from "../redux/winesSlice";
import { WineImage, money } from "./WineItem";
export default function CartWineItem({ amount, item }) {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  function change(delta) {
    if (amount + delta < 1) dispatch(deleteItemFromCart(item.id));
    else
      dispatch(
        changeItemAmount({
          currentItemId: item.id,
          currentAmount: amount + delta,
        }),
      );
  }
  return (
    <article className="cart-item">
      <div className="cart-image">
        <WineImage item={item} />
      </div>
      <div>
        <h2>{item.name}</h2>
        <p>
          {item.region.join(", ")} · {item.volume} L
        </p>
        <div className="quantity">
          <button
            onClick={() => change(-1)}
            aria-label={`${t("less")}: ${item.name}`}
          >
            −
          </button>
          <span>{amount}</span>
          <button
            onClick={() => change(1)}
            aria-label={`${t("more")}: ${item.name}`}
          >
            +
          </button>
        </div>
        <button
          className="text-button"
          onClick={() => dispatch(deleteItemFromCart(item.id))}
        >
          {t("remove")} <span className="sr-only">{item.name}</span>
        </button>
      </div>
      <strong>{money(amount * item.price, language)}</strong>
    </article>
  );
}
