import React, { useState } from "react";
import { useLanguage } from "../i18n";
import Icon from "./Icon";
export default function FlavourTicker() {
  const { t } = useLanguage();
  const [paused, setPaused] = useState(false);
  const labels = [t("red"), t("white"), t("pink"), "VELVET MOMENTS"];
  return <section className={`flavour-strip ticker${paused ? " is-paused" : ""}`} aria-label={labels.join(" · ")}>
    <div className="ticker-window" aria-hidden="true"><div className="ticker-track">{[0, 1].map(copy => <div className="ticker-group" key={copy}>{[0, 1].map(repeat => labels.map(label => <span className="ticker-item" key={`${repeat}-${label}`}>{label}<Icon name="sparkle" /></span>))}</div>)}</div></div>
    <button className="ticker-control" aria-label={t(paused ? "resumeTicker" : "pauseTicker")} aria-pressed={paused} onClick={() => setPaused(!paused)}><Icon name={paused ? "play" : "pause"} /></button>
  </section>;
}
