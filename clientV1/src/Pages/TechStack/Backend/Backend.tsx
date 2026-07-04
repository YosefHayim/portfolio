import { FaEbay, FaGoogle, FaNodeJs } from 'react-icons/fa';
import {
  SiExpress,
  SiJsonwebtokens,
  SiLetsencrypt,
  SiMongoose,
  SiSharp,
} from 'react-icons/si';
import TechRow from '../TechRow/TechRow';
import { ImPaypal } from 'react-icons/im';
import SvgTemplate from '@/Components/SvgTemplate/SvgTemplate';
import ejsSvg from '/svgs/ejs.svg';
import { LiaTelegramPlane } from 'react-icons/lia';

const backendTech = [
  { name: 'Node.js', icon: <FaNodeJs size={20} /> },
  { name: 'Express', icon: <SiExpress size={20} /> },
  { name: 'JWT', icon: <SiJsonwebtokens size={20} /> },
  { name: 'Bcrypt', icon: <SiLetsencrypt size={20} /> },
  { name: 'Mongoose', icon: <SiMongoose size={20} /> },
  { name: 'Sharp', icon: <SiSharp size={20} /> },
  { name: 'Paypal API', icon: <ImPaypal size={20} /> },
  { name: 'Google Authentication', icon: <FaGoogle size={20} /> },
  { name: 'Ebay', icon: <FaEbay size={20} /> },
  {
    name: 'Grammy JS',
    icon: <LiaTelegramPlane size={20} />,
  },
  {
    name: 'Ejs',
    icon: (
      <SvgTemplate
        children={
          <img alt="Ejs Icon" src={ejsSvg} className="h-[1.5rem]"></img>
        }
      />
    ),
  },
];

const Backend = () => {
  return (
    <div>
      <h2 className="pb-2">Backend</h2>
      <div className="flex flex-wrap items-center justify-start gap-2 rounded-sm bg-gray-800 p-4">
        {backendTech.map((tech) => (
          <TechRow techName={tech.name} key={tech.name}>
            {tech.icon}
          </TechRow>
        ))}
      </div>
    </div>
  );
};

export default Backend;
