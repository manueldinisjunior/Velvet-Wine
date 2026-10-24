import Icon from "./Icon";
import React, { useEffect, useRef } from "react";
import { useLanguage } from "../i18n";
export default function BackToTop() {
  const { t } = useLanguage();
  const cleanup = useRef(() => {});
  useEffect(() => () => cleanup.current(), []);
  function scroll() {
    cleanup.current();
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    let frame;
    const cancel = () => {
      cancelAnimationFrame(frame);
      root.style.scrollBehavior = previous;
      ["wheel", "touchstart", "keydown"].forEach((event) =>
        window.removeEventListener(event, cancel),
      );
    };
    cleanup.current = cancel;
    const finish = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      cancel();
      document.getElementById("top")?.focus({ preventScroll: true });
    };
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      finish();
      return;
    }
    const origin = window.scrollY;
    let previousFrame;
    let elapsed = 0;
    const duration = 2400;
    ["wheel", "touchstart", "keydown"].forEach((event) =>
      window.addEventListener(event, cancel, { passive: true }),
    );
    const step = (now) => {
      // A busy/background desktop tab can deliver a frame seconds late.
      // Advance by rendered frame time so a stall cannot skip the whole motion.
      if (previousFrame !== undefined) elapsed += Math.min(Math.max(now - previousFrame, 0), 50);
      previousFrame = now;
      const progress = Math.min(elapsed / duration, 1);
      const ease = (1 - Math.cos(Math.PI * progress)) / 2;
      window.scrollTo({ top: Math.round(origin * (1 - ease)), left: 0, behavior: "instant" });
      if (progress < 1) frame = requestAnimationFrame(step);
      else finish();
    };
    frame = requestAnimationFrame(step);
  }
  return (
    <button
      type="button"
      className="button button-light back-top"
      onClick={scroll}
    >
      {t("top")} <span aria-hidden="true"><Icon name="up" /></span>
    </button>
  );
}
