import { describe, expect, it } from "vitest";
import { formatNumber, formatPeso, formatPrice } from "@/lib/format";

describe("formatPeso", () => {
  it("adds the peso sign and comma separators", () => {
    expect(formatPeso(15000)).toBe("₱15,000");
    expect(formatPeso(650)).toBe("₱650");
  });
  it("rounds fractional amounts (count-up frames)", () => {
    expect(formatPeso(1234.6)).toBe("₱1,235");
    expect(formatPeso(0)).toBe("₱0");
  });
});

describe("formatNumber", () => {
  it("keeps the requested decimals", () => {
    expect(formatNumber(4.9, 1)).toBe("4.9");
    expect(formatNumber(25000)).toBe("25,000");
  });
});

describe("formatPrice", () => {
  it("prefixes 'from' for variable prices", () => {
    expect(formatPrice({ price: 2800, from: true })).toBe("from ₱2,800");
    expect(formatPrice({ price: 450 })).toBe("₱450");
  });
});
