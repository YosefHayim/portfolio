import { useEffect } from 'react';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';
import { FaAmazon, FaEbay, FaNpm } from 'react-icons/fa';
import { GiPopcorn } from 'react-icons/gi';
import { RiStockLine } from 'react-icons/ri';
import { SiAlwaysdata, SiBinance, SiOpenai, SiUdemy } from 'react-icons/si';
import { TbBrandReactNative } from 'react-icons/tb';
import amazonScreenshot from '/screenshots/amazon.png';
import autoBaySaasScreenshot from '/screenshots/auto-bay-saas.png';
import binanceScreenshot from '/screenshots/binance.png';
import ebayScreenshot from '/screenshots/ebay.png';
import ebayMcpScreenshot from '/screenshots/ebay-mcp.png';
import harABituahScreenshot from '/screenshots/har-a-bituah.png';
import interactiveBrokersScreenshot from '/screenshots/interactive-brokers.png';
import momToolScreenshot from '/screenshots/MomTool.png';
import quizAiOnBoardingScreenshot from '/screenshots/quiz-ai-on-boarding.png';
import telegramScreenshot from '/screenshots/telegram.png';
import timScreenshot from '/screenshots/tim-trailer.png';
import udemyScreenshot from '/screenshots/udemy.png';
import Collaborators from './ProjectCard/Collaborators/Collaborators';
import ProjectCard from './ProjectCard/ProjectCard';
import ProjectsHeader from './ProjectsHeader/ProjectsHeader';

