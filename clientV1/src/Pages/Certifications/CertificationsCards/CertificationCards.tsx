import { FaGithubAlt, FaNodeJs, FaPython, FaReact } from 'react-icons/fa';
import CertificationCard from '../CertificationCard/CertificationCard';
import { SiExpress, SiUdemy, SiVercel } from 'react-icons/si';
import { IoLogoJavascript } from 'react-icons/io5';
import { SiSocketdotio } from 'react-icons/si';
import { BiLogoMongodb } from 'react-icons/bi';

const CertificationCards = () => {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-2">
      <CertificationCard
        icon={<FaGithubAlt size={30} />}
        certificateTitle={'GitHub Actions - The Complete Guide'}
        yearEarnedCertificate={'Sep 2025'}
        certificateLink={
          'https://www.udemy.com/certificate/UC-6da4399d-15db-4b8c-84ec-3b56953a0766/'
        }
      ></CertificationCard>
      <CertificationCard
        icon={<SiVercel size={30} />}
        certificateTitle={'Next.js App Router Fundamentals'}
        yearEarnedCertificate={'Sep 2025'}
        certificateLink={
          'https://www.linkedin.com/in/yosef-hayim-sabag/details/certifications/1758366776092/single-media-viewer/?profileId=ACoAADtj-18BDUMzABOGjZh335dfWV5OYcgy63g'
        }
      ></CertificationCard>
      <CertificationCard
        icon={<SiUdemy size={30} />}
        certificateTitle={'Pre-Programming: Everything you need to know before you code'}
        yearEarnedCertificate={'Jul 2025'}
        certificateLink={
          'https://www.udemy.com/certificate/UC-89fff14a-926b-4b95-ac36-683830f2c1ef/'
        }
      ></CertificationCard>
      <CertificationCard
        icon={<FaReact size={30} />}
        certificateTitle={'React Native - The Practical Guide [2025]'}
        yearEarnedCertificate={'Jun 2025'}
        certificateLink={
          'https://www.udemy.com/certificate/UC-fb20f1dd-ba51-4300-b378-b46c170f30b8/'
        }
      ></CertificationCard>
      <CertificationCard
        icon={<SiSocketdotio size={30} />}
        certificateTitle={'SocketIO v4, with websockets - the details.'}
        yearEarnedCertificate={'May 2025'}
        certificateLink={
          'https://www.udemy.com/certificate/UC-af93b5ef-9560-4c05-83ee-fa66c34ef2f0/'
        }
      ></CertificationCard>
      <CertificationCard
        icon={<FaNodeJs size={30} />}
        certificateTitle={'JavaScript Algorithms and Data Structures Masterclass'}
        yearEarnedCertificate={'May 2025'}
        certificateLink={
          'https://www.udemy.com/certificate/UC-5c06abf7-d52f-4978-8031-4cf492d8b549/'
        }
      ></CertificationCard>
      <CertificationCard
        icon={<div className='flex gap-2 items-start'><SiExpress size={30} />
          <BiLogoMongodb size={30} />
          <FaNodeJs size={30} />

        </div>}
        certificateTitle={
          'Node.js, Express, MongoDB & More: The Complete Bootcamp'
        }
        yearEarnedCertificate={'Feb 2025'}
        certificateLink={
          'https://www.udemy.com/certificate/UC-830343b5-2bb6-44ae-baf3-af70748ea84c/'
        }
      ></CertificationCard>
      <CertificationCard
        icon={<IoLogoJavascript size={30} />}
        certificateTitle={'The Complete Full-Stack Web Development Bootcamp'}
        yearEarnedCertificate={'Nov 2024'}
        certificateLink={
          'https://www.udemy.com/certificate/UC-2bc9ed93-536f-4dd1-9aeb-45821941d8bc/?utm_campaign=email&utm_medium=email&utm_source=sendgrid.com'
        }
      ></CertificationCard>
      <CertificationCard
        icon={<FaPython size={30} />}
        certificateTitle={'100 Days of Code: The Complete Python Pro Bootcamp'}
        yearEarnedCertificate={'Oct 2024'}
        certificateLink={
          'https://www.udemy.com/certificate/UC-65f92c9d-6851-4700-9ced-8cfa8d192b41/?utm_campaign=email&utm_medium=email&utm_source=sendgrid.com'
        }
      ></CertificationCard>
    </div>
  );
};
export default CertificationCards;
