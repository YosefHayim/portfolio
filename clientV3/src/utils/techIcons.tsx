import { BiLogoPostgresql } from 'react-icons/bi';
import { BsFileCode, BsGear } from 'react-icons/bs';
import { FaAws, FaDocker, FaGithub, FaNodeJs, FaPython, FaReact } from 'react-icons/fa';
import {
  SiAnthropic,
  SiAxios,
  SiBinance,
  SiExpo,
  SiExpress,
  SiFirebase,
  SiGooglecloud,
  SiJavascript,
  SiJest,
  SiLemonsqueezy,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiNpm,
  SiOpenai,
  SiPaypal,
  SiPostman,
  SiReactquery,
  SiRedux,
  SiSelenium,
  SiSocketdotio,
  SiStripe,
  SiSupabase,
  SiTailwindcss,
  SiTelegram,
  SiTypescript,
  SiVitest,
  SiWxt,
  SiZod,
} from 'react-icons/si';
import { TbApi, TbBrandReactNative } from 'react-icons/tb';
import { VscJson } from 'react-icons/vsc';

type TechIconMap = Record<string, React.ReactNode>;

const ICON_SIZE = 14;

const techIconMap: TechIconMap = {
  react: <FaReact className="text-[#61DAFB]" size={ICON_SIZE} />,
  'react native': <TbBrandReactNative className="text-[#61DAFB]" size={ICON_SIZE} />,
  typescript: <SiTypescript className="text-[#3178C6]" size={ICON_SIZE} />,
  javascript: <SiJavascript className="text-[#F7DF1E]" size={ICON_SIZE} />,
  'node.js': <FaNodeJs className="text-[#339933]" size={ICON_SIZE} />,
  nodejs: <FaNodeJs className="text-[#339933]" size={ICON_SIZE} />,
  python: <FaPython className="text-[#3776AB]" size={ICON_SIZE} />,
  mongodb: <SiMongodb className="text-[#47A248]" size={ICON_SIZE} />,
  express: <SiExpress className="text-[#ffffff]" size={ICON_SIZE} />,
  tailwind: <SiTailwindcss className="text-[#06B6D4]" size={ICON_SIZE} />,
  'native tailwind': <SiTailwindcss className="text-[#06B6D4]" size={ICON_SIZE} />,
  redux: <SiRedux className="text-[#764ABC]" size={ICON_SIZE} />,
  'next.js': <SiNextdotjs className="text-[#ffffff]" size={ICON_SIZE} />,
  nextjs: <SiNextdotjs className="text-[#ffffff]" size={ICON_SIZE} />,
  supabase: <SiSupabase className="text-[#3ECF8E]" size={ICON_SIZE} />,
  firebase: <SiFirebase className="text-[#FFCA28]" size={ICON_SIZE} />,
  playwright: <BsGear className="text-[#2EAD33]" size={ICON_SIZE} />,
  jest: <SiJest className="text-[#C21325]" size={ICON_SIZE} />,
  vitest: <SiVitest className="text-[#6E9F18]" size={ICON_SIZE} />,
  zod: <SiZod className="text-[#3068B7]" size={ICON_SIZE} />,
  'socket.io': <SiSocketdotio className="text-[#ffffff]" size={ICON_SIZE} />,
  'open ai api': <SiOpenai className="text-[#ffffff]" size={ICON_SIZE} />,
  'open ai agents': <SiOpenai className="text-[#10A37F]" size={ICON_SIZE} />,
  'openai api': <SiOpenai className="text-[#ffffff]" size={ICON_SIZE} />,
  'openai sdk agents': <SiOpenai className="text-[#10A37F]" size={ICON_SIZE} />,
  'openai agents sdk': <SiOpenai className="text-[#10A37F]" size={ICON_SIZE} />,
  'lemon squeezy': <SiLemonsqueezy className="text-[#FFC233]" size={ICON_SIZE} />,
  lemonsqueezy: <SiLemonsqueezy className="text-[#FFC233]" size={ICON_SIZE} />,
  anthropic: <SiAnthropic className="text-[#D97757]" size={ICON_SIZE} />,
  claude: <SiAnthropic className="text-[#D97757]" size={ICON_SIZE} />,
  'claude api': <SiAnthropic className="text-[#D97757]" size={ICON_SIZE} />,
  aws: <FaAws className="text-[#FF9900]" size={ICON_SIZE} />,
  docker: <FaDocker className="text-[#2496ED]" size={ICON_SIZE} />,
  'github actions': <FaGithub className="text-[#ffffff]" size={ICON_SIZE} />,
  'stripe api': <SiStripe className="text-[#635BFF]" size={ICON_SIZE} />,
  'paypal api': <SiPaypal className="text-[#00457C]" size={ICON_SIZE} />,
  'binance api': <SiBinance className="text-[#F0B90B]" size={ICON_SIZE} />,
  selenium: <SiSelenium className="text-[#43B02A]" size={ICON_SIZE} />,
  'telegram api': <SiTelegram className="text-[#26A5E4]" size={ICON_SIZE} />,
  postman: <SiPostman className="text-[#FF6C37]" size={ICON_SIZE} />,
  axios: <SiAxios className="text-[#5A29E4]" size={ICON_SIZE} />,
  tanstack: <SiReactquery className="text-[#FF4154]" size={ICON_SIZE} />,
  'tanstack query': <SiReactquery className="text-[#FF4154]" size={ICON_SIZE} />,
  expo: <SiExpo className="text-[#ffffff]" size={ICON_SIZE} />,
  wxt: <SiWxt className="text-[#67D55E]" size={ICON_SIZE} />,
  nestjs: <SiNestjs className="text-[#E0234E]" size={ICON_SIZE} />,
  'nest.js': <SiNestjs className="text-[#E0234E]" size={ICON_SIZE} />,
  nest: <SiNestjs className="text-[#E0234E]" size={ICON_SIZE} />,
  gcp: <SiGooglecloud className="text-[#4285F4]" size={ICON_SIZE} />,
  'google cloud': <SiGooglecloud className="text-[#4285F4]" size={ICON_SIZE} />,
  'google cloud platform': <SiGooglecloud className="text-[#4285F4]" size={ICON_SIZE} />,
  'google api': <SiGooglecloud className="text-[#4285F4]" size={ICON_SIZE} />,
  oauth: <BsGear className="text-[#ffffff]" size={ICON_SIZE} />,
  'oauth 2.1': <BsGear className="text-[#ffffff]" size={ICON_SIZE} />,
  npm: <SiNpm className="text-[#CB3837]" size={ICON_SIZE} />,
  modelcontextprotocol: <VscJson className="text-[#00d9ff]" size={ICON_SIZE} />,
  cors: <BsGear className="text-[#ffffff]" size={ICON_SIZE} />,
  dotenv: <BsFileCode className="text-[#ECD53F]" size={ICON_SIZE} />,
  jose: <BsGear className="text-[#ffffff]" size={ICON_SIZE} />,
  jsonwebtoken: <VscJson className="text-[#ffffff]" size={ICON_SIZE} />,
  validator: <BsGear className="text-[#ffffff]" size={ICON_SIZE} />,
  'grammy.js': <SiTelegram className="text-[#26A5E4]" size={ICON_SIZE} />,
  nodemailer: <BsGear className="text-[#ffffff]" size={ICON_SIZE} />,
  'ebay api': <TbApi className="text-[#E53238]" size={ICON_SIZE} />,
  'amazon sp-api': <TbApi className="text-[#FF9900]" size={ICON_SIZE} />,
  'interactive brokers api': <TbApi className="text-[#D71920]" size={ICON_SIZE} />,
  '2captcha api': <BsGear className="text-[#ffffff]" size={ICON_SIZE} />,
  multer: <BsGear className="text-[#ffffff]" size={ICON_SIZE} />,
  sharp: <BsGear className="text-[#99CC00]" size={ICON_SIZE} />,
  'tesseract.js(ocr)': <BsGear className="text-[#ffffff]" size={ICON_SIZE} />,
  morgan: <BsGear className="text-[#ffffff]" size={ICON_SIZE} />,
  husky: <FaGithub className="text-[#ffffff]" size={ICON_SIZE} />,
  'pdf parse': <BsFileCode className="text-[#FF0000]" size={ICON_SIZE} />,
  postgresql: <BiLogoPostgresql className="text-[#4169E1]" size={ICON_SIZE} />,
  'usa uspto trademarks api': <TbApi className="text-[#002868]" size={ICON_SIZE} />,
  'international wipo patents api': <TbApi className="text-[#0066B3]" size={ICON_SIZE} />,
  'tmdb api': <TbApi className="text-[#01D277]" size={ICON_SIZE} />,
};

