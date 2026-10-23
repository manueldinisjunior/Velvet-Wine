import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { WineImage } from "./WineItem";
jest.mock("../i18n", () => ({ useLanguage: () => ({t: key => key}) }));
const item = {name:"Wine", imgSmall:"small.jpg", imgBig:"large.jpg"};
test("large previews prefer the original and recover from failed sources", () => {
  render(<WineImage item={item} highResolution />);
  expect(screen.getByAltText("Wine")).toHaveAttribute("src", "large.jpg");
  fireEvent.error(screen.getByAltText("Wine"));
  expect(screen.getByAltText("Wine")).toHaveAttribute("src", "small.jpg");
  fireEvent.error(screen.getByAltText("Wine"));
  expect(screen.getByRole("img", {name:"Wine; image"})).toBeInTheDocument();
});
test("catalog cards retain small images and missing originals fall back", () => {
  const {rerender} = render(<WineImage item={item} />);
  expect(screen.getByAltText("Wine")).toHaveAttribute("src", "small.jpg");
  rerender(<WineImage item={{...item, imgBig:undefined}} highResolution />);
  expect(screen.getByAltText("Wine")).toHaveAttribute("src", "small.jpg");
});
