import { useEffect, useRef, useState } from "react";

export const GIFT_PRESENTATIONS = [1, 2, 5, 6];
export default function useGiftCarousel(blocked = false) {
  const ref = useRef(null);
  const [presentation, setPresentation] = useState(GIFT_PRESENTATIONS[0]);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [reduced, setReduced] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false);
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const motion = () => setReduced(media?.matches ?? false);
    const visibility = () => setHidden(document.hidden);
    media?.addEventListener?.("change", motion);
    document.addEventListener("visibilitychange", visibility);
    const observer = typeof IntersectionObserver !== "undefined" && new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), { threshold: 0.35 });
    if (observer) observer.observe(ref.current);
    return () => { observer && observer.disconnect(); media?.removeEventListener?.("change", motion); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    if (!visible || hovered || focused || hidden || reduced || blocked) return;
    let interval;
    const advance = () => setPresentation(current => GIFT_PRESENTATIONS[(GIFT_PRESENTATIONS.indexOf(current) + 1) % GIFT_PRESENTATIONS.length]);
    const delay = setTimeout(() => { advance(); interval = setInterval(advance, 4000); }, 3000);
    return () => { clearTimeout(delay); clearInterval(interval); };
  }, [visible, hovered, focused, hidden, reduced, blocked]);
  const interactions = {
    onPointerEnter: event => { if (event.pointerType === "mouse" || event.pointerType === "pen") setHovered(true); },
    onPointerLeave: () => setHovered(false),
    onFocusCapture: event => { if (event.target.matches(":focus-visible")) setFocused(true); },
    onBlurCapture: event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); },
  };
  return { ref, presentation, setPresentation, interactions };
}
