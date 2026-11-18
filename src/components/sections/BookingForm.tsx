"use client";

import { useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { artists, menu } from "@/data/salon";
import {
  hasErrors,
  NOTES_MAX,
  submitBooking,
  timeSlots,
  toDateInputValue,
  validateBooking,
  type BookingErrors,
  type BookingInput,
} from "@/lib/booking";

const EMPTY: BookingInput = { fullName: "", mobile: "", category: "", artist: "", date: "", time: "", notes: "" };
const SLOTS = timeSlots();

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; reference: string } | { kind: "failed" };

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}

function Field({ id, label, error, optional, className = "", children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow text-[0.62rem] text-gold-light">
        {label} {optional && <span className="normal-case tracking-normal text-cream/60">(optional)</span>}
      </label>
      {children}
      <p id={`${id}-error`} role="alert" className="mt-2 min-h-[1.25rem] text-sm text-[#f0b6aa]">
        {error ?? ""}
      </p>
    </div>
  );
}

export function BookingForm() {
  const uid = useId();
  const submitRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<BookingInput>(EMPTY);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  useMagnetic(submitRef, 0.25);

  const id = (name: keyof BookingInput) => `${uid}-${name}`;
  const describedBy = (name: keyof BookingInput) => (errors[name] ? `${id(name)}-error` : undefined);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const name = e.target.name as keyof BookingInput;
    setValues((prev) => ({ ...prev, [name]: e.target.value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateBooking(values);
    setErrors(found);
    if (hasErrors(found)) {
      const first = Object.keys(found)[0] as keyof BookingInput;
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const result = await submitBooking(values);
      setStatus({ kind: "sent", reference: result.reference });
      setValues(EMPTY);
    } catch {
      setStatus({ kind: "failed" });
    }
  };

  if (status.kind === "sent") {
    return (
      <div role="status" className="border border-gold/40 bg-espresso/60 p-10 text-center backdrop-blur-md md:p-14">
        <p className="eyebrow text-gold">Request received</p>
        <p className="mt-6 font-serif text-4xl font-light text-cream">Salamat! Your chair is being prepared.</p>
        <p className="mt-6 leading-relaxed text-cream/75">
          We&apos;ll confirm your appointment by SMS within the hour during salon hours. Reference <span className="text-gold-light">{status.reference}</span>.
        </p>
        <button type="button" onClick={() => setStatus({ kind: "idle" })} className="btn-ghost mt-10">
          Book another
        </button>
      </div>
    );
  }

  const isSending = status.kind === "sending";

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} aria-describedby={`${uid}-hint`} className="grid gap-x-8 gap-y-4 md:grid-cols-2">
      <p id={`${uid}-hint`} className="sr-only">
        All fields are required unless marked optional.
      </p>

      <Field id={id("fullName")} label="Full name" error={errors.fullName}>
        <input id={id("fullName")} name="fullName" type="text" autoComplete="name" value={values.fullName} onChange={handleChange} aria-invalid={!!errors.fullName} aria-describedby={describedBy("fullName")} className="field" placeholder="Maria Clara Santos" maxLength={80} />
      </Field>

      <Field id={id("mobile")} label="Mobile number" error={errors.mobile}>
        <input id={id("mobile")} name="mobile" type="tel" inputMode="tel" autoComplete="tel" value={values.mobile} onChange={handleChange} aria-invalid={!!errors.mobile} aria-describedby={describedBy("mobile")} className="field" placeholder="0917 555 0123" maxLength={20} />
      </Field>

      <Field id={id("category")} label="Service" error={errors.category}>
        <select id={id("category")} name="category" value={values.category} onChange={handleChange} aria-invalid={!!errors.category} aria-describedby={describedBy("category")} className="field">
          <option value="">Choose a service</option>
          {menu.map((c) => (
            <option key={c.id} value={c.title}>
              {c.title}
            </option>
          ))}
        </select>
      </Field>

      <Field id={id("artist")} label="Preferred artist" optional>
        <select id={id("artist")} name="artist" value={values.artist} onChange={handleChange} className="field">
          <option value="">No preference</option>
          {artists.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}, {a.title}
            </option>
          ))}
        </select>
      </Field>

      <Field id={id("date")} label="Preferred date" error={errors.date}>
        <input id={id("date")} name="date" type="date" min={toDateInputValue(new Date())} value={values.date} onChange={handleChange} aria-invalid={!!errors.date} aria-describedby={describedBy("date")} className="field" />
      </Field>

      <Field id={id("time")} label="Preferred time" error={errors.time}>
        <select id={id("time")} name="time" value={values.time} onChange={handleChange} aria-invalid={!!errors.time} aria-describedby={describedBy("time")} className="field">
          <option value="">Choose a time</option>
          {SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </Field>

      <Field id={id("notes")} label="Notes" optional error={errors.notes} className="md:col-span-2">
        <textarea id={id("notes")} name="notes" rows={3} value={values.notes} onChange={handleChange} maxLength={NOTES_MAX} aria-invalid={!!errors.notes} aria-describedby={describedBy("notes")} className="field resize-none" placeholder="Hair length, inspiration, allergies, occasion…" />
      </Field>

      <div className="mt-6 flex flex-col items-center gap-5 md:col-span-2">
        <span className="inline-block">
          <button ref={submitRef} type="submit" disabled={isSending} data-idle-shimmer className="btn-gold min-w-[280px] disabled:opacity-70">
            {isSending ? "Sending…" : "Book an Appointment"}
          </button>
        </span>
        <p role="status" className="min-h-[1.25rem] text-sm text-[#f0b6aa]">
          {status.kind === "failed" ? "Something went wrong sending your request. Please call or message us instead." : ""}
        </p>
      </div>
    </form>
  );
}
