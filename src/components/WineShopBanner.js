import React from "react";
export default function WineShopBanner() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">A little discovery. A lot of flavour.</p>
        <h1 id="hero-title">
          Pour a little
          <br />
          <em>extraordinary.</em>
        </h1>
        <p>
          From bold reds to bright whites. Find a bottle that belongs at your
          table.
        </p>
        <a className="button button-light" href="#collection">
          Find your wine <span>↗</span>
        </a>
        <div className="hero-caption">
          <span>01 / THE VELVET COLLECTION</span>
          <span>Made for sharing ↓</span>
        </div>
      </div>
      <div className="hero-image">
        <img
          src={`${process.env.PUBLIC_URL}/images/wine-cover.jpg`}
          alt="Wine and a generous spread of tapas ready to share"
          width="1200"
          height="631"
          fetchpriority="high"
        />
        <span className="hero-seal">
          GOOD WINE.
          <br />
          GREAT COMPANY.
          <br />
          <b>✳</b>
        </span>
        <span className="image-caption">Set the table. Make a moment.</span>
      </div>
    </section>
  );
}
