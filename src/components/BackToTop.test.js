import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BackToTop from './BackToTop';
jest.mock('../i18n', () => ({useLanguage: () => ({t: () => 'Nach oben'})}));
test('a delayed desktop frame cannot jump directly to the header', () => {
  window.matchMedia = jest.fn(() => ({matches:false}));
  window.scrollTo = jest.fn();
  Object.defineProperty(window, 'scrollY', {configurable:true, value:1000});
  let callback;
  const raf = jest.spyOn(window,'requestAnimationFrame').mockImplementation(fn => {callback=fn; return 1;});
  const {unmount} = render(<BackToTop />);
  fireEvent.click(screen.getByRole('button'));
  callback(100);
  callback(5100);
  expect(window.scrollTo.mock.calls.at(-1)[0].top).toBeGreaterThan(990);
  unmount(); raf.mockRestore();
  Object.defineProperty(window, 'scrollY', {configurable:true, value:0});
});
