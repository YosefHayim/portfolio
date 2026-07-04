import { Button } from '@/Components/ui/button';
import ImageOfMyself from '@/Components/ImageOfMyself/ImageOfMyself';
import { Link } from 'react-router';
import LoaderAnimation from '@/Components/LoaderAnimation/LoaderAnimation';
import { FaWhatsapp } from 'react-icons/fa';
import { useState } from 'react';

const Hero = () => {
  const [loadingWhatsApp, setLoadingWhatsApp] = useState(false);

  return (
    <div className="flex w-full flex-col items-center justify-between gap-5">
      <div className="flex flex-col items-start justify-center gap-4">
        <h2 className="w-full text-center text-2xl">
          From curiosity to code <br className="md:hidden"></br>building what
          matters<span>.</span>
        </h2>
        <p className="text-center text-gray-400">
          I’m a full-stack developer who codes with intent — building digital
          tools that empower users, streamline work, and move ideas forward.
          Tech should feel like magic, but work like muscle.
        </p>
      </div>
      <div className="flex w-full items-center justify-center gap-4">
        <Link to={'/projects'}>
          <Button className="border-[#374151] bg-white text-black transition delay-150 duration-300 ease-in-out hover:border hover:bg-transparent hover:text-white">
            View Projects
          </Button>
        </Link>
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
            <Button className="border border-[#374151] bg-transparent p-2 transition delay-150 duration-300 ease-in-out hover:bg-[#1f2937]">
              <FaWhatsapp color="#05df72" />
              Let׳s Chat
            </Button>
          )}
        </Link>{' '}
      </div>
      <ImageOfMyself profilePic="/images-of-me/whatsapp-profile.png" />
    </div>
  );
};

export default Hero;