const normalizeTechName = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[._/()-]+/g, ' ')
    .replace(/\s+/g, ' ');

const toCanonicalKey = (value: string): string =>
  normalizeTechName(value).replace(/[^a-z0-9]/g, '');

const canonicalTechIconMap: TechIconMap = Object.fromEntries(
  Object.entries(techIconMap).map(([key, icon]) => [toCanonicalKey(key), icon]),
);

const keywordMatchers: Array<{ keywords: string[]; icon: React.ReactNode }> = [
  { keywords: ['typescript'], icon: techIconMap.typescript },
  { keywords: ['javascript', 'nodejs', 'node'], icon: techIconMap.javascript },
  { keywords: ['reactnative'], icon: techIconMap['react native'] },
  { keywords: ['expo'], icon: techIconMap.expo },
  { keywords: ['react'], icon: techIconMap.react },
  { keywords: ['nestjs', 'nest'], icon: techIconMap.nestjs },
  { keywords: ['googlecloud', 'gcp'], icon: techIconMap.gcp },
  { keywords: ['wxt'], icon: techIconMap.wxt },
  { keywords: ['next'], icon: techIconMap['next.js'] },
  { keywords: ['tailwind'], icon: techIconMap.tailwind },
  { keywords: ['postgres', 'postgresql'], icon: techIconMap.postgresql },
  { keywords: ['mongo', 'mongodb'], icon: techIconMap.mongodb },
  { keywords: ['express'], icon: techIconMap.express },
  { keywords: ['python'], icon: techIconMap.python },
  { keywords: ['docker'], icon: techIconMap.docker },
  { keywords: ['aws'], icon: techIconMap.aws },
  { keywords: ['firebase'], icon: techIconMap.firebase },
  { keywords: ['supabase'], icon: techIconMap.supabase },
  { keywords: ['openai', 'gpt'], icon: techIconMap['openai api'] },
  { keywords: ['lemonsqueezy', 'lemon'], icon: techIconMap.lemonsqueezy },
  { keywords: ['socketio', 'socket'], icon: techIconMap['socket.io'] },
  { keywords: ['zod'], icon: techIconMap.zod },
  { keywords: ['anthropic', 'claude'], icon: techIconMap.claude },
  { keywords: ['telegram'], icon: techIconMap['telegram api'] },
  { keywords: ['playwright'], icon: techIconMap.playwright },
  { keywords: ['selenium'], icon: techIconMap.selenium },
  { keywords: ['stripe'], icon: techIconMap['stripe api'] },
  { keywords: ['paypal'], icon: techIconMap['paypal api'] },
];

export const getTechIcon = (techName: string): React.ReactNode | null => {
  const normalizedName = normalizeTechName(techName);

  const directMatch = techIconMap[normalizedName];
  if (directMatch) {
    return directMatch;
  }

  const canonicalName = toCanonicalKey(normalizedName);
  const canonicalMatch = canonicalTechIconMap[canonicalName];
  if (canonicalMatch) {
    return canonicalMatch;
  }

  const keywordMatch = keywordMatchers.find(({ keywords }) =>
    keywords.some((keyword) => canonicalName.includes(keyword)),
  );
  if (keywordMatch) {
    return keywordMatch.icon;
  }

  return null;
};

export const TechBadge: React.FC<{ tech: string; showIcon?: boolean }> = ({
  tech,
  showIcon = true,
}) => {
  const icon = showIcon ? getTechIcon(tech) : null;

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--bg-surface)] p-2 p-2 text-xs text-[var(--text-muted)]">
      {icon}
      {tech}
    </span>
  );
};
