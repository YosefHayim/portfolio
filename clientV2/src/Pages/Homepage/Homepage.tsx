import { useEffect } from "react";
import { AnimatedPage } from "@/Components/AnimatedPage/AnimatedPage";
import { SEO } from "@/Components/SEO/SEO";
import Hero from "./Hero/Hero";
import PassionSection from "./PassionSection/PassionSection";
import WhoAmI from "./WhoAmI/WhoAmI";

const Homepage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <SEO
        description="Joseph Sabag - AI Software Engineer building impactful software solutions. Specializing in React, Node.js, TypeScript, and AI integrations. View my projects and experience."
        url="/"
        keywords={[
          "Joseph Sabag",
          "AI Software Engineer",
          "Full Stack Developer",
          "React Developer",
          "Node.js",
          "TypeScript",
          "Portfolio",
          "Israel",
        ]}
      />
      <AnimatedPage className="flex w-full flex-col items-center px-4 pb-20">
        <Hero />
        <PassionSection />
        <WhoAmI />
      </AnimatedPage>
    </>
  );
};

export default Homepage;
