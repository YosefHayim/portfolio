import { FaDiscord } from 'react-icons/fa';
import { Link } from 'react-router';

const DiscordSocialButton = () => {
  return (
    <Link rel="Discord" to="https://discord.com/channels/@josradesabag">
      <FaDiscord
        className="bg-transparent text-gray-400 hover:text-white"
        size={25}
      />
    </Link>
  );
};

export default DiscordSocialButton;
