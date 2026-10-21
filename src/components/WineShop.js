import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { winesLoad } from "../redux/winesLoad";
import { updateCart } from "../redux/winesSlice";
import WineShopHeader from "./WineShopHeader";
import { PageMain } from "../pages/PageMain";
import WineCart from "./WineCart";

import SiteFooter from "./SiteFooter";
import { ContentPage } from "../pages/ContentPages";
import { useLanguage } from "../i18n";

export default function WineShop() {
  const { t } = useLanguage();
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  useEffect(() => {
    if (
      [
        "/",
        "/weinladen",
        "/italy",
        "/france",
        "/spain",
        "/new-world",
        "/cart",
      ].includes(pathname)
    )
      document.title = `${t(pathname === "/cart" ? "cart" : pathname === "/" ? "home" : "store")} · Velvet Essence`;
  }, [pathname, t]);
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
                !String(entry.item.id).startsWith("af-") &&
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
        {t("skip")}
      </a>
      <WineShopHeader />
      <Routes>
        {["/", "/weinladen", "/italy", "/france", "/spain", "/new-world"].map(
          (path) => (
            <Route key={path} path={path} element={<PageMain />} />
          ),
        )}
        {["store", "shop"].map((path) => (
          <Route
            key={path}
            path={"/" + path}
            element={<Navigate to="/weinladen" replace />}
          />
        ))}
        {[
          "ueber-uns",
          "weinwissen",
          "kontakt",
          "impressum",
          "datenschutz",
          "nutzungsbedingungen",
          "versand-zahlung",
          "widerruf",
          "barrierefreiheit",
        ].map((page) => (
          <Route
            key={page}
            path={"/" + page}
            element={<ContentPage page={page} />}
          />
        ))}
        <Route path="/cart" element={<WineCart />} />
        <Route
          path="*"
          element={
            <main id="main" className="empty-state">
              <h1>404</h1>
              <Link className="button" to="/">
                {t("explore")}
              </Link>
            </main>
          }
        />
      </Routes>
      <SiteFooter />
    </>
  );
}
