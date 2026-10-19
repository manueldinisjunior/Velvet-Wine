import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ref, push, set } from "firebase/database";
import { clearCart } from "../redux/winesSlice";
import database from "../firebase-config";
import { money } from "./WineItem";
export default function CartResultBlock() {
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
        <h2>
          {status === "success"
            ? "Your request has been saved."
            : "Your bag is waiting."}
        </h2>
        <p>
          {status === "success"
            ? "No payment has been taken. Delivery and payment are not available in this demo."
            : "Find a bottle that feels like you."}
        </p>
        <Link className="button" to="/">
          Explore wines ↗
        </Link>
      </div>
    );
  return (
    <aside className="order-summary">
      <p className="eyebrow">Your selection</p>
      <h2>Order summary</h2>
      <div className="subtotal">
        <span>Subtotal</span>
        <strong>{money(total)}</strong>
      </div>
      <p>
        This portfolio demo saves an order request only. It does not collect
        payment or arrange delivery.
      </p>
      <button
        className="button"
        disabled={status === "sending"}
        onClick={submit}
      >
        {status === "sending" ? "Saving request…" : "Save order request ↗"}
      </button>
      {status === "error" && (
        <p role="alert">
          We couldn’t save your request. Your bag is safe. Please try again.
        </p>
      )}
      <Link to="/">Continue exploring</Link>
    </aside>
  );
}
