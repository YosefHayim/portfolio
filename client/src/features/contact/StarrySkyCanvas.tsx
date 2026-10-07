import { useEffect, useRef } from 'react';

type Star = {
  x: number;
  y: number;
  depth: number;
  radius: number;
  speed: number;
  phase: number;
  twinkleSpeed: number;
};
type ShootingStar = { x: number; y: number; age: number; length: number };
type StarrySky = {
  stars: Star[];
  shootingStar: ShootingStar | undefined;
  nextShootingStarAt: number;
  width: number;
  height: number;
  frame: number;
  isOnScreen: boolean;
};

const areaPerStar = 2200;
const fullCircle = 6.283;
const shootingStarLifetime = 1.2;

const starHeight = (skyHeight: number) => Math.random() ** 1.6 * skyHeight * 0.75;

const scatterStars = (width: number, height: number) => {
  const count = Math.round((width * height) / areaPerStar);
  return Array.from({ length: count }, (): Star => {
    const depth = Math.random();
    return {
      x: Math.random() * width,
      y: starHeight(height),
      depth,
      radius: 0.4 + depth * 1.4,
      speed: 0.04 + depth * 0.22,
      phase: Math.random() * 6.28,
      twinkleSpeed: 0.6 + Math.random() * 2,
    };
  });
};

const driftStar = (star: Star, width: number, height: number) => {
  star.x -= star.speed;
  star.y -= star.speed * 0.18;
  if (star.x < -4) {
    star.x = width + 4;
    star.y = starHeight(height);
  }
  if (star.y < -4) star.y = height * 0.75;
};

const starAlpha = (star: Star, height: number, now: number, prefersReducedMotion: boolean) => {
  const fade = Math.max(0, 1 - star.y / (height * 0.78));
  const twinkle = prefersReducedMotion
    ? 1
    : 0.55 + 0.45 * Math.sin(now * 0.001 * star.twinkleSpeed + star.phase);
  return fade * twinkle * (0.35 + star.depth * 0.65);
};

const drawStar = (context: CanvasRenderingContext2D, star: Star, alpha: number) => {
  context.globalAlpha = alpha;
  context.fillStyle = '#fff';
  context.beginPath();
  context.arc(star.x, star.y, star.radius, 0, fullCircle);
  context.fill();
  if (star.depth <= 0.88) return;
  context.globalAlpha = alpha * 0.5;
  context.fillRect(star.x - star.radius * 3, star.y - 0.4, star.radius * 6, 0.8);
  context.fillRect(star.x - 0.4, star.y - star.radius * 3, 0.8, star.radius * 6);
};

const launchShootingStar = (width: number, height: number): ShootingStar => ({
  x: width * (0.4 + Math.random() * 0.55),
  y: height * (0.04 + Math.random() * 0.25),
  age: 0,
  length: 120 + Math.random() * 80,
});

const drawShootingStar = (
  context: CanvasRenderingContext2D,
  shootingStar: ShootingStar,
  width: number,
) => {
  const progress = shootingStar.age / shootingStarLifetime;
  const headX = shootingStar.x - progress * width * 0.35;
  const headY = shootingStar.y + progress * width * 0.14;
  const tailX = headX + shootingStar.length;
  const tailY = headY - shootingStar.length * 0.4;
  const trail = context.createLinearGradient(headX, headY, tailX, tailY);
  trail.addColorStop(0, 'rgba(255,255,255,.95)');
  trail.addColorStop(1, 'rgba(255,255,255,0)');
  const visibleProgress = Math.min(progress, 1);
  context.globalAlpha = Math.sin(visibleProgress * Math.PI);
  context.strokeStyle = trail;
  context.lineWidth = 1.6;
  context.beginPath();
  context.moveTo(headX, headY);
  context.lineTo(tailX, tailY);
  context.stroke();
  context.fillStyle = '#fff';
  context.beginPath();
  context.arc(headX, headY, 1.6, 0, fullCircle);
  context.fill();
};

export const StarrySkyCanvas = ({ prefersReducedMotion }: { prefersReducedMotion: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const sky: StarrySky = {
      stars: [],
      shootingStar: undefined,
      nextShootingStarAt: performance.now() + 2500,
      width: 0,
      height: 0,
      frame: 0,
      isOnScreen: false,
    };

    const moveShootingStar = (now: number) => {
      if (!sky.shootingStar && now > sky.nextShootingStarAt) {
        sky.shootingStar = launchShootingStar(sky.width, sky.height);
        sky.nextShootingStarAt = now + 4000 + Math.random() * 4000;
      }
      if (!sky.shootingStar) return;
      sky.shootingStar.age += 1 / 60;
      drawShootingStar(context, sky.shootingStar, sky.width);
      if (sky.shootingStar.age >= shootingStarLifetime) sky.shootingStar = undefined;
    };

    const drawSky = (now: number) => {
      context.clearRect(0, 0, sky.width, sky.height);
      sky.stars.forEach((star) => {
        if (!prefersReducedMotion) driftStar(star, sky.width, sky.height);
        const alpha = starAlpha(star, sky.height, now, prefersReducedMotion);
        if (alpha < 0.02) return;
        drawStar(context, star, alpha);
      });
      if (!prefersReducedMotion) moveShootingStar(now);
      context.globalAlpha = 1;
    };

    const animate = (now: number) => {
      drawSky(now);
      sky.frame = requestAnimationFrame(animate);
    };

    const startDrawing = () => {
      cancelAnimationFrame(sky.frame);
      if (prefersReducedMotion) {
        sky.frame = requestAnimationFrame(drawSky);
        return;
      }
      sky.frame = requestAnimationFrame(animate);
    };

    const resizeSky = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      sky.width = canvas.offsetWidth;
      sky.height = canvas.offsetHeight;
      canvas.width = sky.width * pixelRatio;
      canvas.height = sky.height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      sky.stars = scatterStars(sky.width, sky.height);
      if (sky.isOnScreen) startDrawing();
    };

    const observer = new IntersectionObserver((entries) =>
      entries.forEach((entry) => {
        sky.isOnScreen = entry.isIntersecting;
        if (sky.isOnScreen) startDrawing();
        if (!sky.isOnScreen) cancelAnimationFrame(sky.frame);
      }),
    );

    resizeSky();
    observer.observe(canvas);
    window.addEventListener('resize', resizeSky);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(sky.frame);
      window.removeEventListener('resize', resizeSky);
    };
  }, [prefersReducedMotion]);

  return <canvas ref={canvasRef} className="starry-sky-canvas" />;
};
