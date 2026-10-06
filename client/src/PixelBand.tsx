import { useEffect, useRef } from 'react';

interface PixelBandProps {
  paused: boolean;
}
type Pixel = { x: number; y: number; phase: number; opacity: number };

const createPixels = (width: number, height: number): Pixel[] => {
  const columns = Math.ceil(width / 8);
  const cells = Array.from({ length: columns * 18 }, (_, position) => position);
  const pixels: Pixel[] = [];
  for (const position of cells) {
    const x = (position % columns) * 8;
    const y = Math.floor(position / columns) * 8;
    const seed = Math.sin(position * 127.1) * 43758.5453;
    const density = seed - Math.floor(seed);
    if (density > (y / height) ** 2 * 0.8) continue;
    pixels.push({ x, y, phase: position, opacity: y / height });
  }
  return pixels;
};

export const PixelBand = ({ paused }: PixelBandProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const state: { frame: number; visible: boolean; pixels: Pixel[] } = {
      frame: 0,
      visible: false,
      pixels: [],
    };
    const draw = (now: number) => {
      context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      context.fillStyle = '#3bb2ff';
      for (const pixel of state.pixels) {
        const shimmer = paused ? 0.6 : 0.55 + 0.4 * Math.sin(now * 0.001 + pixel.phase);
        context.globalAlpha = pixel.opacity * shimmer;
        context.fillRect(pixel.x, pixel.y, 3, 3);
      }
      if (state.visible && !paused && !document.hidden) state.frame = requestAnimationFrame(draw);
    };
    const restart = () => {
      cancelAnimationFrame(state.frame);
      state.frame = requestAnimationFrame(draw);
    };
    const checkVisibility = () => {
      const bounds = canvas.getBoundingClientRect();
      const hit = document.elementFromPoint(
        bounds.left + bounds.width / 2,
        bounds.top + bounds.height / 2,
      );
      state.visible = Boolean(hit && canvas.parentElement?.contains(hit));
      restart();
    };
    const resize = new ResizeObserver(() => {
      const ratio = Math.min(devicePixelRatio, 2);
      canvas.width = canvas.clientWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      state.pixels = createPixels(canvas.clientWidth, canvas.clientHeight);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      checkVisibility();
    });
    const visibility = new IntersectionObserver(checkVisibility);
    resize.observe(canvas);
    visibility.observe(canvas);
    window.addEventListener('scroll', checkVisibility, { passive: true });
    document.addEventListener('visibilitychange', checkVisibility);
    return () => {
      cancelAnimationFrame(state.frame);
      resize.disconnect();
      visibility.disconnect();
      window.removeEventListener('scroll', checkVisibility);
      document.removeEventListener('visibilitychange', checkVisibility);
    };
  }, [paused]);
  return <canvas ref={canvasRef} className="pixel-band" aria-hidden="true" tabIndex={-1} />;
};
