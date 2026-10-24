export const GIFT_BASKETS = {
  1: { slots: 2, aspect: "1 / 1", rim: "polygon(0 60%, 100% 60%, 100% 100%, 0 100%)", bottles: [{ left: "45%", top: "17%", width: "19%", height: "47%", rotate: "7deg" }, { left: "61%", top: "20%", width: "19%", height: "47%", rotate: "14deg" }] },
  2: { slots: 1, aspect: "690 / 431", rim: "polygon(0 90%, 100% 90%, 100% 100%, 0 100%)", bottles: [{ left: "13%", top: "4%", width: "23%", height: "78%", rotate: "14deg" }] },
  5: { slots: 1, aspect: "1 / 1", bottles: [{ left: "66%", top: "3%", width: "27%", height: "93%", rotate: "0deg" }] },
  6: { slots: 1, aspect: "1 / 1", rim: "polygon(0 69%, 100% 69%, 100% 100%, 0 100%)", bottles: [{ left: "40%", top: "0%", width: "24%", height: "74%", rotate: "0deg" }] },
};
export function giftWines(presentation, selections, catalog) {
  return Array.from({ length: GIFT_BASKETS[presentation].slots }, (_, index) => catalog.find(wine => String(wine.id) === selections?.[index]) || catalog[index] || catalog[0]).filter(Boolean);
}
export function makeGiftBundle(presentation, wines, label) {
  if (!wines.length) return null;
  const cents = wines.reduce((sum, wine) => sum + Math.round(wine.price * 100), 0);
  return { ...wines[0], id: `gift-${presentation}-${wines.map(wine => wine.id).join("-")}`, name: `${label} ${String(presentation).padStart(2,"0")} · ${wines.map(wine => wine.name).join(" + ")}`, giftPresentation: presentation, giftWines: wines, giftWinePrice: cents / 100, giftSupplement: 10, price: (cents + 1000) / 100 };
}
