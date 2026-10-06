import { useEffect, useRef, useState } from 'react';
import { copy, type Language } from './copy';
import { Icon } from './Icon';
import { ScenarioScene } from './ScenarioScene';
import { nextScenario, scenarios } from './scenarios';

interface ProblemCarouselProps {
  language: Language;
  reduced: boolean;
  motionPaused: boolean;
}
export const ProblemCarousel = ({ language, reduced, motionPaused }: ProblemCarouselProps) => {
  const [selection, setSelection] = useState({
    id: 'launch',
    remaining: scenarios.en.map((scenario) => scenario.id),
    generation: 0,
  });
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [onscreen, setOnscreen] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);
  const [elapsed, setElapsed] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const words = copy[language];
  const options = scenarios[language];
  const scenario = options.find((option) => option.id === selection.id) || options[0];
  const running =
    !paused && !hovered && !focused && onscreen && visible && !reduced && !motionPaused;
  const resolved = reduced || elapsed >= 3600;

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const preview = carousel.querySelector('.scenario-preview');
    if (!preview) return;
    const checkVisibility = () => {
      const bounds = preview.getBoundingClientRect();
      const top = Math.max(bounds.top, 0);
      const bottom = Math.min(bounds.bottom, window.innerHeight);
      if (bottom <= top) {
        setOnscreen(false);
        return;
      }
      const hit = document.elementFromPoint(bounds.left + bounds.width / 2, (top + bottom) / 2);
      setOnscreen(carousel.contains(hit));
    };
    const observer = new IntersectionObserver(checkVisibility);
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility);
    const updateVisibility = () => setVisible(!document.hidden);
    observer.observe(preview);
    checkVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => setElapsed((time) => time + 100), 100);
    return () => window.clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (elapsed < 9000) return;
    const next = nextScenario(selection.remaining, selection.id, Math.random());
    setSelection({
      id: next.selected,
      remaining: next.remaining,
      generation: selection.generation + 1,
    });
    setElapsed(0);
  }, [elapsed, selection]);

  const select = (id: string) => {
    setSelection((previous) => ({
      id,
      remaining: previous.remaining.filter((candidate) => candidate !== id),
      generation: previous.generation + 1,
    }));
    setElapsed(0);
  };

  return (
    <div
      ref={carouselRef}
      className="problem-carousel"
      data-running={running}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <fieldset className="scenario-options" aria-label={words.problemsLabel}>
        {options.map((option) => (
          <button
            type="button"
            key={option.id}
            aria-pressed={option.id === scenario.id}
            aria-controls="scenario-panel"
            className="scenario-choice"
            onClick={() => select(option.id)}
          >
            <span>{option.title}</span>
            <small>{option.detail}</small>
          </button>
        ))}
      </fieldset>
      <div className="scenario-preview">
        <div className="carousel-controls">
          <span>{reduced ? words.static : words.example}</span>
          {!reduced && (
            <button
              type="button"
              className="pause-control"
              onClick={() => setPaused(!paused)}
              aria-pressed={paused}
            >
              <Icon name={paused ? 'play' : 'pause'} />
              {paused ? words.resume : words.pause}
            </button>
          )}
        </div>
        <section
          id="scenario-panel"
          className="scenario-panel"
          aria-label={scenario.title}
          aria-live="off"
          style={{ animationPlayState: running ? 'running' : 'paused' }}
        >
          <div className="scene-transition" key={`${scenario.id}-${selection.generation}`}>
            <ScenarioScene language={language} scenario={scenario} resolved={resolved} />
          </div>
          {!reduced && (
            <div className="scene-progress" aria-hidden="true">
              <div style={{ width: `${elapsed / 90}%` }} />
            </div>
          )}
        </section>
        <div className="solution" key={scenario.id}>
          <h3>{words.solution}</h3>
          <p>{scenario.solution}</p>
        </div>
      </div>
    </div>
  );
};
