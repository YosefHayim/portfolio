import { type RefObject, useRef } from 'react';
import type { Language } from '../language/savedLanguage';
import { aboutText } from './about.text';
import { icebergLayers } from './icebergLayers';
import { useIcebergToggle } from './useIcebergToggle';
import { useTiltTowardPointer } from './useTiltTowardPointer';

const airBubbles = [
  { left: '10%', '--rise-duration': '12s', '--rise-delay': '-6s', '--bubble-scale': 0.6 },
  { left: '44%', '--rise-duration': '10s', '--rise-delay': '-1s', '--bubble-scale': 0.8 },
  { left: '58%', '--rise-duration': '13s', '--rise-delay': '-8s', '--bubble-scale': 0.5 },
  { left: '92%', '--rise-duration': '11s', '--rise-delay': '-4s', '--bubble-scale': 0.7 },
  { left: '18%', '--rise-duration': '7s', '--rise-delay': '0s', '--bubble-scale': 1 },
  { left: '30%', '--rise-duration': '9s', '--rise-delay': '-3s', '--bubble-scale': 1 },
  { left: '72%', '--rise-duration': '8s', '--rise-delay': '-5s', '--bubble-scale': 1 },
  { left: '84%', '--rise-duration': '10s', '--rise-delay': '-2s', '--bubble-scale': 1 },
];

const underwaterRays = [0, 1, 2, 3, 4];

interface IcebergProps {
  language: Language;
  prefersReducedMotion: boolean;
  isCovered: boolean;
  tiltAreaRef: RefObject<HTMLElement | null>;
}

export const Iceberg = ({
  language,
  prefersReducedMotion,
  isCovered,
  tiltAreaRef,
}: IcebergProps) => {
  const icebergRef = useRef<HTMLDivElement>(null);
  const isShowingUnderwater = useIcebergToggle(icebergRef, prefersReducedMotion, isCovered);
  useTiltTowardPointer(tiltAreaRef, icebergRef, prefersReducedMotion);
  const text = aboutText[language];

  return (
    <figure className="iceberg-figure reveal-on-scroll" aria-label={text.icebergLabel}>
      <div
        ref={icebergRef}
        className={isShowingUnderwater ? 'iceberg is-showing-underwater' : 'iceberg'}
      >
        <p className="iceberg-caption">
          {text.icebergCaption}
          <br />
          <b>{text.icebergCaptionBold}</b>
        </p>
        <div className="iceberg-sun" aria-hidden="true" />
        <span className="iceberg-cloud is-large" aria-hidden="true" />
        <span className="iceberg-cloud is-small" aria-hidden="true" />
        <div className="iceberg-tip">
          <div className="demo-window">
            <span>
              <i />
              <i />
              <i />
            </span>
            <div className="demo-window-line" style={{ width: '70%' }} />
            <div className="demo-window-line" style={{ width: '45%' }} />
          </div>
          <span className="demo-label">{text.demoLabel}</span>
          <svg
            className="iceberg-peak"
            viewBox="0 0 120 40"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 40 L38 6 L60 14 L84 0 L120 40Z" />
          </svg>
        </div>
        <div className="iceberg-sea">
          <div className="underwater-rays" aria-hidden="true">
            {underwaterRays.map((ray) => (
              <i key={ray} />
            ))}
          </div>
          <svg
            className="iceberg-body"
            viewBox="0 0 300 300"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M112 0 L190 0 L242 58 L282 160 L246 262 L150 298 L58 266 L18 156 L62 54 Z" />
            <path
              className="iceberg-facets"
              d="M112 0 L150 70 L190 0 M150 70 L242 58 M150 70 L62 54 M150 70 L170 170 L282 160 M170 170 L246 262 M170 170 L150 298 M170 170 L90 190 L18 156 M90 190 L58 266 M90 190 L62 54"
            />
          </svg>
          <div className="depth-labels" aria-hidden="true">
            <span>{text.visibleShare}</span>
            <span>{text.hiddenShare}</span>
          </div>
          <ul className="hidden-layers">
            {icebergLayers.map((layer, order) => (
              <li key={layer.name} style={{ '--order': order }}>
                <span className="layer-icon">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {layer.iconShapes}
                  </svg>
                </span>
                {text.layers[layer.name]}
              </li>
            ))}
          </ul>
          {airBubbles.map((bubble) => (
            <span key={bubble.left} className="air-bubble" style={bubble} />
          ))}
        </div>
        <div className="iceberg-waves" aria-hidden="true">
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 22 Q 50 8 100 22 T 200 22 T 300 22 T 400 22 T 500 22 T 600 22 T 700 22 T 800 22 T 900 22 T 1000 22 T 1100 22 T 1200 22 V40 H0Z" />
          </svg>
          <svg
            className="light-wave"
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 24 Q 75 12 150 24 T 300 24 T 450 24 T 600 24 T 750 24 T 900 24 T 1050 24 T 1200 24 V40 H0Z" />
          </svg>
        </div>
      </div>
    </figure>
  );
};
