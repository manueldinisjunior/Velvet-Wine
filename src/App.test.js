import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { store } from "./redux/store";
import wines from "./items.json";
import { get, set } from "firebase/database";

jest.mock("./firebase-config", () => ({}));
jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  push: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
}));

beforeEach(() => {
  window.scrollTo = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  get.mockResolvedValue({ val: () => wines });
  set.mockRejectedValue(new Error("Offline"));
  localStorage.clear();
  window.history.replaceState({}, "", "/");
});

test("browse, filter, add, persist, change quantity and retain bag after failed order", async () => {
  render(<App />);
  await screen.findByText("64 Weine entdecken");
  fireEvent.click(within(document.getElementById("collection")).getByRole("button", { name: "Weißwein" }));
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "Freschello" },
  });
  const add = screen.getAllByRole("button", { name: /In den Warenkorb:/ });
  expect(add.length).toBeGreaterThan(0);
  fireEvent.click(add[0]);
  await waitFor(() =>
    expect(
      JSON.parse(localStorage.getItem("nevinnyShopCartData"))[0].amount,
    ).toBe(1),
  );
  fireEvent.click(screen.getByRole("link", { name: "Cart, 1" }));
  expect(
    screen.getByRole("heading", { name: /Cart/, level: 1 }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Eine Flasche mehr/ }));
  fireEvent.click(
    screen.getByRole("button", { name: /Demo-Anfrage speichern/ }),
  );
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Dein Warenkorb bleibt erhalten",
  );
  expect(
    JSON.parse(localStorage.getItem("nevinnyShopCartData"))[0].amount,
  ).toBe(2);
  fireEvent.click(
    screen.getByRole("button", { name: /^Entfernen.*Freschello/ }),
  );
  expect(
    screen.getByRole("heading", { name: "Dein Warenkorb ist noch leer." }),
  ).toBeInTheDocument();
});

test("offline catalog and damaged storage still allow browsing", async () => {
  get.mockRejectedValue(new Error("Offline"));
  localStorage.setItem("nevinnyShopCartData", "{invalid");
  render(<App />);
  expect(await screen.findByText(/Gespeicherte Auswahl/)).toBeInTheDocument();
  expect(screen.getByText("64 Weine entdecken")).toBeInTheDocument();
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "zz-no-match" },
  });
  expect(screen.getByText("Keine Weine gefunden.")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Filter zurücksetzen" }));
  expect(screen.getByText("64 Weine entdecken")).toBeInTheDocument();
});

test("store alias redirects and all languages translate navigation", async () => {
  window.history.replaceState({}, "", "/store");
  render(<App />);
  await screen.findByText("64 Weine entdecken");
  expect(window.location.pathname).toBe("/weinladen");
  const languageTrigger = document.getElementById("language-toggle");
  const choices = {
    nl: "Wijnwinkel",
    sv: "Vinbutik",
    nb: "Vinbutikk",
    fr: "Cave à vins",
    it: "Enoteca",
    es: "Tienda de vinos",
    pt: "Loja de vinhos",
    ru: "Винный магазин",
    "zh-Hans": "葡萄酒商店",
  };
  for (const [lang, label] of Object.entries(choices)) {
    fireEvent.click(languageTrigger);
    fireEvent.click(document.querySelector(`#language-options button[lang="${lang}"]`));
    expect(document.documentElement.lang).toBe(lang);
    expect(
      screen.getByRole("heading", { level: 1, name: label }),
    ).toBeInTheDocument();
    expect(localStorage.getItem("velvet-language")).toBe(lang);
  }
});

test("legal page and social links remain reachable with reduced motion", () => {
  window.history.replaceState({}, "", "/datenschutz");
  window.matchMedia = jest.fn(() => ({ matches: true }));
  render(<App />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Datenschutz" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Instagram/ })).toHaveAttribute(
    "rel",
    "nofollow noopener noreferrer",
  );
  fireEvent.click(screen.getByRole("button", { name: /Nach oben/ }));
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "instant" });
  expect(
    screen.getByText("Bewusst genießen.", { selector: ".announcement" }),
  ).toHaveFocus();
});

