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
  await screen.findByText("64 wines to discover");
  fireEvent.click(screen.getByRole("button", { name: "Whites" }));
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "Freschello" },
  });
  const add = screen.getAllByRole("button", { name: /Add .* to bag/ });
  expect(add.length).toBeGreaterThan(0);
  fireEvent.click(add[0]);
  await waitFor(() =>
    expect(
      JSON.parse(localStorage.getItem("nevinnyShopCartData"))[0].amount,
    ).toBe(1),
  );
  fireEvent.click(
    screen.getByRole("link", { name: "Shopping bag, 1 bottles" }),
  );
  expect(
    screen.getByRole("heading", { name: /Your wine bag/ }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Add one/ }));
  fireEvent.click(screen.getByRole("button", { name: /Save order request/ }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Your bag is safe",
  );
  expect(
    JSON.parse(localStorage.getItem("nevinnyShopCartData"))[0].amount,
  ).toBe(2);
  fireEvent.click(screen.getByRole("button", { name: /^Remove (?!one).*Freschello/ }));
  expect(
    screen.getByRole("heading", { name: "Your bag is waiting." }),
  ).toBeInTheDocument();
});

test("offline catalog and damaged storage still allow browsing", async () => {
  get.mockRejectedValue(new Error("Offline"));
  localStorage.setItem("nevinnyShopCartData", "{invalid");
  render(<App />);
  expect(
    await screen.findByText(/Showing our saved collection/),
  ).toBeInTheDocument();
  expect(screen.getByText("64 wines to discover")).toBeInTheDocument();
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "zz-no-match" },
  });
  expect(screen.getByText("No bottles found.")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
  expect(screen.getByText("64 wines to discover")).toBeInTheDocument();
});
