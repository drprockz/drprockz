import { r1 } from './svg.mjs';

/**
 * Axonometric projector. World x runs right and down, y runs left and down, z is up.
 * yaw 45 / pitch 35.264 is true isometric; a small yaw keeps a long x axis near horizontal.
 * @returns {(x:number,y:number,z?:number)=>[number,number]} world -> screen
 */
export function projector({ ox, oy, s, yaw = 45, pitch = 35.264 }) {
  const a = (yaw * Math.PI) / 180, b = (pitch * Math.PI) / 180;
  const ca = Math.cos(a), sa = Math.sin(a), sb = Math.sin(b), cb = Math.cos(b);
  return (x, y, z = 0) => [ox + s * (x * ca - y * sa), oy + s * ((x * sa + y * ca) * sb - z * cb)];
}

const poly = (pts, fill, extra = '') => `<path d="M${pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L')}Z" fill="${fill}"${extra}/>`;

/**
 * A box drawn as its three visible faces.
 * @param p      projector
 * @param shade  [top, left, right] fills
 * @param opts   stroke: edge colour; topExtra: attributes for the top face (class, style)
 */
export function box(p, x, y, z, w, d, h, shade, { stroke = '', topExtra = '' } = {}) {
  const st = stroke ? ` stroke="${stroke}" stroke-width=".7" stroke-linejoin="round"` : '';
  const left = [p(x, y + d, z + h), p(x + w, y + d, z + h), p(x + w, y + d, z), p(x, y + d, z)];
  const right = [p(x + w, y, z + h), p(x + w, y + d, z + h), p(x + w, y + d, z), p(x + w, y, z)];
  const top = [p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)];
  return poly(left, shade[1], st) + poly(right, shade[2], st) + poly(top, shade[0], st + (topExtra ? ' ' + topExtra : ''));
}

/** Just the top face of a box, for highlight overlays. */
export function topFace(p, x, y, z, w, d, h, fill, extra = '') {
  return poly([p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)], fill, extra ? ' ' + extra : '');
}

/** Flat quad on the ground plane (z fixed). */
export function quad(p, x, y, z, w, d, fill, extra = '') {
  return poly([p(x, y, z), p(x + w, y, z), p(x + w, y + d, z), p(x, y + d, z)], fill, extra ? ' ' + extra : '');
}
