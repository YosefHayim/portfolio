import { IoMdTrophy } from 'react-icons/io';
import CardJourney from '../CardJourney/CardJourney';
import { FaUserTie } from 'react-icons/fa';
import LastTimeUpdatedBy from '@/Components/LastTimeUpdatedBy/LastTimeUpdatedBy';
import { FaSchoolCircleCheck } from "react-icons/fa6";
import { IoSchoolOutline } from 'react-icons/io5';

const MyJourney = () => {
  return (
    <div>
      <div className="gap-2 items-center w-full flex flex-col">
        <h1 className="w-full text-center text-3xl">
          My Journey
        </h1>
        <LastTimeUpdatedBy />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-8 pt-10">
        <CardJourney
          icon={<FaUserTie size={20} className="text-[#05df72]" />}
          colorIconHover={`group-hover:text-[#05df72]`}
          years={`2025 - Present`}
          title={`Predicto AI - Frontend & Automation developer`}
          textChildren={
            <p className="text-gray-400">
              Developed and maintained Predicto’s frontend using React, Zod,
              Tailwind, Shadcn UI, and high-performance delivery. Built CI/CD
              pipelines with Jest and RTL for automated testing and release
              validation. Led QA efforts, resolving UI and logic issues to
              ensure production stability. Managed API documentation and agile
              workflows via Monday.com for efficient cross-team delivery.
            </p>
          }
        ></CardJourney>
        <CardJourney
          icon={<FaUserTie size={20} className="text-[#05df72]" />}
          colorIconHover={`group-hover:text-[#05df72]`}
          years={`Feb 2025 - April 2025`}
          title={`Wotch Health Startup - Internship`}
          textChildren={
            <div>
              <p className="text-gray-400">
                Developed end-to-end features, enhancing developer workflow, and
                implementing Storybook unit tests. Built automation
                infrastructure using WebSockets for seamless real-time
                communication using Playwright. Independently managed tasks
                using Jira and Git within an Agile team environment. Delivered
                tasks under tight deadlines.
              </p>
              <p className="text-gray-400">
                Built a real-time debugger, expanded E2E tests, and integrated
                external data in a fast-paced healthcare startup.
              </p>
            </div>
          }
        ></CardJourney>
        <CardJourney

          icon={<IoSchoolOutline size={20} className="text-white" />
          }
          colorIconHover={`group-hover:text-white`}
          years={`2025 - ∞`}
          title={`Open University of Israel – Tel Aviv - B.Sc. Computer Science (In progress)`}
          textChildren={
            <p className="text-gray-400">
              Currently pursuing a B.Sc. in Computer Science at the Open
              University while working full-time.
            </p>
          }
        ></CardJourney>
        <CardJourney
          icon={<IoMdTrophy size={20} className="text-[#fdc700]" />}
          colorIconHover={`group-hover:text-[#fdc700]`}
          years={`2024 July - 2025 Feb`}
          title={`IITC College - Fullstack Web Development Bootcamp`}
          textChildren={
            <p className="text-gray-400">
              <span className="font-bold text-[#fdc700] delay-150 duration-300 ease-in-out group-hover:text-[#fdc700]">
                Graduated with excellence
              </span>{' '}
              796-hour bootcamp program Full-Stack web development with HTML,
              CSS, JavaScript, React, Node.js, Express, MongoDB and SQL.
              Concurrently completed five Udemy backend courses, graduating with
              a GPA of 93.
            </p>
          }
        ></CardJourney>
        <CardJourney
          icon={<IoMdTrophy size={20} className="text-[#fdc700]" />}
          colorIconHover={`group-hover:text-[#fdc700]`}
          years={`2024 July - 2025 Feb`}
          title={`Veteran Commander - IDF - 931st Battalion - Negevist`}
          textChildren={
            <div>
              <p className="text-gray-400">
                Served in the IDF as a combat soldier (Negevist) in the Nahal
                Brigade.
              </p>
              <p className="text-gray-400">
                Completed my training as one of the top{' '}
                <span className="font-bold text-[#fdc700] delay-150 duration-300 ease-in-out group-hover:font-bold group-hover:text-[#fdc700]">
                  ten
                </span> combat soldiers and was awarded{' '}
                <span className="font-bold text-[#fdc700] delay-150 duration-300 ease-in-out group-hover:text-[#fdc700] hover:text-[#fdc700]">
                  excellence twice
                </span>{' '}
                once during basic training and again in the Commanders’ Course.
              </p>
            </div>
          }
        >
          <p
            className={`absolute top-3 left-7 text-sm font-bold text-[#fdc700] delay-150 duration-300 ease-in-out group-hover:block md:hidden`}
          >
            2x
          </p>
        </CardJourney>
        <CardJourney
          icon={<FaSchoolCircleCheck size={20} className="text-white" />
          }
          colorIconHover={`group-hover:text-white`}
          years={`2012 - 2018`}
          title={`High School Diploma - Full Bagrut Certificate - Peres Campus`}
          textChildren={
            <p className="text-gray-400">
              Completed a high-tech-oriented program with a focus on technology
              and innovation.</p>
          }
        ></CardJourney>
      </div>
    </div>
  );
};

export default MyJourney;
