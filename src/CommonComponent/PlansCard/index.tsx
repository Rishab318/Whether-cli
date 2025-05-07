import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React, { FC } from "react";
import Link from "next/link";
import { PlansCardProps } from "@/Types/CommonComponent.type";

const PlansCard: FC<PlansCardProps> = ({
  headerData,
  titleData,
  titleDataType,
  subTitleDataType,
  subTitleIntegerValue,
  subTitleDecimalValue,
  footerBtnName,
  cardBodyData,
  onClick,
  route,
}) => {
  const header = <span>{headerData}</span>;
  const title = (
    <>
      <span className="title-data">{titleData}</span>
      <span className="title-data-type">{titleDataType}</span>
    </>
  );
  const subTitle = (
    <>
      <span className="subtitle-data-type">{subTitleDataType}</span>
      <span className="subtitle-integer-value">{subTitleIntegerValue}</span>
      <span className="subtitle-decimal-value">.{subTitleDecimalValue}</span>
    </>
  );
  const footer = (
    <div>
      <Link href={route}>
        <Button className="mb-2">{footerBtnName}</Button>
      </Link>
    </div>
  );
  return (
    <div className="plans-card-container">
      <Card header={header} title={title} subTitle={subTitle} footer={footer}>
        <span>{cardBodyData}</span>
      </Card>
    </div>
  );
};

export default PlansCard;
