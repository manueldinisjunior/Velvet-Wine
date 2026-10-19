import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function WineShopHeader() {
  const count = useSelector((state) =>
    state.wines.cart.reduce((sum, entry) => sum + entry.amount, 0),
  );
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  return (
    <>
      <div id="top" className="announcement">
        A world of wine. A taste of something new.
      </div>
      <header className="site-header">
        <Link to="/" className="wordmark" aria-label="Velvet Essence home">
          velvet<span>essence</span>
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close ×" : "Menu ☰"}
        </button>
        <nav
          id="navigation"
          className={open ? "navigation is-open" : "navigation"}
          aria-label="Main navigation"
          onClick={() => setOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              document.querySelector(".menu-toggle")?.focus();
            }
          }}
        >
          <Link to="/" aria-current={pathname === "/" ? "page" : undefined}>
            Discover
          </Link>
          <Link to="/italy">Our wines</Link>
          <a href="/#story">Our spirit</a>
          <a href="#contact">Contact ↗</a>
        </nav>
        <Link
          to="/cart"
          className="bag-link"
          aria-label={`Shopping bag, ${count} bottles`}
        >
          Bag <span aria-live="polite">{count}</span>
        </Link>
      </header>
    </>
  );
}
