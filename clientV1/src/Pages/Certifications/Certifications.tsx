import { useEffect } from 'react';
import CertificationHeader from './CertificationHeader/CertificationHeader';
import CertificationCards from './CertificationsCards/CertificationCards';

const Certifications = () => {
  useEffect(() => {
    document.title = 'Certifications';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  return (
    <div className="flex w-full flex-col gap-10 p-5 pt-[15%] md:pt-[5%]">
      <CertificationHeader />
      <CertificationCards />
    </div>
  );
};

export default Certifications;
