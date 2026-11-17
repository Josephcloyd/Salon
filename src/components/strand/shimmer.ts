/**
 * Tiny gold shimmer particles that trail the tip of the Golden Strand.
 * Canvas-based, capped particle count, sprite-blitted (no per-frame shadows).
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

const MAX_PARTICLES = 90;
const LIFE_DECAY = 0.018;

function makeSprite(): HTMLCanvasElement {
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 32;
  const ctx = sprite.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, "rgba(255, 240, 205, 1)");
    g.addColorStop(0.3, "rgba(231, 201, 140, 0.8)");
    g.addColorStop(1, "rgba(201, 166, 107, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 32, 32);
  }
  return sprite;
}

export interface Shimmer {
  /** Pass the strand tip in viewport coordinates, or null when it is idle. */
  update: (tip: { x: number; y: number } | null) => void;
  destroy: () => void;
}

export function createShimmer(canvas: HTMLCanvasElement): Shimmer | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const sprite = makeSprite();
  let particles: Particle[] = [];
  let lastTip: { x: number; y: number } | null = null;
  let dpr = 1;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
  };
  resize();
  window.addEventListener("resize", resize);

  const spawn = (tip: { x: number; y: number }, count: number): Particle[] =>
    Array.from({ length: count }, () => ({
      x: tip.x + (Math.random() - 0.5) * 6,
      y: tip.y + (Math.random() - 0.5) * 6,
      vx: (Math.random() - 0.5) * 0.7,
      vy: Math.random() * 0.6 - 0.15,
      life: 1,
      size: 3 + Math.random() * 7,
    }));

  const update: Shimmer["update"] = (tip) => {
    const isMoving = tip && lastTip && Math.hypot(tip.x - lastTip.x, tip.y - lastTip.y) > 0.6;
    const born = isMoving && tip ? spawn(tip, 2) : [];
    lastTip = tip;

    particles = [...particles, ...born]
      .slice(-MAX_PARTICLES)
      .map((p) => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.012, life: p.life - LIFE_DECAY }))
      .filter((p) => p.life > 0);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (particles.length === 0) return;
    ctx.globalCompositeOperation = "lighter";
    for (const p of particles) {
      ctx.globalAlpha = p.life * 0.85;
      const s = p.size * (0.4 + p.life * 0.6);
      ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  };

  return {
    update,
    destroy: () => {
      window.removeEventListener("resize", resize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = [];
    },
  };
}
