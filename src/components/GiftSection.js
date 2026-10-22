import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import { useLanguage } from "../i18n";

export default function GiftSection() {
  const { t } = useLanguage();
  return (
    <section className="gift-section" aria-labelledby="gift-title" id="geschenke">
      <div className="gift-heading">
        <div>
          <p className="eyebrow">{t("giftEyebrow")}</p>
          <h2 id="gift-title">{t("giftTitle")}<br /><em>{t("giftTitleAccent")}</em></h2>
        </div>
        <p>{t("giftIntro")}</p>
      </div>
      <div className="gift-options">
        {["Wine", "Basket", "Business"].map((kind, index) => (
          <article className="gift-option" key={kind}>
            <div className="gift-option-top"><span aria-hidden="true">0{index + 1}</span><Icon name={kind === "Basket" ? "basket" : "gift"} size={32} /></div>
            <h3>{t(`gift${kind}`)}</h3>
            <p>{t(`gift${kind}Text`)}</p>
          </article>
        ))}
      </div>
      <div className="gift-bottom">
        <div><p>{t("giftTailored")}</p><p className="gift-note">{t("giftDemo")}</p></div>
        <Link className="button" to="/kontakt">{t("giftContact")} <Icon name="external" /></Link>
      </div>
    </section>
  );
}
