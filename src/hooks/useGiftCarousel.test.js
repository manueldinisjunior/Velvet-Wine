import React from "react";
import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import useGiftCarousel from "./useGiftCarousel";
let observe;
function Example({ blocked = false }) {
  const { ref, presentation, interactions } = useGiftCarousel(blocked);
  return <div ref={ref} {...interactions} data-testid="carousel">{presentation}</div>;
}
beforeEach(() => {
  jest.useFakeTimers();
  window.matchMedia = jest.fn(() => ({matches:false, addEventListener:jest.fn(), removeEventListener:jest.fn()}));
  window.IntersectionObserver = jest.fn(callback => { observe = callback; return {observe:jest.fn(),disconnect:jest.fn()}; });
});
afterEach(() => { jest.useRealTimers(); delete window.IntersectionObserver; });
const tick = ms => act(() => jest.advanceTimersByTime(ms));
const enter = () => act(() => observe([{isIntersecting:true}]));
function pointer(type) { const event = new Event(type, {bubbles:true}); Object.defineProperty(event,"pointerType",{value:"mouse"}); fireEvent(screen.getByTestId("carousel"),event); }
test("waits until visible, advances after three seconds, loops four sharp photos and pauses on hover", () => {
  render(<Example />);
  tick(10000); expect(screen.getByTestId("carousel")).toHaveTextContent("1");
  enter(); tick(2999); expect(screen.getByTestId("carousel")).toHaveTextContent("1");
  tick(1); expect(screen.getByTestId("carousel")).toHaveTextContent("2");
  tick(4000); expect(screen.getByTestId("carousel")).toHaveTextContent("5");
  pointer("pointerover"); tick(12000); expect(screen.getByTestId("carousel")).toHaveTextContent("5");
  pointer("pointerout"); tick(3000); expect(screen.getByTestId("carousel")).toHaveTextContent("6");
  tick(4000); expect(screen.getByTestId("carousel")).toHaveTextContent("1");
  act(() => observe([{isIntersecting:false}])); tick(8000); expect(screen.getByTestId("carousel")).toHaveTextContent("1");
});
test("respects reduced motion and modal blocking", () => {
  window.matchMedia.mockReturnValue({matches:true});
  const {unmount} = render(<Example />); enter(); tick(15000); expect(screen.getByTestId("carousel")).toHaveTextContent("1"); unmount();
  window.matchMedia.mockReturnValue({matches:false});
  render(<Example blocked />); enter(); tick(15000); expect(screen.getByTestId("carousel")).toHaveTextContent("1");
});
