import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n";
import Icon from "./Icon";
export default function PrivacySettings() {
  const { t } = useLanguage();
  const dialog = useRef(null);
  return <>
    <button type="button" aria-haspopup="dialog" className="privacy-trigger" onClick={() => dialog.current.showModal()}><span className="privacy-fingerprint"><Icon name="fingerprint" size={54} /></span>{t("privacySettings")}</button>
    <dialog ref={dialog} className="privacy-dialog" aria-labelledby="privacy-title" aria-describedby="privacy-summary" onClick={event => { if (event.target === dialog.current && event.clientX !== 0) { const rect = dialog.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.current.close(); } }}>
      <div className="privacy-heading"><span className="eyebrow">Velvet Essence</span><button autoFocus className="privacy-close" aria-label={t("close")} onClick={() => dialog.current.close()}><Icon name="close" /></button></div>
      <h2 id="privacy-title">{t("privacySettings")}</h2>
      <p id="privacy-summary">{t("privacySummary")}</p>
      <div className="privacy-storage"><strong>{t("storageTitle")}</strong><span>{t("alwaysActive")}</span><p>{t("storageInfo")}</p></div>
      <div className="privacy-actions"><Link to="/datenschutz" onClick={() => dialog.current.close()}>{t("privacy")}</Link><button className="button" onClick={() => dialog.current.close()}>{t("done")}</button></div>
    </dialog>
  </>;
}
