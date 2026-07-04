import { motion } from "framer-motion";
import { useEffect } from "react";
import { staggerContainer, staggerItem } from "@/animations/variants";
import { AnimatedPage } from "@/Components/AnimatedPage/AnimatedPage";
import { SEO } from "@/Components/SEO/SEO";
import CertificationCards from "./CertificationsCards/CertificationCards";

const Certifications = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <SEO
        title="Certifications"
        description="View Joseph Sabag's professional certifications and courses in software development, including Full Stack Development from IITC and various technical credentials."
        url="/certifications"
        keywords={[
          "Certifications",
          "IITC",
          "Full Stack Development",
          "Professional Development",
          "Courses",
          "Technical Training",
        ]}
      />
      <AnimatedPage className="flex w-full flex-col items-center px-4 pb-20">
        <motion.header
          animate="visible"
          className="mb-12 pt-32 text-center"
          initial="hidden"
          variants={staggerContainer}
        >
          <motion.h1
            className="mb-4 text-4xl font-medium tracking-tight text-[var(--text-primary)] md:text-5xl"
            variants={staggerItem}
          >
            Certifications
          </motion.h1>

          <motion.p
            className="mx-auto max-w-lg text-lg text-[var(--text-secondary)]"
            variants={staggerItem}
          >
            Professional certifications and courses completed to enhance technical
            expertise and stay current with industry standards
          </motion.p>
        </motion.header>

        <CertificationCards />
      </AnimatedPage>
    </>
  );
};

export default Certifications;
