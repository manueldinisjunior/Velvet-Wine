import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LanguageProvider } from "../i18n";
import FlavourTicker from "./FlavourTicker";

test("ticker pauses for mouse hover only and has no controls", () => {
  render(<LanguageProvider><FlavourTicker /></LanguageProvider>);
  const strip = screen.getByRole("region");
  const pointer = (name, pointerType) => {
    const event = new Event(name, { bubbles: true });
    Object.defineProperty(event, "pointerType", { value: pointerType });
    fireEvent(strip, event);
  };
  expect(strip).not.toHaveClass("is-held");
  pointer("pointerover", "mouse");
  expect(strip).toHaveClass("is-held");
  pointer("pointerout", "mouse");
  expect(strip).not.toHaveClass("is-held");
  pointer("pointerover", "touch");
  pointer("pointerdown", "touch");
  expect(strip).not.toHaveClass("is-held");
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
