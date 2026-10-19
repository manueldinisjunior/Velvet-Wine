import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { winesLoad } from "../redux/winesLoad";
import { updateCart } from "../redux/winesSlice";
import WineShopHeader from "./WineShopHeader";
import { PageMain } from "../pages/PageMain";
import WineCart from "./WineCart";

export default function WineShop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.wines.cart);
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    dispatch(winesLoad);
    try {
      const saved = JSON.parse(
        localStorage.getItem("nevinnyShopCartData") || "[]",
      );
      if (Array.isArray(saved))
        dispatch(
          updateCart(
            saved.filter(
              (entry) =>
                entry?.item?.id &&
                typeof entry.item.name === "string" &&
                Array.isArray(entry.item.region) &&
                Number.isFinite(entry.item.price) &&
                entry.item.price >= 0 &&
                Number.isInteger(entry.amount) &&
                entry.amount > 0,
            ),
          ),
        );
    } catch {
      /* A damaged or unavailable cache must not prevent shopping. */
    }
    setRestored(true);
  }, [dispatch]);
  useEffect(() => {
    if (restored) {
      try {
        localStorage.setItem("nevinnyShopCartData", JSON.stringify(cart));
      } catch {
        /* Storage is optional. */
      }
    }
  }, [cart, restored]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <WineShopHeader />
      <Routes>
        {["/", "/italy", "/france", "/spain", "/new-world"].map((path) => (
          <Route key={path} path={path} element={<PageMain />} />
        ))}
        <Route path="/cart" element={<WineCart />} />
        <Route
          path="*"
          element={
            <main id="main" className="empty-state">
              <h1>A little off the wine trail.</h1>
              <Link className="button" to="/">
                Explore the collection
              </Link>
            </main>
          }
        />
      </Routes>
      <footer id="contact">
        <div className="footer-top">
          <Link to="/" className="wordmark">
            velvet<span>essence</span>
          </Link>
          <p>
            Good wine.
            <br />
            Even better company.
          </p>
          <a href="tel:+258875144228">
            Let’s talk wine ↗<br />
            <small>+258 875 144 228</small>
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Velvet Essence</span>
          <span>Enjoy responsibly. For adults of legal drinking age.</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
