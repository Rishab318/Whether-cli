import React from "react";
import { PageTopHeaderType } from "@/Types/CommonComponent.type";
import "../../../public/assets/scss/pages/_page-top-header.scss";
import Image from "next/image";
const PageTopHeader: React.FC<PageTopHeaderType> = ({
  image,
  title,
  subtitle,
  optionalTitle,
}) => {
  return (
    <div className="container banner-container">
      <div>
        <h1 className="title">{title}</h1>
        {optionalTitle && <h1 className="title">{optionalTitle}</h1>}
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
      {image && <Image src={image} alt="" className="image" />}
    </div>
  );
};

export default PageTopHeader;
