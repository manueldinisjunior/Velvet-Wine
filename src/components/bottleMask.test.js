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
test('keeps a white label opaque even when it touches the white backdrop', () => {
  const pixels = new Uint8ClampedArray(7*12*4).fill(255);
  for(let y=1;y<11;y++) for(let x=1;x<6;x++) pixels.set([50,40,30,255],(y*7+x)*4);
  // Bright label has no dark border and touches the exterior on both sides.
  for(let y=5;y<8;y++) for(let x=1;x<6;x++) pixels.set([255,255,255,255],(y*7+x)*4);
  maskBackground(pixels,7,12);
  expect([...pixels.slice((6*7+1)*4,(6*7+2)*4)]).toEqual([255,255,255,255]);
  expect(pixels[(6*7)*4+3]).toBe(0);
});
