import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaAws,
  FaDocker,
  FaGithub,
} from 'react-icons/fa';
import {
  SiTypescript,
  SiJavascript,
  SiMongodb,
  SiExpress,
  SiTailwindcss,
  SiRedux,
  SiNextdotjs,
  SiSupabase,
  SiFirebase,
  SiJest,
  SiVitest,
  SiZod,
  SiSocketdotio,
  SiOpenai,
  SiStripe,
  SiPaypal,
  SiBinance,
  SiSelenium,
  SiTelegram,
  SiPostman,
  SiAxios,
  SiReactquery,
  SiGooglecloud,
  SiNpm,
} from 'react-icons/si';
import { TbBrandReactNative, TbApi } from 'react-icons/tb';
import { BiLogoPostgresql } from 'react-icons/bi';
import { VscJson } from 'react-icons/vsc';
import { BsFileCode, BsGear } from 'react-icons/bs';

type TechIconMap = Record<string, React.ReactNode>;

const ICON_SIZE = 14;

const techIconMap: TechIconMap = {
  react: <FaReact size={ICON_SIZE} className="text-[#61DAFB]" />,
  'react native': (
    <TbBrandReactNative size={ICON_SIZE} className="text-[#61DAFB]" />
  ),
  typescript: <SiTypescript size={ICON_SIZE} className="text-[#3178C6]" />,
  javascript: <SiJavascript size={ICON_SIZE} className="text-[#F7DF1E]" />,
  'node.js': <FaNodeJs size={ICON_SIZE} className="text-[#339933]" />,
  nodejs: <FaNodeJs size={ICON_SIZE} className="text-[#339933]" />,
  python: <FaPython size={ICON_SIZE} className="text-[#3776AB]" />,
  mongodb: <SiMongodb size={ICON_SIZE} className="text-[#47A248]" />,
  express: <SiExpress size={ICON_SIZE} className="text-[#ffffff]" />,
  tailwind: <SiTailwindcss size={ICON_SIZE} className="text-[#06B6D4]" />,
  'native tailwind': (
    <SiTailwindcss size={ICON_SIZE} className="text-[#06B6D4]" />
  ),
  redux: <SiRedux size={ICON_SIZE} className="text-[#764ABC]" />,
  'next.js': <SiNextdotjs size={ICON_SIZE} className="text-[#ffffff]" />,
  nextjs: <SiNextdotjs size={ICON_SIZE} className="text-[#ffffff]" />,
  supabase: <SiSupabase size={ICON_SIZE} className="text-[#3ECF8E]" />,
  firebase: <SiFirebase size={ICON_SIZE} className="text-[#FFCA28]" />,
  playwright: <BsGear size={ICON_SIZE} className="text-[#2EAD33]" />,
  jest: <SiJest size={ICON_SIZE} className="text-[#C21325]" />,
  vitest: <SiVitest size={ICON_SIZE} className="text-[#6E9F18]" />,
  zod: <SiZod size={ICON_SIZE} className="text-[#3068B7]" />,
  'socket.io': <SiSocketdotio size={ICON_SIZE} className="text-[#ffffff]" />,
  'open ai api': <SiOpenai size={ICON_SIZE} className="text-[#ffffff]" />,
  'open ai agents': <SiOpenai size={ICON_SIZE} className="text-[#10A37F]" />,
  'openai api': <SiOpenai size={ICON_SIZE} className="text-[#ffffff]" />,
  aws: <FaAws size={ICON_SIZE} className="text-[#FF9900]" />,
  docker: <FaDocker size={ICON_SIZE} className="text-[#2496ED]" />,
  'github actions': <FaGithub size={ICON_SIZE} className="text-[#ffffff]" />,
  'stripe api': <SiStripe size={ICON_SIZE} className="text-[#635BFF]" />,
  'paypal api': <SiPaypal size={ICON_SIZE} className="text-[#00457C]" />,
  'binance api': <SiBinance size={ICON_SIZE} className="text-[#F0B90B]" />,
  selenium: <SiSelenium size={ICON_SIZE} className="text-[#43B02A]" />,
  'telegram api': <SiTelegram size={ICON_SIZE} className="text-[#26A5E4]" />,
  postman: <SiPostman size={ICON_SIZE} className="text-[#FF6C37]" />,
  axios: <SiAxios size={ICON_SIZE} className="text-[#5A29E4]" />,
  tanstack: <SiReactquery size={ICON_SIZE} className="text-[#FF4154]" />,
  'tanstack query': (
    <SiReactquery size={ICON_SIZE} className="text-[#FF4154]" />
  ),
  expo: <TbBrandReactNative size={ICON_SIZE} className="text-[#000020]" />,
  'google api': <SiGooglecloud size={ICON_SIZE} className="text-[#4285F4]" />,
  oauth: <BsGear size={ICON_SIZE} className="text-[#ffffff]" />,
  'oauth 2.1': <BsGear size={ICON_SIZE} className="text-[#ffffff]" />,
  npm: <SiNpm size={ICON_SIZE} className="text-[#CB3837]" />,
  modelcontextprotocol: <VscJson size={ICON_SIZE} className="text-[#00d9ff]" />,
  cors: <BsGear size={ICON_SIZE} className="text-[#ffffff]" />,
  dotenv: <BsFileCode size={ICON_SIZE} className="text-[#ECD53F]" />,
  jose: <BsGear size={ICON_SIZE} className="text-[#ffffff]" />,
  jsonwebtoken: <VscJson size={ICON_SIZE} className="text-[#ffffff]" />,
  validator: <BsGear size={ICON_SIZE} className="text-[#ffffff]" />,
  'grammy.js': <SiTelegram size={ICON_SIZE} className="text-[#26A5E4]" />,
  nodemailer: <BsGear size={ICON_SIZE} className="text-[#ffffff]" />,
  'ebay api': <TbApi size={ICON_SIZE} className="text-[#E53238]" />,
  'amazon sp-api': <TbApi size={ICON_SIZE} className="text-[#FF9900]" />,
  'interactive brokers api': (
    <TbApi size={ICON_SIZE} className="text-[#D71920]" />
  ),
  '2captcha api': <BsGear size={ICON_SIZE} className="text-[#ffffff]" />,
  multer: <BsGear size={ICON_SIZE} className="text-[#ffffff]" />,
  sharp: <BsGear size={ICON_SIZE} className="text-[#99CC00]" />,
  'tesseract.js(ocr)': <BsGear size={ICON_SIZE} className="text-[#ffffff]" />,
  morgan: <BsGear size={ICON_SIZE} className="text-[#ffffff]" />,
  husky: <FaGithub size={ICON_SIZE} className="text-[#ffffff]" />,
  'pdf parse': <BsFileCode size={ICON_SIZE} className="text-[#FF0000]" />,
  postgresql: <BiLogoPostgresql size={ICON_SIZE} className="text-[#4169E1]" />,
  'usa uspto trademarks api': (
    <TbApi size={ICON_SIZE} className="text-[#002868]" />
  ),
  'international wipo patents api': (
    <TbApi size={ICON_SIZE} className="text-[#0066B3]" />
  ),
  'tmdb api': <TbApi size={ICON_SIZE} className="text-[#01D277]" />,
};

export const getTechIcon = (techName: string): React.ReactNode | null => {
  const normalizedName = techName.toLowerCase().trim();
  return techIconMap[normalizedName] || null;
};

export const TechBadge: React.FC<{ tech: string; showIcon?: boolean }> = ({
  tech,
  showIcon = true,
}) => {
  const icon = showIcon ? getTechIcon(tech) : null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] px-2.5 py-1 text-xs text-[var(--text-muted)]">
      {icon}
      {tech}
    </span>
  );
};
