"use client";

import { gsap, EASE } from "./gsap";
import { formatNumber } from "./format";

interface RevealOptions {
  y?: number;
  stagger?: number;
  start?: string;
  delay?: number;
  duration?: number;
}

/** Fade + slide targets up once their trigger scrolls into view. */
export function revealUp(
  targets: gsap.TweenTarget,
  trigger: Element,
  { y = 40, stagger = 0.08, start = "top 82%", delay = 0, duration = 1.4 }: RevealOptions = {},
): gsap.core.Tween {
  return gsap.from(targets, {
    y,
    autoAlpha: 0,
    duration,
    delay,
    stagger,
    ease: EASE.luxe,
    scrollTrigger: { trigger, start, once: true },
  });
}

/** Simple opacity fade, used as the reduced-motion fallback. */
export function fadeIn(targets: gsap.TweenTarget, trigger: Element, start = "top 85%"): gsap.core.Tween {
  return gsap.from(targets, {
    autoAlpha: 0,
    duration: 0.6,
    ease: "power1.out",
    scrollTrigger: { trigger, start, once: true },
  });
}

interface CountUpOptions {
  decimals?: number;
  duration?: number;
  delay?: number;
  format?: (value: number) => string;
  suffix?: string;
}

/** Counts an element's text from 0 to `to`. */
export function countUp(
  el: HTMLElement,
  to: number,
  { decimals = 0, duration = 2.2, delay = 0, format, suffix = "" }: CountUpOptions = {},
): gsap.core.Tween {
  const render = format ?? ((n: number) => formatNumber(n, decimals));
  const counter = { value: 0 };
  el.textContent = render(0) + suffix;
  return gsap.to(counter, {
    value: to,
    duration,
    delay,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = render(counter.value) + suffix;
    },
  });
}

/** Prepares an SVG path for a stroke-draw animation and returns its length. */
export function primeStroke(path: SVGGeometryElement): number {
  const length = path.getTotalLength();
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
  return length;
}
