import { type RefObject, useEffect, useRef } from 'react';

type Pixel = { x: number; y: number; alpha: number; phase: number; speed: number };
type Ripple = { x: number; y: number; startedAt: number };
type RipplePush = { alpha: number; offsetX: number; offsetY: number; size: number };
type PixelField = {
  pixels: Pixel[];
  ripples: Ripple[];
  width: number;
  height: number;
  frame: number;
  isOnScreen: boolean;
};

const gridStep = 7;
const rippleLifetime = 1600;
const rippleInterval = 140;
const maxRipples = 6;
const noPush: RipplePush = { alpha: 0, offsetX: 0, offsetY: 0, size: 3 };

const scatterPixels = (width: number, height: number) => {
  const pixels: Pixel[] = [];
  for (let y = 0; y < height; y += gridStep) {
    const depth = y / height;
    for (let x = 0; x < width; x += gridStep) {
      if (Math.random() >= depth * depth * 0.9 + 0.02) continue;
      pixels.push({
        x,
        y,
        alpha: 0.15 + depth * 0.6,
        phase: Math.random() * 6.28,
        speed: 0.5 + Math.random() * 1.5,
      });
    }
  }
  return pixels;
};

const pushFromRipples = (pixel: Pixel, ripples: Ripple[], now: number) =>
  ripples.reduce<RipplePush>((push, ripple) => {
    const age = (now - ripple.startedAt) / 1000;
    const radius = age * 420;
    const distanceX = pixel.x - ripple.x;
    const distanceY = pixel.y - ripple.y;
    const distance = Math.hypot(distanceX, distanceY) || 1;
    const strength = Math.exp(-((distance - radius) ** 2) / 900) * (1 - age / 1.6);
    if (strength <= 0.01) return push;
    return {
      alpha: push.alpha + strength * 0.8,
      offsetX: push.offsetX + (distanceX / distance) * strength * 5,
      offsetY: push.offsetY + (distanceY / distance) * strength * 5,
      size: push.size + strength * 1.5,
    };
  }, noPush);

interface PixelRippleCanvasProps {
  areaRef: RefObject<HTMLElement | null>;
  prefersReducedMotion: boolean;
  isCovered: boolean;
}

export const PixelRippleCanvas = ({
  areaRef,
  prefersReducedMotion,
  isCovered,
}: PixelRippleCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const area = areaRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !area || !context || isCovered) return;
    const field: PixelField = {
      pixels: [],
      ripples: [],
      width: 0,
      height: 0,
      frame: 0,
      isOnScreen: false,
    };

    const drawPixels = (now: number) => {
      context.clearRect(0, 0, field.width, field.height);
      field.ripples = field.ripples.filter((ripple) => now - ripple.startedAt < rippleLifetime);
      field.pixels.forEach((pixel) => {
        const shimmer = prefersReducedMotion
          ? 1
          : 0.55 + 0.45 * Math.sin(now * 0.001 * pixel.speed + pixel.phase);
        const push = pushFromRipples(pixel, field.ripples, now);
        const alpha = pixel.alpha * shimmer + push.alpha;
        context.globalAlpha = Math.min(1, alpha);
        context.fillStyle = alpha > 0.8 ? '#1E86FF' : '#7CC8FF';
        context.fillRect(pixel.x + push.offsetX, pixel.y + push.offsetY, push.size, push.size);
      });
      context.globalAlpha = 1;
    };

    const animate = (now: number) => {
      drawPixels(now);
      field.frame = requestAnimationFrame(animate);
    };

    const startDrawing = () => {
      cancelAnimationFrame(field.frame);
      if (prefersReducedMotion) {
        field.frame = requestAnimationFrame(drawPixels);
        return;
      }
      field.frame = requestAnimationFrame(animate);
    };

    const resizeField = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      field.width = canvas.offsetWidth;
      field.height = canvas.offsetHeight;
      canvas.width = field.width * pixelRatio;
      canvas.height = field.height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      field.pixels = scatterPixels(field.width, field.height);
      if (field.isOnScreen) startDrawing();
    };

    const addRipple = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      const now = performance.now();
      const lastRipple = field.ripples.at(-1);
      if (lastRipple && now - lastRipple.startedAt <= rippleInterval) return;
      const ripple = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
        startedAt: now,
      };
      field.ripples = [...field.ripples, ripple].slice(-maxRipples);
    };

    const observer = new IntersectionObserver((entries) =>
      entries.forEach((entry) => {
        field.isOnScreen = entry.isIntersecting;
        if (field.isOnScreen) startDrawing();
        if (!field.isOnScreen) cancelAnimationFrame(field.frame);
      }),
    );

    resizeField();
    observer.observe(canvas);
    window.addEventListener('resize', resizeField);
    if (!prefersReducedMotion) area.addEventListener('pointermove', addRipple);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(field.frame);
      window.removeEventListener('resize', resizeField);
      area.removeEventListener('pointermove', addRipple);
    };
  }, [areaRef, prefersReducedMotion, isCovered]);

  return <canvas ref={canvasRef} className="pixel-ripple-canvas" />;
};
