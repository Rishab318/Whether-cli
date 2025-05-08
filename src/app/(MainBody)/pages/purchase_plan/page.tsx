"use client";
import "@/Components/PurchasePlanComponent/PurchasePlanComponent";
import { Col, Row } from "reactstrap";
import thankYou from "../../../../../public/assets/svg/thankYou.svg";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import PageTopHeader from "@/CommonComponent/PageTopHeader";
import "../../../../../public/assets/scss/pages/_purchase.scss";
import { useTranslation } from "react-i18next";
import OrderPlacedStepper from "@/CommonComponent/OrderPlacedStepper";
import OrderPlacedFooter from "@/CommonComponent/OrderPlacedFooter";
import { useSelector } from "react-redux";

const PurchasePlan = () => {
  const { userInfo } = useSelector((state: any) => state?.sharedData?.data);

  const { t } = useTranslation("common");
  return (
    <div className="purchase-page vertical">
      <div className="p-0 container">
        <Row className="m-0">
          <Col xs={12} className="p-0">
            <PrimeReactProvider>
              <div className="purchase-header">
                <div className="middle-header">
                  <PageTopHeader
                    image={thankYou}
                    title={
                      t("purchasePlan.thankYouMessage") +
                      " " +
                      userInfo?.firstName +
                      "!"
                    }
                    subtitle={
                      <div>
                        <div className="p-0 m-0 d-inline">
                          {t("purchasePlan.thankYouSubtitle")}&nbsp;
                        </div>
                        <a
                          href={`mailto:${userInfo?.email}`}
                          className="email p-0 m-0"
                        >
                          {userInfo?.email}&nbsp;
                        </a>
                        <span>{t("purchasePlan.thankYouSubtitleEnd")}</span>
                      </div>
                    }
                  />
                </div>
              </div>
              <OrderPlacedStepper />
            </PrimeReactProvider>
          </Col>
        </Row>
      </div>
      <OrderPlacedFooter />
    </div>
  );
};

export default PurchasePlan;