const Projects = () => {
  useEffect(() => {
    document.title = 'Projects';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  return (
    <div>
      <ProjectsHeader />
      <div className="grid w-full grid-cols-1 gap-10 p-5 pt-[15%] md:grid-cols-3 md:pt-[5%]">
        <ProjectCard
          childrenProjectIcon={
            <FaNpm
              className={'rounded-sm bg-white p-1 text-red-600'}
              size={30}
            />
          }
          deployedUrl="https://www.npmjs.com/package/ebay-api-mcp-server"
          projectImg={ebayMcpScreenshot}
          projectName="eBay MCP API Server"
          techStackForProject={[
            'modelcontextprotocol',
            'axios',
            'cors',
            'dotenv',
            'express',
            'jose',
            'jsonwebtoken',
            'TypeScript',
            'Node.js',
            'Vitest',
            'OAuth 2.1',
          ]}
          visitRepoUrl="https://github.com/YosefHayim/ebay-api-mcp-server"
        >
          <div className="flex w-full flex-col items-center justify-start gap-2">
            <p className="w-full text-gray-400">
              An open-source Model Context Protocol (MCP) server that provides LLMs
              with enhanced schema readability and implementation for eBay API.
              Integrates with Claude Desktop and Gemini CLI, featuring OAuth 2.1
              authentication and automated schema conversion from OpenAPI specs to
              TypeScript types. Published on npm for easy integration.
            </p>
          </div>
        </ProjectCard>
        <ProjectCard
          childrenProjectIcon={<></>}
          deployedUrl="projects"
          projectImg={autoBaySaasScreenshot}
          projectName="AutoBay DropShipping Saas Platform (Under development)"
          techStackForProject={[
            'Next.js',
            'TypeScript',
            'Zod',
            'Playwright',
            'AWS',
            'GitHub Actions',
            'Jest',
            'Firebase',
            'Nodemailer',
            'OAuth',
            'eBay API',
            'Amazon SP-API',
            'USA USPTO Trademarks API',
            'International WIPO Patents API',
            'Stripe API',
            'PayPal API',
            'Postman',
          ]}
          visitRepoUrl="https://github.com/orgs/AutoBay/repositories"
        >
          <p>
            Leveraging my prior experience as an eBay seller, I am developing an
            Amazon to eBay dropshipping SaaS platform. This platform is
            engineered to mitigate common pain points encountered by sellers,
            integrating advanced optimizations and novel features to enhance the
            dropshipping workflow and maximize profit margins.
          </p>
        </ProjectCard>
        <ProjectCard
          childrenProjectIcon={
            <TbBrandReactNative
              className={'rounded-sm bg-white p-1 text-black'}
              size={30}
            />
          }
          deployedUrl="projects"
          projectImg={quizAiOnBoardingScreenshot}
          projectName="Quiz AI React Native (Under development)"
          techStackForProject={[
            'React Native',
            'Native Tailwind',
            'Supabase',
            'Pdf Parse',
            'Axios',
            'Open AI Agents',
            'Open AI API',
            'Zod',
            'Express',
            'Expo',
            'TanStack',
          ]}
          visitRepoUrl="https://github.com/YosefHayim/Quizio-AI-App"
        >
          <div className="flex w-full flex-col items-center justify-start gap-2">
            <p className="w-full text-gray-400">
              Quiz AI application for IOS and android using React native
              framework with expo. users can upload image, pdf files and even
              urls of youtube to parse and get american quiz based on the
              context provided to the ai. with a tracking system to maintain
              high motivation.
            </p>
          </div>
        </ProjectCard>
        <ProjectCard
          childrenProjectIcon={
            <SiOpenai
              className={'rounded-sm bg-white p-1 text-black'}
              size={30}
            />
          }
          deployedUrl="projects"
          projectImg={telegramScreenshot}
          projectName="Telegram AI Calendar Assistant (Under development)"
          techStackForProject={[
            'Node.js',
            'TypeScript',
            'Express',
            'Supabase',
            'OAuth',
            'Jest',
            'Grammy.js',
            'Google API',
            'Zod',
            'Validator',
            'Open AI Agents',
            'GitHub Actions',
          ]}
          visitRepoUrl="https://github.com/YosefHayim/AI-Calendar-Agent"
        >
          <div className="flex w-full flex-col items-center justify-start gap-2">
            <p className="w-full text-gray-400">
              A Telegram-based AI assistant that integrates with Google Calendar
              to manage schedules, create events, send reminders, and provide
              personal productivity support directly through chat.{' '}
            </p>
          </div>
        </ProjectCard>

        <ProjectCard
          childrenProjectIcon={
            <SiUdemy
              className="rounded-sm bg-white p-1 text-purple-500"
              size={30}
            />
          }
          deployedUrl="https://udemy-clone-ron-and-ben-front.onrender.com/"
          projectImg={udemyScreenshot}
          projectName="Udemy Clone"
          techStackForProject={[
            'React',
            'Node.js',
            'TypeScript',
            'Express',
            'MongoDB',
            'Tailwind',
            'Redux',
          ]}
          visitRepoUrl="https://github.com/YosefHayim/Udemy-Clone-Ron-Ben-IITC-2025"
        >
          <div className="flex w-full flex-col items-center justify-start gap-2">
            <p className="w-full text-gray-400">
              This project is a full-featured Udemy clone, built as the final
              capstone for our course at IITC to showcase everything we’ve
              learned.
            </p>
            <Collaborators
              collaboratorToProject={[
                {
                  name: 'Ron Sherling',
                  githubProfileLink: 'https://github.com/ron959',
                },
                {
                  name: 'Ben Klinski',
                  githubProfileLink: 'https://github.com/Ben-Kilinski',
                },
              ]}
            />
          </div>
        </ProjectCard>
        <ProjectCard
          childrenProjectIcon={
            <GiPopcorn
              className="rounded-sm bg-white p-1 text-red-700"
              size={30}
            />
          }
          deployedUrl="https://iitc-b-frontend-vanilla-tim-trailers.onrender.com/"
          projectImg={timScreenshot}
          projectName="Tim Trailers"
          techStackForProject={['JavaScript, TMDB API']}
          visitRepoUrl="https://github.com/YosefHayim/iitc-b/tree/main/full-stack-2024/october-2024/14-10-2024/sukot-assigment"
        >
          <div className="flex w-full flex-col items-center justify-start gap-2">
            <p className="w-full text-gray-400">
              Tim Trailers is a quirky, vanilla HTML/CSS movie trailer site
              where you join Tim—a popcorn prophet with a love for laughs—on a
              cinematic ride through curated picks, cozy vibes, and festival
              flair.
            </p>
          </div>
        </ProjectCard>
        <ProjectCard
          childrenProjectIcon={
            <BsFileEarmarkPdfFill
              className="rounded-sm bg-white p-1 text-black"
              size={30}
            />
          }
          deployedUrl="https://pdf-extractor-data-helping-mom-fronted.onrender.com/"
          projectImg={momToolScreenshot}
          projectName="OCR Parse AI"
          techStackForProject={[
            'React',
            'Tailwind',
            'Axios',
            'TanStack Query',
            'Socket.io',
            'Playwright',
            'Husky',
            'Node.js',
            'Express',
            'Multer',
            'Sharp',
            'Tesseract.js(OCR)',
            'OpenAI API',
            'Morgan',
          ]}
          visitRepoUrl="https://github.com/YosefHayim/OCR-Parse-AI"
        >
          <div className="flex w-full flex-col items-center justify-start gap-2">
            <p className="w-full text-gray-400">
              Built an AI-powered OCR tool to help my mom extract structured
              data from messy PDF invoices.
            </p>
            <ul className="text-gray-400">
              <h3 className="pb-1 font-bold">Flow of the project is:</h3>
              <li>Converted PDFs to images using Sharp</li>
              <li>Ran OCR with Tesseract.js</li>
              <li>Parsed invoice data via OpenAI</li>
            </ul>
          </div>
        </ProjectCard>
        <ProjectCard
          childrenProjectIcon={
            <FaAmazon
              className="rounded-sm bg-white p-1 text-black"
              size={30}
            />
          }
          deployedUrl="projects"
          projectImg={amazonScreenshot}
          projectName="Amazon ASIN Scraper W/CAPTCHA"
          techStackForProject={['Selenium', '2Captcha API']}
          visitRepoUrl="https://github.com/YosefHayim/p-w-gpt/tree/main/Python/09.08.2024%20-%20Amazon%20ASIN%20Collector%20%2B%20normal%20captcha"
        >
          <div className="group relative flex flex-col items-start justify-start gap-2">
            <p className="w-full text-gray-400">
              Python bot using Selenium to grab ASINs from Amazon, bypass
              CAPTCHAs with 2Captcha, switch ZIP codes, and export to CSV.
            </p>
          </div>
        </ProjectCard>
        <ProjectCard
          childrenProjectIcon={
            <FaEbay className="rounded-sm bg-white p-1 text-black" size={30} />
          }
          deployedUrl="projects"
          projectImg={ebayScreenshot}
          projectName="eBay Sellers Title Scraper"
          techStackForProject={['Selenium']}
          visitRepoUrl="https://github.com/YosefHayim/p-w-gpt/tree/main/Python/11.08.2024%20-%20eBay%20Titles%20Collector"
        >
          <div className="group relative flex flex-col items-start justify-start gap-2">
            <p className="w-full text-gray-400">
              Python bot that scrapes product titles across pages and saves them
              to CSV.
            </p>
          </div>
        </ProjectCard>
        <ProjectCard
          childrenProjectIcon={
            <SiAlwaysdata
              className="rounded-sm bg-white p-1 text-black"
              size={30}
            />
          }
          deployedUrl="projects"
          projectImg={harABituahScreenshot}
          projectName="HarABituah Government Scraper"
          techStackForProject={['Selenium']}
          visitRepoUrl="https://github.com/YosefHayim/p-w-gpt/tree/main/Python/19.02.2024%20-%20HarABituh-data%20read%20and%20extraction%20with%20manual%20captcha%20automation"
        >
          <div className="group relative flex flex-col items-start justify-start gap-2">
            <p className="w-full text-gray-400">
              At an insurance company in Holon, I spotted a manual process
              slowing things down. With zero coding background, I used ChatGPT
              to guide me in building a Python automation that extracted and
              processed customer files—saving time and cutting costs for the
              business.{' '}
            </p>
          </div>
        </ProjectCard>
        <ProjectCard
          childrenProjectIcon={
            <RiStockLine
              className="rounded-sm bg-white p-1 text-black"
              size={30}
            />
          }
          deployedUrl="projects"
          projectImg={interactiveBrokersScreenshot}
          projectName="Stocks Trading Bots"
          techStackForProject={[
            'Selenium',
            'Interactive Brokers API',
            'Telegram API',
          ]}
          visitRepoUrl="https://github.com/YosefHayim/p-w-gpt/tree/main/Python/19.11.2023%20-%20Interactive%20broker%20API%20trading%20bots"
        >
          <div className="group relative flex flex-col items-start justify-start gap-2">
            <p className="w-full text-gray-400">
              Started with zero coding—used ChatGPT to build modular Python bots
              running MACD, RSI, SMA, and Wyckoff strategies. Fully automated
              for live trading via Interactive Brokers API.
            </p>
          </div>
        </ProjectCard>
        <ProjectCard
          childrenProjectIcon={
            <SiBinance
              className="rounded-sm bg-white p-1 text-black"
              size={30}
            />
          }
          deployedUrl="projects"
          projectImg={binanceScreenshot}
          projectName="Crypto Trading Bots"
          techStackForProject={['Selenium', 'Binance API', 'Telegram API']}
          visitRepoUrl="https://github.com/YosefHayim/p-w-gpt/tree/main/Python/10.28.2023%20-%20Binance%20API%20trading%20bots"
        >
          <div className="group relative flex flex-col items-start justify-start gap-2">
            <p className="w-full text-gray-400">
              With no coding background, I built Python bots using ChatGPT to
              automate trading on Binance. Strategies included RSI, MACD, and
              SMA—fully hands-off and data-driven.
            </p>
          </div>
        </ProjectCard>
      </div>
    </div>
  );
};

export default Projects;
