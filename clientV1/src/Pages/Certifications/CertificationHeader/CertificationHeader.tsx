import LastTimeUpdatedBy from "@/Components/LastTimeUpdatedBy/LastTimeUpdatedBy";

const CertificationHeader = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-5">
      <div className="gap-2 flex items-center w-full">
        <div className="gap-2 items-center w-full flex flex-col">
          <h2 className="w-full pt-[10%] text-center text-3xl">
            Professional Certifications
          </h2>
          <LastTimeUpdatedBy />
        </div>
      </div>
      <p className="text-center text-gray-400">
        A collection of professional certifications and courses completed to
        enhance technical expertise and stay with current with industry
        standards.
      </p>
    </div>
  );
};

export default CertificationHeader;
