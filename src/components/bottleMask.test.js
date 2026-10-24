import { maskBackground } from './bottleMask';
test('removes connected backdrop while preserving white labels and wine colour', () => {
  const pixels = new Uint8ClampedArray(5*5*4).fill(255);
  for(let y=1;y<4;y++) for(let x=1;x<4;x++) pixels.set([90,38,22,255],(y*5+x)*4);
  pixels.set([255,255,255,255],12*4);
  maskBackground(pixels,5,5);
  expect([...pixels.slice(0,4)]).toEqual([255,255,255,0]);
  expect([...pixels.slice(24,28)]).toEqual([90,38,22,255]);
  expect([...pixels.slice(48,52)]).toEqual([255,255,255,255]);
});
