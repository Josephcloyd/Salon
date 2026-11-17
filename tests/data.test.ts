import { describe, expect, it } from "vitest";
import { artists, menu, priceBounds, services, startingPrice } from "@/data/salon";

describe("salon data", () => {
  it("derives starting prices per category", () => {
    expect(startingPrice("haircut")).toBe(350);
    expect(startingPrice("lashes")).toBe(250);
    expect(startingPrice("makeup")).toBe(2500);
  });
  it("throws for unknown categories", () => {
    expect(() => startingPrice("spa" as never)).toThrow(/Unknown/);
  });
  it("computes overall price bounds", () => {
    expect(priceBounds()).toEqual({ min: 250, max: 15000 });
  });
  it("links every service card to a menu category", () => {
    const ids = new Set(menu.map((c) => c.id));
    services.forEach((s) => expect(ids.has(s.categoryId)).toBe(true));
  });
  it("has six artists with unique ids", () => {
    expect(new Set(artists.map((a) => a.id)).size).toBe(6);
  });
});
