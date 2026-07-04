import { useEffect } from 'react';
import { GoDotFill } from 'react-icons/go';
import { useNavigate } from 'react-router';

const NotFound404 = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = '404';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const timeout = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-start justify-start gap-2 rounded-sm bg-gray-700 p-1">
      <GoDotFill size={28} className="text-red-400" />
      <p>404 Error, the page was not found.</p>
      <p>Redirecting you to homepage.</p>
    </div>
  );
};

export default NotFound404;
