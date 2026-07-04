import UserAlert from '@/Components/UserAlert/UserAlert';
import { useEffect, useState } from 'react';
import { FaSort } from 'react-icons/fa';
import { FiMinus } from 'react-icons/fi';
import { GoDotFill } from 'react-icons/go';
import { IoIosArrowForward } from 'react-icons/io';
import { IoCloseOutline } from 'react-icons/io5';
import { Link } from 'react-router';

const WhoAmI = () => {
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlert(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [alert]);

  return (
    <div className="w-full">
      {alert && (
        <div className="pb-3">
          <UserAlert
            alertTitle="Oops... Not Quite!"
            alertDescription="That felt like a Mac close button, huh? Just vibes nothing's actually closing. Still love Apple tho!"
          />
        </div>
      )}

      <div className="group relative flex w-full flex-col items-start justify-start rounded-xl bg-gray-800">
        <div className="flex items-center justify-start p-1">
          <div
            className="relative cursor-pointer"
            onClick={() => setAlert((prev) => !prev)}
          >
            <GoDotFill size={28} className="text-red-400" />
            <IoCloseOutline className="translate-x-[5.5px] translate-y-[-22px] text-black" />
          </div>
          <div className="relative">
            <GoDotFill size={28} className="text-yellow-400" />
            <FiMinus className="translate-x-[5.5px] translate-y-[-22px] text-black" />
          </div>
          <div className="relative">
            <GoDotFill size={28} className="text-green-400" />
            <FaSort className="translate-x-[5.5px] translate-y-[-22px] rotate-120 text-black" />
          </div>
        </div>
        <ul>
          <div className="flex w-full flex-col items-start">
            <li className="group relative w-full items-center justify-start gap-1 p-2">
              <div className="flex items-center">
                <IoIosArrowForward />
                <h3 className="font-(family-name:--code-font)">WHO_AM_I?</h3>
              </div>
              <p className="text-gray-400 transition-opacity duration-300 group-hover:opacity-100 md:opacity-0">
                Full-stack developer blending clean code with creative
                problem-solving.
              </p>
            </li>
          </div>
          <li className="group relative w-full items-center justify-start gap-1 p-2">
            <div className="group-relative flex w-full items-center">
              <IoIosArrowForward />
              <h3 className="font-(family-name:--code-font)">STACK</h3>_
              <Link
                to="/techStack"
                className="0 text-green-400 hover:text-yellow-400"
              >
                VIEW
              </Link>
            </div>
            <p className="text-gray-400 transition-opacity duration-300 group-hover:opacity-100 md:opacity-0">
              MERN - (MongoDB, Express, React, Node.js) and much more!
            </p>
          </li>
          <li className="group relative w-full items-center justify-start gap-1 p-2">
            <div className="flex w-full items-center">
              <IoIosArrowForward />
              <h3 className="font-(family-name:--code-font)">FOCUS</h3>
            </div>
            <p className="text-gray-400 transition-opacity duration-300 group-hover:opacity-100 md:opacity-0">
              Focused on solving real-world problems — not just shipping
              features, but building tools that actually help people work
              smarter.
            </p>
          </li>
          <li className="group relative w-full items-center justify-start gap-1 p-2">
            <div className="flex w-full items-center">
              <IoIosArrowForward />
              <h3 className="font-(family-name:--code-font)">PASSION</h3>
            </div>
            <p className="text-gray-400 transition-opacity duration-300 group-hover:opacity-100 md:opacity-0">
              I’m automating the boring stuff, writing cleaner code, and
              leveling up with every project.
            </p>
          </li>
          <li className="group relative w-full items-center justify-start gap-1 p-2">
            <div className="flex w-full items-center">
              <IoIosArrowForward />
              <h3 className="font-(family-name:--code-font)">MOTTO</h3>
            </div>
            <p className="text-gray-400 transition-opacity duration-300 group-hover:opacity-100 md:opacity-0">
              Trying to get better{' '}
              <span className="font-bold text-green-400 group-hover:text-green-400">
                everyday.
              </span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WhoAmI;
