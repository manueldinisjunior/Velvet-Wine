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
      window.scrollTo(0, 0);
      cancel();
      document.getElementById("top")?.focus({ preventScroll: true });
    };
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    const origin = window.scrollY;
    const start = performance.now();
    ["wheel", "touchstart", "keydown"].forEach((event) =>
      window.addEventListener(event, cancel, { passive: true }),
    );
    const step = (now) => {
      const progress = Math.min((now - start) / 1500, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, origin * (1 - ease));
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
