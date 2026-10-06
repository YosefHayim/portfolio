import { copy, type Language } from './copy';
import { Icon } from './Icon';
import type { Scenario } from './scenarios';

interface ScenarioSceneProps {
  scenario: Scenario;
  language: Language;
  resolved: boolean;
}
export const ScenarioScene = ({ scenario, language, resolved }: ScenarioSceneProps) => {
  const words = copy[language];
  const steps = resolved ? scenario.after : scenario.before;
  const sceneIcon = resolved ? 'check' : 'chat';
  return (
    <div className={`scene scene-${scenario.id}`} data-resolved={resolved}>
      <div className="scene-window" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{words.example}</span>
      </div>
      <div className="scene-content">
        <p className="scene-heading">{resolved ? words.after : words.before}</p>
        {scenario.id === 'speed' && (
          <div className="speed-dial" aria-hidden="true">
            <div className="dial-needle" />
          </div>
        )}
        {scenario.id === 'partner' && (
          <div className="partner-pair" aria-hidden="true">
            <span>
              <Icon name="launch" />
            </span>
            <b>+</b>
            <img src="/avatar.webp" width="72" height="72" alt="" />
          </div>
        )}
        <div className="scene-steps" key={String(resolved)}>
          {steps.map((step) => (
            <div className="scene-step" key={step}>
              <span className="step-icon">
                <Icon name={sceneIcon} />
              </span>
              <span dir="auto">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
