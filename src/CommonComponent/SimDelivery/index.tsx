import * as React from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

const SimDelivery = (props: any) => {
  const { label } = props;
  const { buildingAddress, floorAddress, shoppingCart, communicationAddress } =
    useSelector((state: any) => state?.sharedData?.data);
  const { t } = useTranslation("common");

  const getDescription = () => {
    if (shoppingCart.cartType === "fibre") {
      return (
        <>
          <p className="last-text">
            {t("purchasePlan.installationDescription")}
          </p>
        </>
      );
    } else if (shoppingCart.cartType === "bundle") {
      // For fibre and bunlde this address
      const buildingSummary = buildingAddress?.summary || "";
      const floorSummary = floorAddress?.address_description?.summary || "";
      const address = buildingSummary
        ? buildingSummary + (floorSummary ? `, ${floorSummary}` : "")
        : "";
      return (
        <>
          <p className="last-text">
            {t("purchasePlan.installationAndSimDeliveryDescription")}
          </p>
          <span>{address}</span>
        </>
      );
    } else {
      // For mobile
      const address = communicationAddress?.summary;
      return (
        <>
          <p className="last-text">{t("purchasePlan.confirmIdentityFooter")}</p>
          <span>{address}</span>
          <p className="mb-0">{t("purchasePlan.deliveryTimeCombined")}</p>
        </>
      );
    }
  };

  return (
    <div className={`${label ? "last-para card-view" : "last-para"}`}>
      {label && <h5>{label}</h5>}
      {getDescription()}
    </div>
  );
};

export default SimDelivery;
