import { describe, expect, it } from "vitest";
import { buildStrand, hermite, lengthAtProgress, pointAtLength, type StrandLayout } from "@/components/strand/geometry";

const base: StrandLayout = {
  width: 1440,
  startY: 500,
  zones: [
    { top: 0, bottom: 2000, mode: "wave", baseX: 1260 },
    { top: 2000, bottom: 4000, mode: "sleek", baseX: 1340 },
    { top: 4000, bottom: 6000, mode: "curl", baseX: 1300 },
    { top: 6000, bottom: 9000, mode: "loose", baseX: 1200 },
  ],
  wraps: [{ cx: 720, cy: 3000, rx: 300, ry: 90 }],
  bow: { cx: 900, cy: 8500, rx: 160, ry: 40 },
  endY: 9500,
  simplified: false,
};

describe("buildStrand", () => {
  const geom = buildStrand(base);

  it("produces a continuous path with monotonic progress", () => {
    expect(geom.d.startsWith("M")).toBe(true);
    expect(geom.total).toBeGreaterThan(8000);
    for (let i = 1; i < geom.bowStart; i++) {
      expect(geom.points[i].p).toBeGreaterThanOrEqual(geom.points[i - 1].p - 1e-6);
    }
    for (let i = 1; i < geom.points.length; i++) {
      const gap = Math.hypot(geom.points[i].x - geom.points[i - 1].x, geom.points[i].y - geom.points[i - 1].y);
      expect(gap).toBeLessThan(40);
    }
  });

  it("curls around the wrap target", () => {
    const near = geom.points.filter((pt) => Math.abs(pt.y - 3000) < 95 && Math.abs(pt.x - 720) < 320);
    const xs = near.map((pt) => pt.x);
    expect(Math.min(...xs)).toBeLessThan(450); // reaches the far (left) side of the heading
  });

  it("ties a bow above the CTA with a second tail", () => {
    expect(geom.bowStart).toBeLessThan(geom.points.length);
    expect(geom.bowLength).toBeLessThan(geom.total);
    expect(geom.tailD.startsWith("M900.0 8460.0")).toBe(true);
  });

  it("maps progress to drawn length", () => {
    expect(lengthAtProgress(geom, 0)).toBe(0);
    const mid = lengthAtProgress(geom, 5000);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(geom.bowLength);
    expect(lengthAtProgress(geom, 1e9)).toBeCloseTo(geom.bowLength, 5);
  });

  it("finds points along the strand", () => {
    expect(pointAtLength(geom, -1)).toEqual(geom.points[0]);
    expect(pointAtLength(geom, geom.total + 1)).toEqual(geom.points[geom.points.length - 1]);
    const mid = pointAtLength(geom, geom.total / 2);
    expect(mid).not.toBeNull();
  });

  it("simplifies on mobile: no wraps, no curls, coarser steps", () => {
    const simple = buildStrand({ ...base, simplified: true });
    expect(simple.points.length).toBeLessThan(geom.points.length / 1.5);
    const near = simple.points.filter((pt) => Math.abs(pt.y - 3000) < 95);
    expect(Math.min(...near.map((pt) => pt.x))).toBeGreaterThan(1000);
  });

  it("ends at endY when there is no bow", () => {
    const noBow = buildStrand({ ...base, bow: null, wraps: [] });
    expect(noBow.bowStart).toBe(noBow.points.length);
    expect(noBow.tailD).toBe("");
    expect(noBow.points[noBow.points.length - 1].p).toBeCloseTo(9500, 0);
  });

  it("handles a page with no zones", () => {
    const empty = buildStrand({ ...base, zones: [], wraps: [], bow: null, endY: 1000 });
    expect(empty.total).toBeGreaterThan(0);
  });
});

describe("hermite", () => {
  it("ends exactly at the target point", () => {
    const pts = hermite({ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 100, y: 100 }, { x: 1, y: 0 }, 5);
    expect(pts[pts.length - 1]).toEqual({ x: 100, y: 100 });
  });
});
