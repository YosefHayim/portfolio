import { GoDash } from 'react-icons/go';
import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="relative h-8 w-10">
        <IoIosArrowForward size={24} className="absolute top-0 left-0" />
        <GoDash size={24} className="absolute right-0 bottom-0" />
      </div>
      <h1 className="text-2xl font-semibold">Joseph Sabag</h1>
    </Link>
  );
};

export default Logo;