test("icon menu toggles, closes on Escape, and restores focus", () => {
  window.history.replaceState({}, "", "/");
  render(<App />);
  const menu = screen.getByRole("button", { name: "Menü" });
  expect(menu).toHaveAttribute("aria-expanded", "false");
  expect(menu).toHaveTextContent("");
  fireEvent.click(menu);
  expect(screen.getByRole("button", { name: "Schließen" })).toHaveAttribute("aria-expanded", "true");
  fireEvent.keyDown(document, { key: "Escape" });
  expect(menu).toHaveAttribute("aria-expanded", "false");
  expect(menu).toHaveFocus();
  fireEvent.click(menu);
  fireEvent.pointerDown(document.body);
  expect(menu).toHaveAttribute("aria-expanded", "false");
});

test("privacy dialog opens from footer and closes without accepting optional tracking", () => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Datenschutzeinstellungen" }));
  expect(screen.getByRole("dialog")).toHaveAttribute("open");
  expect(screen.getByText(/Keine Analyse- oder Werbetracker/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Fertig" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("back to top animates through the midpoint and finishes after 1500ms", () => {
  window.matchMedia = jest.fn(() => ({ matches: false }));
  render(<App />);
  Object.defineProperty(window, "scrollY", { configurable: true, value: 1000 });
  const now = jest.spyOn(performance, "now").mockReturnValue(0);
  let frame;
  const raf = jest.spyOn(window, "requestAnimationFrame").mockImplementation(callback => { frame = callback; return 1; });
  fireEvent.click(screen.getByRole("button", { name: /Nach oben/ }));
  frame(750);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 500, left: 0, behavior: "instant" });
  frame(1500);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: "instant" });
  expect(document.getElementById("top")).toHaveFocus();
  raf.mockRestore();
  now.mockRestore();
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
});

test("header search opens the catalog, focuses search, and works again on the same route", async () => {
  window.history.replaceState({}, "", "/ueber-uns");
  render(<App />);
  const search = screen.getByRole("link", { name: "Wein, Rebsorte oder Region suchen" });
  fireEvent.click(search);
  expect(window.location.pathname).toBe("/weinladen");
  const input = screen.getByRole("searchbox");
  expect(input).toHaveFocus();
  fireEvent.change(input, { target: { value: "zz-no-match" } });
  expect(await screen.findByText("Keine Weine gefunden.")).toBeInTheDocument();
  search.focus();
  fireEvent.click(search);
  expect(input).toHaveFocus();
  expect(screen.getByRole("link", { name: /^Cart, / }).querySelector("svg")).toBeInTheDocument();
});

test("flag picker closes on Escape and restores keyboard focus", () => {
  render(<App />);
  const trigger = screen.getByRole("button", { name: "Sprache: Deutsch" });
  fireEvent.click(trigger);
  expect(screen.getByRole("button", { name: "Deutsch", exact: true })).toHaveAttribute("aria-pressed", "true");
  fireEvent.keyDown(document, { key: "Escape" });
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(trigger).toHaveFocus();
  expect(document.getElementById("language-options")).not.toBeInTheDocument();
});


