import ImageOfMyself from '@/Components/ImageOfMyself/ImageOfMyself';
import LoaderAnimation from '@/Components/LoaderAnimation/LoaderAnimation';
import { Button } from '@/Components/ui/button';
import { useEffect, useState } from 'react';
import { FaDownload, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router';
import MyJourney from './MyJourney/MyJourney';

const About = () => {
  const [loadingCV, setLoadingCV] = useState(false);
  const [loadingWhatsApp, setLoadingWhatsApp] = useState(false);

  useEffect(() => {
    document.title = 'About';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="flex w-full flex-col gap-10 p-5 pt-[15%] md:pt-[5%]">
      <ImageOfMyself profilePic="/images-of-me/monday-toilet.png" />
      <div className="flex flex-col items-start justify-center gap-4">
        <p>Hi there!</p>
        <p className="w-full">
          As you might have guessed from the logo above, my name is Joseph. I’m
          a passionate developer who sees coding as a blend of creativity and a
          form of art.
        </p>
        <p>
          This portfolio is a reflection of my journey. Feel free to explore and
          learn more about me and the projects I’ve built along the way.
        </p>
        <p>In a nutshell:</p>
        <p className="w-full font-light italic">
          {' '}
          I just trying to get better every single day.
        </p>
        <div className="flex w-full items-center justify-start gap-4">
          <a
            href="/resume/yosef-hayim-full-stack-resume.pdf"
            download
            onClick={() => setLoadingCV((prev) => !prev)}
          >
            {loadingCV ? (
              <Button className="w-35 border border-none bg-transparent hover:bg-transparent">
                <LoaderAnimation state={loadingCV} setState={setLoadingCV} />
              </Button>
            ) : (
              <Button className="bg-white text-black transition delay-150 duration-300 ease-in-out hover:scale-110 hover:bg-gray-100">
                <FaDownload />
                Download CV
              </Button>
            )}
          </a>
          <Link
            to={`https://wa.me/546187549`}
            onClick={() => setLoadingWhatsApp((prev) => !prev)}
          >
            {loadingWhatsApp ? (
              <Button className="w-35 border border-none bg-transparent hover:bg-transparent">
                <LoaderAnimation
                  state={loadingWhatsApp}
                  setState={setLoadingWhatsApp}
                />
              </Button>
            ) : (
              <Button className="border border-[#374151] bg-transparent p-2 transition delay-150 duration-300 ease-in-out hover:scale-110 hover:bg-[#1f2937]">
                <FaWhatsapp color="#05df72" />
                Let's Chat
              </Button>
            )}
          </Link>
        </div>
      </div>
      <MyJourney />
    </div>
  );
};

export default About;
