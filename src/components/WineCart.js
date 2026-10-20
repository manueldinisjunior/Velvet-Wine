import { useLanguage } from "../i18n";
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CartWineItem from "./CartWineItem";
import CartResultBlock from "./CartResultBlock";
export default function WineCart() {
  const { t } = useLanguage();
  const cart = useSelector((state) => state.wines.cart);
  return (
    <main id="main" className="cart-page">
      <Link to="/weinladen" className="back-link">
        ← {t("store")}
      </Link>
      <p className="eyebrow">Velvet Essence</p>
      <h1>{t("cart")}</h1>
      <p>
        {cart.reduce((sum, entry) => sum + entry.amount, 0)} · {t("cart")}
      </p>
      <div className="cart-layout">
        <div>
          {cart.map((entry) => (
            <CartWineItem key={entry.item.id} {...entry} />
          ))}
        </div>
        <CartResultBlock />
      </div>
    </main>
  );
}
