import { ReactNode } from 'react';
import { Link } from 'react-router';

const CertificationCard: React.FC<{
  icon: ReactNode;
  certificateTitle: string;
  yearEarnedCertificate: string;
  certificateLink: string;
  children?: ReactNode;
}> = ({
  icon,
  yearEarnedCertificate,
  certificateTitle,
  certificateLink,
  children,
}) => {
  return (
    <section className="flex w-full flex-col items-start justify-start rounded-sm bg-gray-800 p-2 text-sm hover:bg-gray-700">
      <Link to={certificateLink} className="flex items-center">
        <div className="flex w-full justify-center gap-2">
          <p>{icon}</p>
          <p className="text-center">{certificateTitle}</p>
          <p>{yearEarnedCertificate}</p>
        </div>
        {children}
      </Link>
    </section>
  );
};

export default CertificationCard;
