import React from "react";
import Image from "next/image";
import spinloader from "../../public/assets/svg/spinloader.gif";

const Loading = () => {
  return (
    <div className="spinner-container">
      <Image src={spinloader} alt="Loading..." />
    </div>
  );
};

export default Loading;
