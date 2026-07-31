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
  react: <FaReact className="text-tech-react" size={ICON_SIZE} />,
  'react native': <TbBrandReactNative className="text-tech-react" size={ICON_SIZE} />,
  typescript: <SiTypescript className="text-tech-typescript" size={ICON_SIZE} />,
  javascript: <SiJavascript className="text-tech-javascript" size={ICON_SIZE} />,
  'node.js': <FaNodeJs className="text-tech-node" size={ICON_SIZE} />,
  nodejs: <FaNodeJs className="text-tech-node" size={ICON_SIZE} />,
  python: <FaPython className="text-tech-python" size={ICON_SIZE} />,
  mongodb: <SiMongodb className="text-tech-mongodb" size={ICON_SIZE} />,
  express: <SiExpress className="text-white" size={ICON_SIZE} />,
  tailwind: <SiTailwindcss className="text-tech-tailwind" size={ICON_SIZE} />,
  'native tailwind': <SiTailwindcss className="text-tech-tailwind" size={ICON_SIZE} />,
  redux: <SiRedux className="text-tech-redux" size={ICON_SIZE} />,
  'next.js': <SiNextdotjs className="text-white" size={ICON_SIZE} />,
  nextjs: <SiNextdotjs className="text-white" size={ICON_SIZE} />,
  supabase: <SiSupabase className="text-tech-supabase" size={ICON_SIZE} />,
  firebase: <SiFirebase className="text-tech-firebase" size={ICON_SIZE} />,
  playwright: <BsGear className="text-tech-playwright" size={ICON_SIZE} />,
  jest: <SiJest className="text-tech-jest" size={ICON_SIZE} />,
  vitest: <SiVitest className="text-tech-vitest" size={ICON_SIZE} />,
  zod: <SiZod className="text-tech-zod" size={ICON_SIZE} />,
  'socket.io': <SiSocketdotio className="text-white" size={ICON_SIZE} />,
  'open ai api': <SiOpenai className="text-white" size={ICON_SIZE} />,
  'open ai agents': <SiOpenai className="text-tech-openai" size={ICON_SIZE} />,
  'openai api': <SiOpenai className="text-white" size={ICON_SIZE} />,
  'openai sdk agents': <SiOpenai className="text-tech-openai" size={ICON_SIZE} />,
  'openai agents sdk': <SiOpenai className="text-tech-openai" size={ICON_SIZE} />,
  'lemon squeezy': <SiLemonsqueezy className="text-tech-lemonsqueezy" size={ICON_SIZE} />,
  lemonsqueezy: <SiLemonsqueezy className="text-tech-lemonsqueezy" size={ICON_SIZE} />,
  anthropic: <SiAnthropic className="text-tech-anthropic" size={ICON_SIZE} />,
  claude: <SiAnthropic className="text-tech-anthropic" size={ICON_SIZE} />,
  'claude api': <SiAnthropic className="text-tech-anthropic" size={ICON_SIZE} />,
  aws: <FaAws className="text-tech-aws" size={ICON_SIZE} />,
  docker: <FaDocker className="text-tech-docker" size={ICON_SIZE} />,
  'github actions': <FaGithub className="text-white" size={ICON_SIZE} />,
  'stripe api': <SiStripe className="text-tech-stripe" size={ICON_SIZE} />,
  'paypal api': <SiPaypal className="text-tech-paypal" size={ICON_SIZE} />,
  'binance api': <SiBinance className="text-tech-binance" size={ICON_SIZE} />,
  selenium: <SiSelenium className="text-tech-selenium" size={ICON_SIZE} />,
  'telegram api': <SiTelegram className="text-tech-telegram" size={ICON_SIZE} />,
  postman: <SiPostman className="text-tech-postman" size={ICON_SIZE} />,
  axios: <SiAxios className="text-tech-axios" size={ICON_SIZE} />,
  tanstack: <SiReactquery className="text-tech-react-query" size={ICON_SIZE} />,
  'tanstack query': <SiReactquery className="text-tech-react-query" size={ICON_SIZE} />,
  expo: <SiExpo className="text-white" size={ICON_SIZE} />,
  wxt: <SiWxt className="text-tech-wxt" size={ICON_SIZE} />,
  nestjs: <SiNestjs className="text-tech-nest" size={ICON_SIZE} />,
  'nest.js': <SiNestjs className="text-tech-nest" size={ICON_SIZE} />,
  nest: <SiNestjs className="text-tech-nest" size={ICON_SIZE} />,
  gcp: <SiGooglecloud className="text-tech-gcp" size={ICON_SIZE} />,
  'google cloud': <SiGooglecloud className="text-tech-gcp" size={ICON_SIZE} />,
  'google cloud platform': <SiGooglecloud className="text-tech-gcp" size={ICON_SIZE} />,
  'google api': <SiGooglecloud className="text-tech-gcp" size={ICON_SIZE} />,
  oauth: <BsGear className="text-white" size={ICON_SIZE} />,
  'oauth 2.1': <BsGear className="text-white" size={ICON_SIZE} />,
  npm: <SiNpm className="text-tech-npm" size={ICON_SIZE} />,
  modelcontextprotocol: <VscJson className="text-brand-secondary" size={ICON_SIZE} />,
  cors: <BsGear className="text-white" size={ICON_SIZE} />,
  dotenv: <BsFileCode className="text-tech-dotenv" size={ICON_SIZE} />,
  jose: <BsGear className="text-white" size={ICON_SIZE} />,
  jsonwebtoken: <VscJson className="text-white" size={ICON_SIZE} />,
  validator: <BsGear className="text-white" size={ICON_SIZE} />,
  'grammy.js': <SiTelegram className="text-tech-telegram" size={ICON_SIZE} />,
  nodemailer: <BsGear className="text-white" size={ICON_SIZE} />,
  'ebay api': <TbApi className="text-tech-ebay" size={ICON_SIZE} />,
  'amazon sp-api': <TbApi className="text-tech-aws" size={ICON_SIZE} />,
  'interactive brokers api': <TbApi className="text-tech-interactive-brokers" size={ICON_SIZE} />,
  '2captcha api': <BsGear className="text-white" size={ICON_SIZE} />,
  multer: <BsGear className="text-white" size={ICON_SIZE} />,
  sharp: <BsGear className="text-tech-sharp" size={ICON_SIZE} />,
  'tesseract.js(ocr)': <BsGear className="text-white" size={ICON_SIZE} />,
  morgan: <BsGear className="text-white" size={ICON_SIZE} />,
  husky: <FaGithub className="text-white" size={ICON_SIZE} />,
  'pdf parse': <BsFileCode className="text-tech-pdf" size={ICON_SIZE} />,
  postgresql: <BiLogoPostgresql className="text-tech-postgresql" size={ICON_SIZE} />,
  'usa uspto trademarks api': <TbApi className="text-tech-uspto" size={ICON_SIZE} />,
  'international wipo patents api': <TbApi className="text-tech-wipo" size={ICON_SIZE} />,
  'tmdb api': <TbApi className="text-tech-tmdb" size={ICON_SIZE} />,
};

const normalizeTechName = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    // Raw row example: "node.js" / "C++" separators → spaces ("node js").
    .replace(/[._/()-]+/g, ' ')
    // Raw row example: "hello   world" becomes "hello world".
    .replace(/\s+/g, ' ');

// Raw row example: "node js" becomes "nodejs" for icon map lookup.
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

type TechBadgeProps = {
  tech: string;
  showIcon?: boolean;
};

export const TechBadge = ({ tech, showIcon = true }: TechBadgeProps) => {
  const icon = showIcon ? getTechIcon(tech) : null;

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--bg-surface)] p-2 p-2 text-xs text-[var(--text-muted)]">
      {icon}
      {tech}
    </span>
  );
};