test("quick view uses catalog facts, supports repeated additions and restores focus", async () => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
  render(<App />);
  await screen.findByText("64 Weine entdecken");
  const opener = screen.getAllByRole("button", { name: /^Weindetails ansehen:/ })[0];
  opener.focus();
  fireEvent.click(opener);
  const panel = screen.getByRole("dialog");
  expect(within(panel).getByText(wines[0].production)).toBeInTheDocument();
  expect(within(panel).queryByText("Verkostungsnotizen")).not.toBeInTheDocument();
  const add = within(panel).getByRole("button", { name: /^In den Warenkorb:/ });
  const before = Number(screen.getByRole("link", { name: /^Cart, / }).getAttribute("aria-label").split(", ")[1]);
  fireEvent.click(add);
  fireEvent.click(add);
  expect(add).toHaveTextContent("Hinzugefügt");
  expect(within(panel).getByRole("status")).toHaveTextContent("Hinzugefügt");
  expect(screen.getByRole("link", { name: `Cart, ${before + 2}` })).toBeInTheDocument();
  fireEvent.click(within(panel).getByRole("button", { name: "Schließen" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(opener).toHaveFocus();
  expect(document.body.style.overflow).not.toBe("hidden");
});

test("loading placeholders give way to the catalog and reduced motion skips result animation", async () => {
  let resolveCatalog;
  get.mockImplementation(() => new Promise(resolve => { resolveCatalog = resolve; }));
  window.matchMedia = jest.fn(() => ({ matches: true }));
  const animate = jest.fn(() => ({ cancel: jest.fn() }));
  HTMLElement.prototype.animate = animate;
  const { container } = render(<App />);
  expect(screen.getByText("Weine werden geladen…")).toBeInTheDocument();
  expect(container.querySelectorAll(".wine-skeleton")).toHaveLength(12);
  resolveCatalog({ val: () => wines });
  await screen.findByText("64 Weine entdecken");
  fireEvent.click(within(document.getElementById("collection")).getByRole("button", { name: "Weißwein", exact: true }));
  expect(animate).not.toHaveBeenCalled();
  expect(container.querySelectorAll(".wine-skeleton")).toHaveLength(0);
  delete HTMLElement.prototype.animate;
});


test("landing gift CTA opens dedicated gallery with wine and supplement pricing", async () => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
  render(<App />);
  await screen.findByText("64 Weine entdecken");
  expect(document.getElementById("story")).toBeInTheDocument();
  fireEvent.click(within(document.getElementById("geschenke")).getByRole("link", {name:"Geschenke entdecken"}));
  expect(window.location.pathname).toBe("/geschenke");
  expect(document.getElementById("story")).not.toBeInTheDocument();
  expect(document.getElementById("geschenke")).not.toBeInTheDocument();
  const white = wines.find(wine => wine.type.toLowerCase() === "white");
  fireEvent.click(screen.getByRole("button", {name:"Korb auswählen 2"}));
  expect(screen.getByRole("button", {name:"Korb auswählen 2"})).toHaveAttribute("aria-pressed", "true");
  fireEvent.change(screen.getByLabelText("Wein", {exact:true}), {target:{value:String(white.id)}});
  const opener = screen.getByRole("button", { name: "Weindetails ansehen" });
  fireEvent.click(opener);
  const panel = within(screen.getByRole("dialog"));
  expect(panel.getByRole("heading")).toHaveTextContent(white.name.replace(/"/g, ""));
  expect(panel.getByText("Korb & Inhalt")).toBeInTheDocument();
  expect(panel.getByText(/10,00\s*€/)).toBeInTheDocument();
  fireEvent.click(panel.getByRole("button", { name: /^In den Warenkorb:/ }));
  const bundle = store.getState().wines.cart.find(entry => entry.item.id === `gift-2-${white.id}`);
  expect(bundle.item.price).toBe((Math.round(Number(white.price) * 100) + 1000) / 100);
  fireEvent.click(panel.getByRole("button", { name: "Schließen" }));
  expect(opener).toHaveFocus();
});

test.each(["/weinladen", "/italy", "/france", "/spain", "/new-world"])("%s excludes landing promotions", async path => {
  window.history.replaceState({}, "", path);
  render(<App />);
  await screen.findByRole("heading", {name:"Weinladen",level:1});
  expect(document.getElementById("geschenke")).not.toBeInTheDocument();
  expect(document.getElementById("story")).not.toBeInTheDocument();
});

test("gift page is directly accessible and shows all six reference photos", async () => {
  window.history.replaceState({}, "", "/geschenke");
  render(<App />);
  expect(screen.getByRole("heading", {name:"Wein verschenken.",level:1})).toBeInTheDocument();
  expect(screen.getAllByRole("button", {name:/^Korb auswählen /})).toHaveLength(6);
  await waitFor(() => expect(screen.getByLabelText("Wein",{exact:true}).options).toHaveLength(wines.length));
});
