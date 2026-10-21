import React, { useState } from "react";
import { useLanguage } from "../i18n";
import Icon from "./Icon";
export default function FlavourTicker() {
  const { t } = useLanguage();
  const [held, setHeld] = useState(false);
  const labels = [t("red"), t("white"), t("pink"), "VELVET MOMENTS"];
  return <section className={`flavour-strip ticker${held ? " is-held" : ""}`} aria-label={labels.join(" · ")} onPointerDown={() => setHeld(true)} onPointerUp={() => setHeld(false)} onPointerCancel={() => setHeld(false)} onPointerLeave={() => setHeld(false)}>
    <div className="ticker-window" aria-hidden="true"><div className="ticker-track">{[0, 1].map(copy => <div className="ticker-group" key={copy}>{[0, 1].map(repeat => labels.map(label => <span className="ticker-item" key={`${repeat}-${label}`}>{label}<Icon name="sparkle" /></span>))}</div>)}</div></div>
  </section>;
}
