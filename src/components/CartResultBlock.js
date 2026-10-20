import Icon from "./Icon";
import { useLanguage } from "../i18n";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ref, push, set } from "firebase/database";
import { clearCart } from "../redux/winesSlice";
import database from "../firebase-config";
import { money } from "./WineItem";
export default function CartResultBlock() {
  const { t, language } = useLanguage();
  const cart = useSelector((state) => state.wines.cart);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("idle");
  const total = cart.reduce(
    (sum, entry) => sum + entry.amount * entry.item.price,
    0,
  );
  async function submit() {
    if (status === "sending" || !cart.length) return;
    setStatus("sending");
    try {
      await set(
        push(ref(database, "orders")),
        cart.map(({ item, amount }) => ({
          name: item.name,
          id: item.id,
          amount,
        })),
      );
      dispatch(clearCart());
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }
  if (!cart.length)
    return (
      <div className="empty-state">
        <h2>{status === "success" ? t("saved") : t("emptyCart")}</h2>
        <p>{status === "success" ? t("demo") : t("intro")}</p>
        <Link className="button" to="/weinladen">
          {t("explore")} <Icon name="external" />
        </Link>
      </div>
    );
  return (
    <aside className="order-summary">
      <p className="eyebrow">{t("cart")}</p>
      <h2>{t("cart")}</h2>
      <div className="subtotal">
        <span>{t("total")}</span>
        <strong>{money(total, language)}</strong>
      </div>
      <p>{t("demo")}</p>
      <button
        className="button"
        disabled={status === "sending"}
        onClick={submit}
      >
        {status === "sending" ? t("saving") : t("request")}
      </button>
      {status === "error" && <p role="alert">{t("error")}</p>}
      <Link to="/weinladen">{t("explore")}</Link>
    </aside>
  );
}
