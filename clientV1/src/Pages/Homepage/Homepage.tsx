import { AnimatedPage } from '@/Components/AnimatedPage/AnimatedPage';
import Hero from './Hero/Hero';
import PassionSection from './PassionSection/PassionSection';
import WhoAmI from './WhoAmI/WhoAmI';
import { useEffect } from 'react';

const Homepage = () => {
  useEffect(() => {
    document.title = 'Joseph Sabag | AI Software Engineer';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AnimatedPage className="flex w-full flex-col items-center px-4 pb-20">
      <Hero />
      <PassionSection />
      <WhoAmI />
    </AnimatedPage>
  );
};

export default Homepage;
