"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "@/lib/gsap";
import { buildStrand, lengthAtProgress, pointAtLength, type Ellipse, type StrandGeometry, type StrandLayout, type StrandMode } from "./geometry";
import { createShimmer } from "./shimmer";

const MODES: ReadonlyArray<StrandMode> = ["sleek", "wave", "loose", "curl"];
const TIP_VIEWPORT_RATIO = 0.62;
const TAIL_LEAD = 140;

/**
 * Document position via the offsetParent chain. Unlike getBoundingClientRect this
 * ignores CSS transforms, so in-flight reveal animations don't skew the strand.
 */
function docRect(el: HTMLElement): { left: number; top: number; width: number; height: number } {
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent instanceof HTMLElement ? node.offsetParent : null;
  }
  return { left, top, width: el.offsetWidth, height: el.offsetHeight };
}

function toEllipse(el: HTMLElement, padX: number, padY: number): Ellipse {
  const r = docRect(el);
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, rx: r.width / 2 + padX, ry: r.height / 2 + padY };
}

/** Reads `data-strand*` markers from the page and turns them into a layout description. */
function measureLayout(simplified: boolean): StrandLayout {
  const width = document.documentElement.clientWidth;
  const vh = window.innerHeight;

  const zones = Array.from(document.querySelectorAll<HTMLElement>("[data-strand]")).map((el) => {
    const r = docRect(el);
    const mode = MODES.find((m) => m === el.dataset.strand) ?? "wave";
    const ratio = simplified ? 0.93 : Number(el.dataset.strandX ?? 0.88);
    return { top: r.top, bottom: r.top + r.height, mode, baseX: width * ratio };
  });

  const wraps = Array.from(document.querySelectorAll<HTMLElement>("[data-strand-wrap]")).map((el) => toEllipse(el, 38, 30));
  const bowEl = document.querySelector<HTMLElement>("[data-strand-bow]");

  return {
    width,
    startY: vh * TIP_VIEWPORT_RATIO,
    zones,
    wraps,
    bow: bowEl ? toEllipse(bowEl, 22, 18) : null,
    endY: document.documentElement.scrollHeight - vh * 0.4,
    simplified,
  };
}

/**
 * The signature "Golden Strand": one gold line that draws itself with scroll,
 * changes character per section, curls around headings and ties a bow around
 * the booking CTA. Fixed SVG translated by scroll, so only the viewport is painted.
 */
export function GoldenStrand() {
  const svgGroup = useRef<SVGGElement>(null);
  const line = useRef<SVGPathElement>(null);
  const halo = useRef<SVGPathElement>(null);
  const tail = useRef<SVGPathElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(() => {
    const group = svgGroup.current;
    const main = line.current;
    const glow = halo.current;
    const ribbon = tail.current;
    if (!group || !main || !glow || !ribbon) return;

    const reduceMotion = window.matchMedia(MOTION.reduce).matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const shimmer = !reduceMotion && isDesktop && canvas.current ? createShimmer(canvas.current) : null;

    let geom: StrandGeometry | null = null;
    let drawn = 0;
    let tailLength = 0;
    let isBowTied = false;

    const rebuild = () => {
      geom = buildStrand(measureLayout(!isDesktop));
      main.setAttribute("d", geom.d);
      glow.setAttribute("d", geom.d);
      ribbon.setAttribute("d", geom.tailD);
      const dash = `${geom.total} ${geom.total}`;
      main.style.strokeDasharray = dash;
      glow.style.strokeDasharray = dash;
      tailLength = geom.tailD ? ribbon.getTotalLength() : 0;
      ribbon.style.strokeDasharray = `${tailLength} ${tailLength}`;
      drawn = Math.min(drawn, geom.total);
    };

    const render = () => {
      if (!geom) return;
      const scrollY = window.scrollY;
      group.setAttribute("transform", `translate(0 ${-scrollY})`);

      const target = reduceMotion || isBowTied ? geom.total : lengthAtProgress(geom, scrollY + window.innerHeight * TIP_VIEWPORT_RATIO);
      const rate = isBowTied && drawn > geom.bowLength ? 0.035 : 0.14;
      drawn = reduceMotion ? target : drawn + (target - drawn) * rate;
      if (Math.abs(target - drawn) < 0.2) drawn = target;

      const offset = String(geom.total - drawn);
      main.style.strokeDashoffset = offset;
      glow.style.strokeDashoffset = offset;
      const tailProgress = gsap.utils.clamp(0, 1, (drawn - (geom.total - TAIL_LEAD)) / TAIL_LEAD);
      ribbon.style.strokeDashoffset = String(tailLength * (1 - tailProgress));

      if (shimmer) {
        const tip = drawn > 0 && drawn < geom.total - 0.5 ? pointAtLength(geom, drawn) : null;
        shimmer.update(tip ? { x: tip.x, y: tip.y - scrollY } : null);
      }
    };

    rebuild();
    render();
    ScrollTrigger.addEventListener("refresh", rebuild);
    gsap.ticker.add(render);
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined);

    const bowTarget = document.querySelector("[data-strand-bow]");
    const bowTrigger = bowTarget
      ? ScrollTrigger.create({
          trigger: bowTarget,
          start: "top 82%",
          onEnter: () => {
            isBowTied = true;
          },
          onLeaveBack: () => {
            isBowTied = false;
          },
        })
      : null;

    return () => {
      ScrollTrigger.removeEventListener("refresh", rebuild);
      gsap.ticker.remove(render);
      bowTrigger?.kill();
      shimmer?.destroy();
    };
  });

  return (
    <>
      <svg className="pointer-events-none fixed inset-0 z-40 h-full w-full" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="strand-gold" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="160" y2="720" spreadMethod="reflect">
            <stop offset="0%" stopColor="#9a7540" />
            <stop offset="45%" stopColor="#f0dcb0" />
            <stop offset="70%" stopColor="#c9a66b" />
            <stop offset="100%" stopColor="#a8834b" />
          </linearGradient>
        </defs>
        <g ref={svgGroup} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path ref={halo} stroke="url(#strand-gold)" strokeWidth="7" opacity="0.14" />
          <path ref={line} stroke="url(#strand-gold)" strokeWidth="1.6" />
          <path ref={tail} stroke="url(#strand-gold)" strokeWidth="1.6" />
        </g>
      </svg>
      <canvas ref={canvas} className="pointer-events-none fixed inset-0 z-40 hidden h-full w-full lg:block" aria-hidden="true" />
    </>
  );
}
