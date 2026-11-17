import { describe, expect, it } from "vitest";
import { hasErrors, isValidPhMobile, normalizeMobile, timeSlots, toDateInputValue, validateBooking, type BookingInput } from "@/lib/booking";

const today = new Date(2026, 10, 17); // 17 Nov 2026, local time
const valid: BookingInput = {
  fullName: "Maria Santos",
  mobile: "0917 555 0123",
  category: "Hair Color",
  artist: "",
  date: "2026-11-20",
  time: "2:30 PM",
  notes: "",
};

describe("mobile numbers", () => {
  it("normalizes separators", () => {
    expect(normalizeMobile("(0917) 555-01.23")).toBe("09175550123");
  });
  it.each(["09175550123", "+639175550123", "639175550123", "0917-555-0123"])("accepts %s", (n) => {
    expect(isValidPhMobile(n)).toBe(true);
  });
  it.each(["0285550123", "0917555012", "12345", "+1 917 555 0123"])("rejects %s", (n) => {
    expect(isValidPhMobile(n)).toBe(false);
  });
});

describe("timeSlots", () => {
  it("runs from 10:00 AM to 8:00 PM in 30-minute steps", () => {
    const slots = timeSlots();
    expect(slots[0]).toBe("10:00 AM");
    expect(slots).toContain("12:00 PM");
    expect(slots[slots.length - 1]).toBe("8:00 PM");
    expect(slots).toHaveLength(21);
  });
});

describe("toDateInputValue", () => {
  it("pads month and day", () => {
    expect(toDateInputValue(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("validateBooking", () => {
  it("accepts a complete request", () => {
    expect(hasErrors(validateBooking(valid, today))).toBe(false);
  });
  it("accepts today's date", () => {
    expect(validateBooking({ ...valid, date: "2026-11-17" }, today).date).toBeUndefined();
  });
  it("flags every missing required field", () => {
    const errors = validateBooking({ ...valid, fullName: " ", mobile: "", category: "", date: "", time: "" }, today);
    expect(Object.keys(errors).sort()).toEqual(["category", "date", "fullName", "mobile", "time"]);
  });
  it("rejects past dates, malformed dates and unlisted times", () => {
    expect(validateBooking({ ...valid, date: "2026-11-16" }, today).date).toMatch(/future/);
    expect(validateBooking({ ...valid, date: "17/11/2026" }, today).date).toMatch(/valid/);
    expect(validateBooking({ ...valid, time: "11:00 PM" }, today).time).toBeDefined();
  });
  it("rejects bad mobile numbers, long names and long notes", () => {
    expect(validateBooking({ ...valid, mobile: "12345" }, today).mobile).toMatch(/PH mobile/);
    expect(validateBooking({ ...valid, fullName: "x".repeat(81) }, today).fullName).toBeDefined();
    expect(validateBooking({ ...valid, notes: "x".repeat(501) }, today).notes).toBeDefined();
  });
});
