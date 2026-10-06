import { copy, type Language } from './copy';
import { Icon } from './Icon';

const responsibilityIcons = [
  'lock',
  'payment',
  'information',
  'check',
  'shield',
  'bell',
  'backup',
  'growth',
];
export const Iceberg = ({ language }: { language: Language }) => {
  const words = copy[language];
  return (
    <figure className="iceberg">
      <figcaption>
        <strong>{words.icebergTitle}</strong>
        <span>{words.icebergCaption}</span>
      </figcaption>
      <div className="iceberg-visual">
        <div className="iceberg-art" aria-hidden="true">
          <svg aria-hidden="true" viewBox="0 0 520 650" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sky" x2="0" y2="1">
                <stop stopColor="#eaf6ff" />
                <stop offset="1" stopColor="#bcdff7" />
              </linearGradient>
              <linearGradient id="sea" x2="0.25" y2="1">
                <stop stopColor="#258cc2" />
                <stop offset="0.35" stopColor="#14598a" />
                <stop offset="1" stopColor="#092a50" />
              </linearGradient>
              <linearGradient id="ice" x2="0.8" y2="1">
                <stop stopColor="#def6ff" stopOpacity=".85" />
                <stop offset=".5" stopColor="#7ebbe8" stopOpacity=".4" />
                <stop offset="1" stopColor="#4584b5" stopOpacity=".12" />
              </linearGradient>
              <radialGradient id="sun">
                <stop stopColor="#fff" />
                <stop offset=".5" stopColor="#fff5d6" stopOpacity=".7" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="ray" x2="0.2" y2="1">
                <stop stopColor="#d4f2ff" stopOpacity=".35" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path fill="url(#sky)" d="M0 0h520v210H0Z" />
            <circle cx="405" cy="64" r="90" fill="url(#sun)" />
            <path d="m94 203 87-106 51 29 51-65 83 89 67 53Z" fill="#f4fcff" />
            <path
              d="m94 203 87-106 15 106Zm138-77 51-65-21 142Zm51-65 83 89-104 53Z"
              fill="#c1e4f7"
            />
            <path d="m181 97 51 29-36 77Zm102-36 44 142-65 0Z" fill="#dceffa" />
            <path d="m366 150 67 53H327Z" fill="#a5d2ed" />
            <path d="M0 200q65-12 130 0t130 0 130 0 130 0V650H0Z" fill="url(#sea)" />
            <path
              d="m70 201 112 13 65 359-173-51ZM336 201l56 0 100 420-85 0ZM239 204l22 0 42 359-65 0Z"
              fill="url(#ray)"
            />
            <path d="m95 203 336 0 36 121-82 169-122 126L128 510 59 343Z" fill="url(#ice)" />
            <path
              d="m95 203 122 123-158 17Zm122 123 46 293-135-109Zm0 0 214-123-46 290Z"
              fill="#a5daf5"
              opacity=".23"
            />
            <path
              d="m95 203 122 123 46 293m-46-293 214-123m-214 123L59 343m158-17 168 167-122 126m-46-293-89 184"
              fill="none"
              stroke="#d7f4ff"
              strokeOpacity=".24"
              strokeWidth="1.5"
            />
            <path
              d="M0 202q65-12 130 0t130 0 130 0 130 0"
              fill="none"
              stroke="#e3faff"
              strokeWidth="4"
              opacity=".8"
            />
            <path
              d="M40 215q48 9 80 0m225 1q55 12 110 0"
              fill="none"
              stroke="#bceaff"
              strokeWidth="2"
              opacity=".5"
            />
            <g fill="none" stroke="#9cd5f5" opacity=".4">
              <circle cx="41" cy="290" r="4" />
              <circle cx="479" cy="397" r="5" />
              <circle cx="87" cy="562" r="3" />
              <circle cx="435" cy="586" r="4" />
            </g>
          </svg>
        </div>
        <div className="iceberg-top">
          <span>{words.demo}</span>
          <div className="demo-window">
            <div />
            <i />
            <i />
          </div>
        </div>
        <div className="iceberg-below">
          <p>{words.underwater}</p>
          <ul>
            {words.responsibilities.map((responsibility, position) => (
              <li key={responsibility}>
                <span>
                  <Icon name={responsibilityIcons[position]} />
                </span>
                {responsibility}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </figure>
  );
};
