import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, changeItemAmount, deleteItemFromCart } from "../redux/winesSlice";
import { useLanguage } from "../i18n";
export default function WinePurchase({ item, announce = false }) {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const amount = useSelector(state => state.wines.cart.find(entry => entry.item.id === item.id)?.amount || 0);
  const [announcement, setAnnouncement] = useState(0);
  const [added, setAdded] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  function add() {
    dispatch(addItemToCart({ item, amount: 1 }));
    setAdded(true);
    setAnnouncement(sequence => sequence + 1);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1400);
  }
  return <div className="purchase-controls">
    {announce && <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement > 0 && <span key={announcement}>{t("added")}: {item.name}. {amount}</span>}</span>}
    <button className="add-button" onClick={add} aria-label={`${t("add")}: ${item.name}`}>
      {added ? t("added") : t("add")} <span aria-hidden="true">{added ? "✓" : "+"}</span>
    </button>
    {amount > 0 && <div className="quantity">
      <button aria-label={`${t("less")}: ${item.name}`} onClick={() => {
        if (amount === 1) dispatch(deleteItemFromCart(item.id));
        else dispatch(changeItemAmount({ currentItemId: item.id, currentAmount: amount - 1 }));
      }}>−</button>
      <span>{amount}</span>
      <button onClick={add} aria-label={`${t("more")}: ${item.name}`}>+</button>
    </div>}
  </div>;
}
