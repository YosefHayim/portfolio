import { FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router';

const LinkedinSocialButton: React.FC<{ to?: string }> = ({
  to = 'https://www.linkedin.com/in/yosef-hayim-sabag/',
}) => {
  return (
    <Link rel="Linkedin" to={to}>
      <FaLinkedin
        className="bg-transparent text-gray-400 transition delay-150 duration-300 ease-in-out hover:text-white"
        size={25}
      />
    </Link>
  );
};

export default LinkedinSocialButton;
