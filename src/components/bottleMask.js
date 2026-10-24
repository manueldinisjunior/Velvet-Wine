// Remove only near-white pixels connected to the photo edges. Interior label,
// glass and wine pixels remain opaque and keep their original colours.
export function maskBackground(data, width, height) {
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0, tail = 0;
  function visit(index) {
    if (visited[index]) return;
    visited[index] = 1;
    const p = index * 4;
    const min = Math.min(data[p], data[p + 1], data[p + 2]);
    const max = Math.max(data[p], data[p + 1], data[p + 2]);
    if (min < 238 || max - min > 16) return;
    queue[tail++] = index;
    data[p + 3] = 0;
  }
  for (let x = 0; x < width; x++) { visit(x); visit((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { visit(y * width); visit(y * width + width - 1); }
  while (head < tail) {
    const index = queue[head++], x = index % width;
    if (x > 0) visit(index - 1);
    if (x < width - 1) visit(index + 1);
    if (index >= width) visit(index - width);
    if (index < width * (height - 1)) visit(index + width);
  }
  // A bottle has an uninterrupted silhouette. Flood fill alone can leak
  // through pale glass or label edges; preserve the interior of that outline.
  const left = new Int32Array(height).fill(width);
  const right = new Int32Array(height).fill(-1);
  let first = height, last = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3]) {
        left[y] = Math.min(left[y], x);
        right[y] = x;
      }
    }
    if (right[y] >= 0) { first = Math.min(first, y); last = y; }
  }
  let outlineLeft = width, outlineRight = -1;
  const bodyEnd = first + (last - first) * 0.94;
  for (let y = first; y <= last; y++) {
    outlineLeft = Math.min(outlineLeft, left[y]);
    outlineRight = Math.max(outlineRight, right[y]);
    // Keep the neck/shoulders/body continuous; allow the base to curve inward.
    const from = y <= bodyEnd ? outlineLeft : left[y];
    const to = y <= bodyEnd ? outlineRight : right[y];
    for (let x = from; x <= to; x++) data[(y * width + x) * 4 + 3] = 255;
  }
  return data;
}
const masks = new Map();
export function getBottleMask(source) {
  if (!masks.has(source)) masks.set(source, new Promise(resolve => {
    const photo = new Image();
    photo.crossOrigin = 'anonymous';
    photo.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = photo.naturalWidth;
        canvas.height = photo.naturalHeight;
        const context = canvas.getContext('2d');
        context.drawImage(photo, 0, 0);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        maskBackground(pixels.data, canvas.width, canvas.height);
        context.putImageData(pixels, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch { resolve(null); }
    };
    photo.onerror = () => resolve(null);
    // The same public photo on GitHub's CORS-enabled image host.
    photo.src = source.replace('https://github.com/AndrewBurko/FD3-Burko/raw/main/', 'https://raw.githubusercontent.com/AndrewBurko/FD3-Burko/main/');
  }));
  return masks.get(source);
}
