const ImageOfMyself = ({
  profilePic = "/images-of-me/linkedin-profile.png",
}) => {
  return (
    <div className="flex w-full items-center justify-center">
      <img
        alt="Yosef hayim sabag"
        className="w-full max-w-1/2 rounded-sm"
        src={profilePic}
      />
    </div>
  );
};

export default ImageOfMyself;
