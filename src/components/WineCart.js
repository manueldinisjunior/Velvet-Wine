import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CartWineItem from "./CartWineItem";
import CartResultBlock from "./CartResultBlock";
export default function WineCart() {
  const cart = useSelector((state) => state.wines.cart);
  return (
    <main id="main" className="cart-page">
      <Link to="/" className="back-link">
        ← Back to the collection
      </Link>
      <p className="eyebrow">Good choices</p>
      <h1>
        Your <em>wine bag.</em>
      </h1>
      <p>
        {cart.reduce((sum, entry) => sum + entry.amount, 0)} bottles, ready for
        your next moment.
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
