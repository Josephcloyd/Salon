export interface BookingInput {
  fullName: string;
  mobile: string;
  category: string;
  artist: string;
  date: string; // yyyy-mm-dd
  time: string; // "10:30 AM"
  notes: string;
}

export type BookingErrors = Partial<Record<keyof BookingInput, string>>;

export const NOTES_MAX = 500;
const PH_MOBILE = /^(?:\+?63|0)9\d{9}$/;

/** Strips spaces, dashes, dots and parentheses: "0917 555-0123" -> "09175550123" */
export function normalizeMobile(raw: string): string {
  return raw.replace(/[\s\-().]/g, "");
}

export function isValidPhMobile(raw: string): boolean {
  return PH_MOBILE.test(normalizeMobile(raw));
}

/** Local calendar date as yyyy-mm-dd (used for the date input's `min`). */
export function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Appointment start times between opening and the last booking slot.
 * Default: 10:00 AM to 8:00 PM every 30 min (the salon closes at 9 PM).
 */
export function timeSlots(openHour = 10, lastHour = 20, stepMinutes = 30): string[] {
  const slots: string[] = [];
  for (let minutes = openHour * 60; minutes <= lastHour * 60; minutes += stepMinutes) {
    const h24 = Math.floor(minutes / 60);
    const m = minutes % 60;
    const suffix = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    slots.push(`${h12}:${String(m).padStart(2, "0")} ${suffix}`);
  }
  return slots;
}

export function validateBooking(input: BookingInput, today: Date = new Date()): BookingErrors {
  const errors: BookingErrors = {};
  const name = input.fullName.trim();

  if (name.length < 2) errors.fullName = "Please enter your full name.";
  else if (name.length > 80) errors.fullName = "Please keep your name under 80 characters.";

  if (!input.mobile.trim()) errors.mobile = "Please enter your mobile number.";
  else if (!isValidPhMobile(input.mobile)) errors.mobile = "Use a PH mobile number, e.g. 0917 555 0123.";

  if (!input.category) errors.category = "Please choose a service.";

  if (!input.date) errors.date = "Please pick a date.";
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) errors.date = "Please pick a valid date.";
  else if (input.date < toDateInputValue(today)) errors.date = "Please pick today or a future date.";

  if (!input.time) errors.time = "Please pick a time.";
  else if (!timeSlots().includes(input.time)) errors.time = "Please pick one of the listed times.";

  if (input.notes.length > NOTES_MAX) errors.notes = `Please keep notes under ${NOTES_MAX} characters.`;

  return errors;
}

export function hasErrors(errors: BookingErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Integration point: replace this with a POST to your booking API, CRM or
 * scheduling tool. It currently only simulates latency so the UI flow can be
 * reviewed; nothing is sent anywhere.
 */
export async function submitBooking(input: BookingInput): Promise<{ ok: true; reference: string }> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  const reference = `SM-${input.date.replace(/-/g, "").slice(2)}-${Math.floor(1000 + Math.random() * 9000)}`;
  return { ok: true, reference };
}
