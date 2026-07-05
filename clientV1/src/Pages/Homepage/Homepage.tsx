import { useEffect } from 'react';
import Hero from './Hero/Hero';
import WhoAmI from './WhoAmI/WhoAmI';

const Homepage = () => {
  useEffect(() => {
    document.title = 'Homepage';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  return (
    <div className="flex w-full flex-col gap-10 p-5 pt-[15%] md:pt-[5%]">
      <Hero />
      <WhoAmI />
    </div>
  );
};

export default Homepage;
