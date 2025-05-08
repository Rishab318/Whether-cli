import React from "react";
import PlansCard from "../PlansCard";
import Image from "next/image";
import mrLobster from "../../../public/assets/images/Mr_Lobster_standing_a_ok_sign.png";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  findMoreMobilePlanLarge,
  findMoreMobilePlanMedium,
  findMoreMobilePlanSmall,
  internationalMobilePlanLarge,
  internationalMobilePlanMedium,
  internationalMobilePlanSmall,
} from "@/Constant";

const OrderPlacedFooter = () => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  let lobster_url = process.env.NEXT_PUBLIC_LOBSTER_WEBSITE_URL;
  if (i18n.language === "es") {
    lobster_url = process.env.NEXT_PUBLIC_LOBSTER_WEBSITE_URL + "/es";
  }

  const cardData = Array.from({ length: 3 }, (_, index) => {
    // Initialize with default values to satisfy TypeScript
    let planVariable: string = "";
    let planFindMoreVariable: string = "";

    // Determine which variable to use based on index
    if (index === 0) {
      planVariable = internationalMobilePlanSmall;
      planFindMoreVariable = findMoreMobilePlanSmall;
    } else if (index === 1) {
      planVariable = internationalMobilePlanMedium;
      planFindMoreVariable = findMoreMobilePlanMedium;
    } else if (index === 2) {
      planVariable = internationalMobilePlanLarge;
      planFindMoreVariable = findMoreMobilePlanLarge;
    }

    return {
      headerData: t(`ORDERPLACEDCARD.headerData${index + 1}`),
      titleData: t(`ORDERPLACEDCARD.titleData${index + 1}`),
      titleDataType: t(`ORDERPLACEDCARD.titleDataType`),
      subTitleDataType: t(`ORDERPLACEDCARD.subTitleDataType`),
      subTitleIntegerValue: t(
        `ORDERPLACEDCARD.subTitleIntegerValue${index + 1}`
      ),
      subTitleDecimalValue: t(`ORDERPLACEDCARD.subTitleDecimalValue`),
      footerBtnName: t(`ORDERPLACEDCARD.footerBtnName`),
      planBtnName: t(`ORDERPLACEDCARD.planBtnName`),
      cardBodyData: t(`ORDERPLACEDCARD.cardBodyData`),
      onclick: () => {
        router.push(`/api/data${planVariable}`);
      },
      route: `${lobster_url}/pay-as-you-go-plans/${planFindMoreVariable}`,
    };
  });
  return (
    <div className="order-footer-container">
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <div className="footer-data">
              <span className="footer-heading">
                {t(`ORDERPLACEDCARD.footerHeading`)}
              </span>
              <div className="footer-cards-container pb-3">
                <div className="cards-container">
                  {cardData.map((card, index) => (
                    <div key={index}>
                      <PlansCard
                        headerData={card.headerData}
                        titleData={card.titleData}
                        titleDataType={card.titleDataType}
                        subTitleDataType={card.subTitleDataType}
                        subTitleIntegerValue={card.subTitleIntegerValue}
                        subTitleDecimalValue={card.subTitleDecimalValue}
                        footerBtnName={card.footerBtnName}
                        planBtnName={card.planBtnName}
                        cardBodyData={card.cardBodyData}
                        onClick={card.onclick}
                        route={card.route}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <Link
                    className="secondary-link"
                    href={`${lobster_url}/pay-as-you-go-plans/`}
                  >
                    {t(`ORDERPLACEDCARD.discoverMobilePlanBtn`)}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <Image src={mrLobster} alt={""}></Image>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPlacedFooter;
