import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
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
  fireEvent.click(screen.getByRole("button", { name: "Weißwein" }));
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
  const select = screen.getByRole("combobox", { name: "Sprache" });
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
    fireEvent.change(select, { target: { value: lang } });
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
  expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  expect(
    screen.getByText("Bewusst genießen.", { selector: ".announcement" }),
  ).toHaveFocus();
});
