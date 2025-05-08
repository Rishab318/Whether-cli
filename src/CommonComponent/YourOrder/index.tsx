import React, { FC, useState } from "react";
import { Card } from "primereact/card";
import { GridShim } from "@fluentui/react-migration-v0-v9";
import Image from "next/image";
import planIcon from "../../../public/assets/svg/planIcon.svg";
import phoneIcon from "../../../public/assets/svg/phoneIcon.svg";
import fibreIcon from "../../../public/assets/svg/fibre-card-icon.svg";
import Text from "../Text";
import { Trans, useTranslation } from "react-i18next";
import infocircle from "../../../public/assets/svg/info-circle.svg";
import simcard from "../../../public/assets/svg/simcard.svg";
import iconCross from "../../../public/assets/svg/cross.svg";
import {
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from "@fluentui/react-components";
import { Divider } from "primereact/divider";
import { log } from "console";
import { useSelector } from "react-redux";
import { PLAN_TYPES, PURCHASE_PLAN } from "@/Constant";

interface YourOrderProps {
  mobilePlan: boolean;
  fibrePlan: boolean;
  planName: string;
  planPrice: string;
}
const YourOrder: FC<YourOrderProps> = ({
  mobilePlan,
  fibrePlan,
  planName,
  planPrice,
}) => {
  const sharedData = useSelector((state: any) => state?.sharedData?.data);
  const newFibrePlan = sharedData?.shoppingCart?.productsInfo?.results?.find(
    (product: { planType: string }) =>
      product?.planType?.toLowerCase() === PLAN_TYPES.FIBRE_TYPE
  );
  const mobileDiscountBundle =
    sharedData?.shoppingCart?.productsInfo?.results
      ?.find(
        (product: { planType: string }) => product?.planType === PURCHASE_PLAN
      )
      ?.characteristics.find(
        (item: { characteristicName: string }) =>
          item.characteristicName === "DISCOUNT"
      )?.characteristicValue || "";

  const { t } = useTranslation("common");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const handleClose = () => {
    setIsPopoverOpen(false);
  };

  const splitByComma = (str: string): string[] => {
    // Split by comma and trim whitespace from results
    return str.split(",").map((item) => item.trim());
  };
  const packageNames = splitByComma(planName);
  let packagePrices: string[] = [];
  if (planPrice) {
    packagePrices = splitByComma(planPrice);
  }
  if (packagePrices && sharedData?.shoppingCart?.productsInfo?.results) {
    const results = sharedData.shoppingCart.productsInfo.results;
    const mobilePrices: string[] = [];
    const fibrePrices: string[] = [];

    results.forEach((product: { planType: string; priceDetails: any }) => {
      const planTypeLower = product.planType.toLowerCase();
      const priceDetails = product.priceDetails;
      let price = "0";

      if (priceDetails?.monthly?.alterationPrice?.totalPrice > 0) {
        price = priceDetails.monthly.alterationPrice.totalPrice.toString();
      } else if (priceDetails?.oneTimeUp?.alterationPrice?.totalPrice > 0) {
        price = priceDetails.oneTimeUp.alterationPrice.totalPrice.toString();
      }

      if (planTypeLower === PLAN_TYPES.MOBILE_TYPE) {
        mobilePrices.push(price);
      } else if (planTypeLower === PLAN_TYPES.FIBRE_TYPE) {
        fibrePrices.push(price);
      }
    });

    // Combine mobile prices first, then fibre prices
    packagePrices = [...mobilePrices, ...fibrePrices];
  }

  const referralCode = sharedData?.shoppingCart?.referralCode || "";
  const referralMobilePlanPrice =
    sharedData?.shoppingCart?.productsInfo?.results?.find(
      (product: { planType: string }) => product?.planType === PURCHASE_PLAN
    )?.priceDetails?.oneTimeUp?.alterationPriceReferral?.PriceBeforeTax;
  const referralMobilePlanDiscount =
    sharedData?.shoppingCart?.productsInfo?.results?.find(
      (product: { planType: string }) => product?.planType === PURCHASE_PLAN
    )?.priceDetails?.oneTimeUp?.alterationPriceReferral?.referralDiscount;

  return (
    <div className="order-card">
      <Text className="card-title" title={t("yourOrder.yourOrderText")}></Text>
      <Card className="plan-card">
        {mobilePlan && (
          <div className="data-container">
            <div className="body-container">
              <div className="card-header">
                <div className="icon-container">
                  <Image src={planIcon} alt="login page" />
                </div>
                <div className="description-container">
                  <Text title={packageNames[0]} className="plan-card-title" />

                  <Text
                    title={t("yourOrder.mobilePlan_description_one")}
                    className="plan-card-description"
                  />
                </div>
                <Text
                  title={
                    referralCode
                      ? `€ ${referralMobilePlanPrice}`
                      : `€ ${packagePrices[0]}`
                  }
                  className="plan-card-value"
                />
              </div>

              {fibrePlan && (
                <div className="card-footer-container">
                  <Text
                    title={t("yourOrder.mobilePlan_description_two")}
                    className="footer-data"
                  />
                  <Text
                    title={`${mobileDiscountBundle}`}
                    className="footer-value"
                  />
                </div>
              )}
              <div className="card-footer-container">
                <div>
                  <Text
                    title={t("yourOrder.universalSimText")}
                    className="footer-data"
                  />
                  <Popover
                    open={isPopoverOpen}
                    onOpenChange={(e, data) => setIsPopoverOpen(data.open)}
                    positioning={{ position: "below", align: "end" }}
                  >
                    <PopoverTrigger>
                      <Image
                        priority
                        className="p-link img-fluid for-light info-circle-img"
                        src={infocircle}
                        alt="info icon"
                        width={12}
                        height={12}
                      />
                    </PopoverTrigger>
                    <div className="info-icon-card">
                      <PopoverSurface>
                        <Card className="info-card">
                          <Image
                            priority
                            className="p-link close-popover"
                            src={iconCross}
                            alt="close"
                            onClick={handleClose}
                          />
                          <p>{t("yourOrder.infoPara")}</p>
                          <Image
                            priority
                            className="img-fluid sim-info-img"
                            src={simcard}
                            alt="info card"
                            width={188.186}
                            height={119}
                          />
                        </Card>
                      </PopoverSurface>
                    </div>
                  </Popover>
                </div>

                <Text title={t("yourOrder.Free")} className="footer-value" />
              </div>
              <div className="card-footer-container">
                <Text
                  title={t("yourOrder.simDeliveryText")}
                  className="footer-data"
                />
                <Text title={t("yourOrder.Free")} className="footer-value" />
              </div>
            </div>
          </div>
        )}
        {mobilePlan && fibrePlan && <Divider />}
        {fibrePlan && (
          <div className="data-container">
            <div className="body-container">
              <div className="card-header">
                <div className="icon-container">
                  <Image priority src={fibreIcon} alt="login page" />
                </div>
                <div className="description-container">
                  <Text
                    title={
                      packageNames.length === 2
                        ? packageNames[1]
                        : packageNames[0]
                    }
                    className="plan-card-title"
                  />

                  <Text
                    title={t("yourOrder.fibrePlan_description_one")}
                    className="plan-card-description"
                  />
                  <Text
                    title={`${t(
                      "yourOrder.fibrePlan_description_two_a"
                    )} € ${newFibrePlan?.priceDetails?.monthly?.normalPrice?.totalPrice?.toString()} ${t(
                      "yourOrder.fibrePlan_description_two_b"
                    )}`}
                    className="plan-card-description"
                  />
                </div>
                <Text
                  title={`€ ${
                    packagePrices.length === 2
                      ? packagePrices[1]
                      : packagePrices[0]
                  }`}
                  className="plan-card-value"
                />
              </div>

              <div className="card-footer-container">
                <Text
                  title={t("yourOrder.Installation & router")}
                  className="footer-data"
                />
                <Text title={t("yourOrder.Free")} className="footer-value" />
              </div>
            </div>
          </div>
        )}
      </Card>
      {!fibrePlan && (
        <div className="align-center justify-content-between needhelp-container">
          <div>
            <div className="need-help-wrapper">
              <Text title={t("yourOrder.needHelpText")} className={""} />
              <br />
              <Text title={t("yourOrder.callUsText")} className={""} />
            </div>
          </div>

          <div className="image-container">
            <Image
              priority
              className="img-fluid phone-icon"
              src={phoneIcon}
              alt="login page"
            />
            <Text
              title={t("yourOrder.callingNumber")}
              className="calling-number"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default YourOrder;
