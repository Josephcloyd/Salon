/**
 * Golden Strand geometry. Pure functions, no DOM.
 *
 * The strand is generated as a dense polyline in document coordinates.
 * Each point carries `p`, a monotonic "progress" coordinate (≈ document y)
 * that maps scroll position to how much of the strand is drawn, so loops
 * and curls draw smoothly instead of popping in.
 */

export type StrandMode = "sleek" | "wave" | "loose" | "curl";

export interface StrandZone {
  top: number;
  bottom: number;
  mode: StrandMode;
  /** Horizontal resting line in px */
  baseX: number;
}

export interface Ellipse {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export interface StrandLayout {
  width: number;
  startY: number;
  zones: ReadonlyArray<StrandZone>;
  /** Headings the strand curls around (ignored when simplified) */
  wraps: ReadonlyArray<Ellipse>;
  /** The CTA the strand ties a bow around */
  bow: Ellipse | null;
  /** Used where no bow target exists */
  endY: number;
  simplified: boolean;
}

export interface StrandPoint {
  x: number;
  y: number;
  p: number;
}

export interface StrandGeometry {
  points: StrandPoint[];
  /** cumulative length at each point */
  lengths: number[];
  total: number;
  /** index of the first point of the bow finale (points.length if none) */
  bowStart: number;
  /** length at which the bow finale starts */
  bowLength: number;
  d: string;
  /** the second ribbon tail of the bow, drawn separately */
  tailD: string;
}

interface ModeParams {
  amp: number; // fraction of viewport width
  wavelength: number; // px
  curl: number; // curl radius px
}

export const MODE_PARAMS: Readonly<Record<StrandMode, ModeParams>> = {
  sleek: { amp: 0.012, wavelength: 1500, curl: 0 },
  wave: { amp: 0.05, wavelength: 1000, curl: 0 },
  loose: { amp: 0.085, wavelength: 1350, curl: 0 },
  curl: { amp: 0.03, wavelength: 1100, curl: 17 },
};

const WRAP_APPROACH = 170;
const WRAP_EXIT = 150;
const CURL_RATE = 0.13; // radians per px of travel; radius > 1/rate => loops

interface Walker {
  y: number;
  phase: number;
  curlT: number;
  amp: number;
  wavelength: number;
  curl: number;
  base: number;
}

function zoneAt(zones: ReadonlyArray<StrandZone>, y: number, fallbackBase: number): StrandZone {
  const inside = zones.find((z) => y >= z.top && y < z.bottom);
  if (inside) return inside;
  const before = [...zones].reverse().find((z) => z.bottom <= y);
  return before ?? { top: 0, bottom: 0, mode: "wave", baseX: fallbackBase };
}

function targetParams(mode: StrandMode, simplified: boolean): ModeParams {
  const params = MODE_PARAMS[simplified && mode === "curl" ? "loose" : mode];
  return simplified ? { ...params, amp: params.amp * 0.6, curl: 0 } : params;
}

function walkerPoint(w: Walker, width: number): StrandPoint {
  return {
    x: w.base + w.amp * width * Math.sin(w.phase) + w.curl * (Math.cos(w.curlT) - 1),
    y: w.y + w.curl * Math.sin(w.curlT),
    p: w.y,
  };
}

/** Advances the walker by `dy`, easing its parameters toward the active zone. */
function advance(w: Walker, dy: number, layout: StrandLayout): Walker {
  const zone = zoneAt(layout.zones, w.y, layout.width * 0.88);
  const target = targetParams(zone.mode, layout.simplified);
  const k = 1 - Math.exp(-Math.abs(dy) / 220);
  const wavelength = w.wavelength + (target.wavelength - w.wavelength) * k;
  return {
    y: w.y + dy,
    phase: w.phase + (dy * 2 * Math.PI) / wavelength,
    curlT: w.curlT + dy * CURL_RATE,
    amp: w.amp + (target.amp - w.amp) * k,
    wavelength,
    curl: w.curl + (target.curl - w.curl) * k,
    base: w.base + (zone.baseX - w.base) * k,
  };
}

function ellipsePoint(e: Ellipse, a: number): { x: number; y: number } {
  return { x: e.cx + e.rx * Math.cos(a), y: e.cy + e.ry * Math.sin(a) };
}

function ellipseTangent(e: Ellipse, a: number): { x: number; y: number } {
  return { x: -e.rx * Math.sin(a), y: e.ry * Math.cos(a) };
}

function normalize(v: { x: number; y: number }, scale: number): { x: number; y: number } {
  const len = Math.hypot(v.x, v.y) || 1;
  return { x: (v.x / len) * scale, y: (v.y / len) * scale };
}

/** Cubic Hermite bridge between two points with given tangents. */
export function hermite(
  p0: { x: number; y: number },
  t0: { x: number; y: number },
  p1: { x: number; y: number },
  t1: { x: number; y: number },
  step: number,
): Array<{ x: number; y: number }> {
  const dist = Math.hypot(p1.x - p0.x, p1.y - p0.y);
  const n = Math.max(2, Math.ceil(dist / step));
  const m0 = normalize(t0, dist);
  const m1 = normalize(t1, dist);
  const out: Array<{ x: number; y: number }> = [];
  for (let i = 1; i <= n; i++) {
    const s = i / n;
    const s2 = s * s;
    const s3 = s2 * s;
    const h00 = 2 * s3 - 3 * s2 + 1;
    const h10 = s3 - 2 * s2 + s;
    const h01 = -2 * s3 + 3 * s2;
    const h11 = s3 - s2;
    out.push({
      x: h00 * p0.x + h10 * m0.x + h01 * p1.x + h11 * m1.x,
      y: h00 * p0.y + h10 * m0.y + h01 * p1.y + h11 * m1.y,
    });
  }
  return out;
}

function sampleEllipse(e: Ellipse, from: number, to: number, step: number): Array<{ x: number; y: number }> {
  const arc = Math.abs(to - from) * Math.sqrt((e.rx * e.rx + e.ry * e.ry) / 2);
  const n = Math.max(8, Math.ceil(arc / step));
  return Array.from({ length: n }, (_, i) => ellipsePoint(e, from + ((to - from) * (i + 1)) / n));
}

function lastTangent(points: ReadonlyArray<StrandPoint>): { x: number; y: number } {
  const a = points[points.length - 2] ?? points[points.length - 1];
  const b = points[points.length - 1];
  return { x: b.x - a.x, y: b.y - a.y || 1 };
}

/** Assigns progress linearly by arc length between pStart and pEnd. */
function withProgress(raw: ReadonlyArray<{ x: number; y: number }>, origin: { x: number; y: number }, pStart: number, pEnd: number): StrandPoint[] {
  const segs: number[] = [];
  let acc = 0;
  let prev = origin;
  for (const pt of raw) {
    acc += Math.hypot(pt.x - prev.x, pt.y - prev.y);
    segs.push(acc);
    prev = pt;
  }
  const total = acc || 1;
  return raw.map((pt, i) => ({ x: pt.x, y: pt.y, p: pStart + ((pEnd - pStart) * segs[i]) / total }));
}

const WRAP_START = -Math.PI * 0.4; // top-right of the ellipse
const WRAP_SWEEP = Math.PI * 2.5; // one full turn plus a little

/** A full curl around a heading, bridged in and out of the flowing strand. */
function wrapAround(points: StrandPoint[], w: Walker, e: Ellipse, layout: StrandLayout, step: number): Walker {
  const from = points[points.length - 1];
  const exitY = e.cy + e.ry + WRAP_EXIT;
  const resumed = advance(w, exitY - w.y, layout);
  const rejoin = walkerPoint(resumed, layout.width);
  const startPt = ellipsePoint(e, WRAP_START);
  const endA = WRAP_START + WRAP_SWEEP;

  const raw = [
    ...hermite(from, lastTangent(points), startPt, ellipseTangent(e, WRAP_START), step),
    ...sampleEllipse(e, WRAP_START, endA, step),
  ];
  const endPt = raw[raw.length - 1];
  raw.push(...hermite(endPt, ellipseTangent(e, endA), rejoin, { x: 0, y: 1 }, step));

  points.push(...withProgress(raw, from, from.p, exitY));
  return resumed;
}

/** Lemniscate figure-eight (the bow loops), tilted upward like ribbon. */
function bowLoops(center: { x: number; y: number }, size: number, step: number): Array<{ x: number; y: number }> {
  const n = Math.max(60, Math.ceil((size * 7) / step));
  const out: Array<{ x: number; y: number }> = [];
  for (let i = 1; i <= n; i++) {
    const t = Math.PI / 2 - (2 * Math.PI * i) / n; // start at the knot, right lobe first
    const denom = 1 + Math.sin(t) ** 2;
    const lx = (size * Math.cos(t)) / denom;
    const ly = (size * Math.sin(t) * Math.cos(t)) / denom;
    out.push({ x: center.x + lx, y: center.y + ly * 1.5 - Math.abs(lx) * 0.45 });
  }
  return out;
}

function ribbonTail(knot: { x: number; y: number }, dir: 1 | -1, length: number, step: number): Array<{ x: number; y: number }> {
  const n = Math.max(10, Math.ceil(length / step));
  return Array.from({ length: n }, (_, i) => {
    const s = (i + 1) / n;
    // Ribbon tails sweep outward along the top of the button, clear of its label
    return { x: knot.x + dir * (length * 0.95 * s), y: knot.y + Math.sin(s * Math.PI) * 9 + length * 0.12 * s };
  });
}

function toPath(points: ReadonlyArray<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  return `M${first.x.toFixed(1)} ${first.y.toFixed(1)}` + rest.map((pt) => `L${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join("");
}

function cumulativeLengths(points: ReadonlyArray<StrandPoint>): number[] {
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  }
  return lengths;
}

export function buildStrand(layout: StrandLayout): StrandGeometry {
  const step = layout.simplified ? 10 : 5;
  const firstZone = zoneAt(layout.zones, layout.startY, layout.width * 0.88);
  const startParams = targetParams(firstZone.mode, layout.simplified);
  let walker: Walker = {
    y: layout.startY,
    phase: 0,
    curlT: 0,
    amp: startParams.amp,
    wavelength: startParams.wavelength,
    curl: 0,
    base: firstZone.baseX,
  };

  const bow = layout.bow;
  const endY = bow ? bow.cy - bow.ry - WRAP_APPROACH : layout.endY;
  const wraps = layout.simplified
    ? []
    : [...layout.wraps].filter((e) => e.cy - e.ry - WRAP_APPROACH > layout.startY && e.cy + e.ry < endY).sort((a, b) => a.cy - b.cy);

  const points: StrandPoint[] = [walkerPoint(walker, layout.width)];
  let wrapIndex = 0;

  while (walker.y < endY) {
    const wrap = wraps[wrapIndex];
    if (wrap && walker.y >= wrap.cy - wrap.ry - WRAP_APPROACH) {
      walker = wrapAround(points, walker, wrap, layout, step);
      wrapIndex += 1;
      continue;
    }
    walker = advance(walker, Math.min(step, endY - walker.y) || step, layout);
    points.push(walkerPoint(walker, layout.width));
  }

  const bowStart = points.length;
  let tailD = "";

  if (bow) {
    const from = points[points.length - 1];
    const knot = { x: bow.cx, y: bow.cy - bow.ry };
    const startPt = ellipsePoint(bow, WRAP_START);
    const endA = -Math.PI / 2 + Math.PI * 2; // finishes at top-centre, heading right
    const raw = [
      ...hermite(from, lastTangent(points), startPt, ellipseTangent(bow, WRAP_START), step),
      ...sampleEllipse(bow, WRAP_START, endA, step),
      ...bowLoops(knot, Math.min(78, Math.max(46, bow.rx * 0.45)), step),
      ...ribbonTail(knot, 1, 92, step),
    ];
    const finale = withProgress(raw, from, from.p, from.p + 1);
    points.push(...finale);
    tailD = toPath([knot, ...ribbonTail(knot, -1, 84, step)]);
  }

  const lengths = cumulativeLengths(points);
  return {
    points,
    lengths,
    total: lengths[lengths.length - 1] ?? 0,
    bowStart,
    bowLength: lengths[Math.max(0, bowStart - 1)] ?? 0,
    d: toPath(points),
    tailD,
  };
}

/** Length of strand to draw so its tip sits at document progress `p` (bow excluded). */
export function lengthAtProgress(geom: StrandGeometry, p: number): number {
  const { points, lengths } = geom;
  const last = geom.bowStart - 1;
  if (last < 0 || p <= points[0].p) return 0;
  if (p >= points[last].p) return lengths[last];
  let lo = 0;
  let hi = last;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (points[mid].p <= p) lo = mid;
    else hi = mid;
  }
  const span = points[hi].p - points[lo].p || 1;
  const f = (p - points[lo].p) / span;
  return lengths[lo] + (lengths[hi] - lengths[lo]) * f;
}

/** Point on the strand at a given drawn length (for the shimmer particles). */
export function pointAtLength(geom: StrandGeometry, length: number): { x: number; y: number } | null {
  const { points, lengths } = geom;
  if (points.length === 0) return null;
  if (length <= 0) return points[0];
  if (length >= geom.total) return points[points.length - 1];
  let lo = 0;
  let hi = lengths.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (lengths[mid] <= length) lo = mid;
    else hi = mid;
  }
  const f = (length - lengths[lo]) / (lengths[hi] - lengths[lo] || 1);
  return { x: points[lo].x + (points[hi].x - points[lo].x) * f, y: points[lo].y + (points[hi].y - points[lo].y) * f };
}
