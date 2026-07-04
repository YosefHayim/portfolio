import { useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router";
import { SEO } from "@/Components/SEO/SEO";

const NotFound404 = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const timeout = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <>
      <SEO
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist. Redirecting to homepage."
        noindex
      />
      <div className="flex w-full flex-col items-start justify-start gap-2 rounded-sm bg-gray-700 p-1">
        <GoDotFill className="text-red-400" size={28} />
        <p>404 Error, the page was not found.</p>
        <p>Redirecting you to homepage.</p>
      </div>
    </>
  );
};

export default NotFound404;
