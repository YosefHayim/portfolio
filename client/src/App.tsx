import { useEffect, useState } from 'react';
import { ContactLink } from './ContactLink';
import { copy, type Language } from './copy';
import { Iceberg } from './Iceberg';
import { Icon } from './Icon';
import { loadLanguage, saveLanguage } from './language';
import { PixelBand } from './PixelBand';
import { Portrait } from './Portrait';
import { ProblemCarousel } from './ProblemCarousel';
import { useReducedMotion } from './useReducedMotion';

export const App = () => {
  const [language, setLanguage] = useState<Language>(loadLanguage);
  const [motionPaused, setMotionPaused] = useState(false);
  const reduced = useReducedMotion();
  const words = copy[language];
  const paused = reduced || motionPaused;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', words.description);
  }, [language, words.description]);

  useEffect(() => {
    const sheets = document.querySelectorAll<HTMLElement>('.sheet');
    const resizeSheets = () => {
      for (const sheet of sheets) {
        const top = Math.min(8, window.innerHeight - sheet.offsetHeight - 8);
        sheet.style.setProperty('--sheet-top', `${top}px`);
      }
    };
    const observer = new ResizeObserver(resizeSheets);
    for (const sheet of sheets) observer.observe(sheet);
    window.addEventListener('resize', resizeSheets);
    resizeSheets();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeSheets);
    };
  }, []);

  const chooseLanguage = (choice: Language) => {
    setLanguage(choice);
    saveLanguage(choice);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab') document.documentElement.classList.add('keyboard-navigation');
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="site" data-motion-paused={paused}>
      <title>{words.title}</title>
      <a className="skip-link" href="#main">
        {words.skip}
      </a>
      <header className="site-header">
        <a className="brand" href="#hero" aria-label={words.brand}>
          <Portrait language={language} />
          <span>{words.name}</span>
        </a>
        <nav aria-label={words.navigation}>
          <fieldset className="language-switch" aria-label={words.language} dir="ltr">
            <button
              type="button"
              lang="en"
              aria-pressed={language === 'en'}
              onClick={() => chooseLanguage('en')}
            >
              EN
            </button>
            <button
              type="button"
              lang="he"
              aria-pressed={language === 'he'}
              onClick={() => chooseLanguage('he')}
            >
              עב
            </button>
          </fieldset>
          <ContactLink language={language} variant="dark" />
        </nav>
      </header>
      <main className="sheet-stack" id="main">
        <section className="sheet hero" id="hero" aria-labelledby="hero-title">
          <div className="hero-inner inner">
            <p className="intro">
              {words.hello} <Portrait language={language} />
            </p>
            <h1 id="hero-title">
              {words.hero}
              <br />
              <span className="muted">{words.heroMuted}</span>
            </h1>
            <p className="hero-lede">{words.lede}</p>
            <ContactLink language={language} long />
          </div>
          <PixelBand paused={paused} />
          {!reduced && (
            <button
              type="button"
              className="motion-control"
              aria-pressed={motionPaused}
              onClick={() => setMotionPaused(!motionPaused)}
            >
              <Icon name={motionPaused ? 'play' : 'pause'} />
              {motionPaused ? words.resume : words.pause}
            </button>
          )}
        </section>
        <section className="sheet" id="services" aria-labelledby="services-title">
          <div className="inner">
            <p className="eyebrow">{words.services}</p>
            <h2 id="services-title">
              {words.offersTitle}
              <br />
              <span className="muted">{words.offersMuted}</span>
            </h2>
            <div className="offers">
              {words.offers.map((offer) => (
                <article className="offer" key={offer.icon}>
                  <span className={`offer-icon offer-${offer.icon}`}>
                    <Icon name={offer.icon} />
                  </span>
                  <h3>{offer.title}</h3>
                  <p>{offer.text}</p>
                  <small>{offer.detail}</small>
                </article>
              ))}
            </div>
            <div className="arrangements">
              <p>{words.arrangements}</p>
              <ContactLink language={language} />
            </div>
          </div>
        </section>
        <section className="sheet" id="situations" aria-labelledby="problems-title">
          <div className="inner">
            <h2 id="problems-title">
              {words.problemsTitle}
              <br />
              <span className="muted">{words.problemsMuted}</span>
            </h2>
            <ProblemCarousel language={language} reduced={reduced} motionPaused={motionPaused} />
          </div>
        </section>
        <section className="sheet" id="about" aria-labelledby="about-title">
          <div className="inner about-grid">
            <div className="about-copy">
              <p className="eyebrow">{words.aboutLabel}</p>
              <h2 id="about-title">
                {words.aboutTitle}
                <br />
                <span className="muted">{words.aboutMuted}</span>
              </h2>
              {words.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <div className="signature">
                <Portrait language={language} large />
                <div>
                  <strong>{words.name}</strong>
                  <span>{words.brand}</span>
                </div>
              </div>
            </div>
            <Iceberg language={language} />
          </div>
        </section>
        <section className="sheet sunset" id="contact" aria-labelledby="contact-title">
          <div className="sunset-sky" aria-hidden="true" />
          <div className="stars" aria-hidden="true" />
          <div className="sunset-inner">
            <h2 id="contact-title">
              {words.close}
              <br />
              {words.closeLine}
              <span>{words.closeHelp}</span>
            </h2>
            <p>{words.closeText}</p>
            <ContactLink language={language} variant="white" long />
          </div>
          <footer>
            <a href="#hero">
              {words.top} <span aria-hidden="true">↑</span>
            </a>
            <span>{words.footer}</span>
          </footer>
        </section>
      </main>
    </div>
  );
};
