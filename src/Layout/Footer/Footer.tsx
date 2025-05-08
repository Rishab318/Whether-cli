import React, { useState } from "react";
import Image from "next/image";
import vectorIcon from "../../../public/assets/svg/Vector.svg";
import Vector2 from "../../../public/assets/svg/Vector-2.svg";
import worldPay from "../../../public/assets/svg/worldpay.svg";
import languageIcon from "../../../public/assets/svg/language.svg";
import paymentMethod1 from "../../../public/assets/svg/payment-method-1.svg";
import paymentMethod2 from "../../../public/assets/svg/payment-method-2.svg";
import paymentMethod3 from "../../../public/assets/svg/payment-method-3.svg";
import lobsterLine from "../../../public/assets/svg/lobster-line.svg";
import lastFooterLine from "../../../public/assets/svg/lastFooterLine.svg";
import lobsterLogo from "../../../public/assets/svg/brand-logo.svg";
import { ListBox } from "primereact/listbox";
import Franja from "../../../public/assets/svg/Franja.svg";
import { Trans } from "react-i18next";
import { i18n, useTranslation } from "next-i18next";
const Footer = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const { t, i18n } = useTranslation("common");
  const [language, setLanguage] = useState("en");
  const handleLanguageSwitch = (language: string) => {
    i18n.changeLanguage(language);
    setLanguage(language);
  };
  const footerItems = [
    {
      name: t("footer.lobster.name"),
      code: t("footer.lobster.code"),
      url: "https://www.lobster.es/",
    },
    {
      name: t("footer.privacy.name"),
      code: t("footer.privacy.code"),
      url: "https://www.lobster.es/legal-stuff/privacy-policy/",
    },
    {
      name: t("footer.termsMobile.name"),
      code: t("footer.termsMobile.code"),
      url: "https://www.lobster.es/legal-stuff/general-terms-and-conditions-for-mobile-services/",
    },
    {
      name: t("footer.termsFibre.name"),
      code: t("footer.termsFibre.code"),
      url: "https://www.lobster.es/legal-stuff/terms-and-conditions-for-fibre/",
    },
    {
      name: t("footer.cookies.name"),
      code: t("footer.cookies.code"),
      url: "https://www.lobster.es/legal-stuff/cookies/",
    },
    {
      name: t("footer.priceGuide.name"),
      code: t("footer.priceGuide.code"),
      url: "https://www.lobster.es/wp-content/uploads/2023/03/Tariffs_Special_And_Premium_Numbers.pdf",
    },
  ];
  const handleListItem = (e: any) => {
    setSelectedItem(e.value);
    if (e?.value?.url) {
      window.location.href = e?.value?.url;
    }
  };

  return (
    <div className="footer">
      <footer className="container">
        <Image
          priority
          src={vectorIcon}
          alt="login page"
          className="footer-img"
        />
        <div className="d-flex flex-column align-items-center">
          <Image
            priority
            src={lobsterLine}
            alt="login page"
            className="footer-line-img"
          />
          <Image
            priority
            src={lobsterLogo}
            alt="login page"
            className="footer-logo-img"
          />
        </div>
        <div className="row align-center footer-content">
          <div className="col-lg-3">
            <h4 className="call-us-text">{t("footer.callUs")}</h4>
            <p className="availibility-text">
              <Trans i18nKey="footer.availability">
                {t("footer.availability")}
              </Trans>
            </p>
          </div>
          <div className="col">
            <div className="join-lobster-wrapper call">
              <div className="phone-wrapper1">
                <Image
                  priority
                  src={Vector2}
                  alt="login page"
                  className="img"
                />
              </div>
              <div>
                <h4 className="join-lobster-text">{t("footer.joinLobster")}</h4>
                <p className="calling-number">{t("footer.call1661")}</p>
              </div>
            </div>
          </div>
          <div className="col number">
            <div className="join-lobster-wrapper">
              <div className="phone-wrapper">
                <Image
                  priority
                  src={Vector2}
                  alt="login page"
                  className="img"
                />
              </div>
              <div>
                <h4 className="join-lobster-text">
                  {t("footer.alreadyCustomer")}
                </h4>
                <p className="calling-number">{t("footer.call711")}</p>
              </div>
            </div>
          </div>
          <div className="col ">
            <div className="join-lobster-outside-spain">
              <div className="phone-wrapper">
                <Image
                  priority
                  src={Vector2}
                  alt="login page"
                  className="img"
                />
              </div>
              <div>
                <h4 className="join-lobster-text">
                  {t("footer.outsideSpain")}
                </h4>
                <p className="calling-number3">
                  {t("footer.outsideSpainNumber")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row payment-footer">
          <div className="col-sm-6 payment-methods">
            <div className="payment-icons">
              <Image
                priority
                src={paymentMethod3}
                alt="login page"
                className="img"
              />
              <Image
                priority
                src={paymentMethod1}
                alt="login page"
                className="img"
              />{" "}
              <Image
                priority
                src={paymentMethod2}
                alt="login page"
                className="img"
              />{" "}
              <Image priority src={worldPay} alt="login page" className="img" />
            </div>
          </div>
          <div className="col payment-methods">
            <div className="d-flex align-start justify-content-sm-end lang">
              <Image
                priority
                src={languageIcon}
                alt="login page"
                width={36}
                height={36}
                className="img px-2 pb-2"
              />
              <span
                className={`px-2 language-btn-footer ${
                  language === "en" && "active"
                }`}
                onClick={() => handleLanguageSwitch("en")}
                style={{ cursor: "pointer" }}
              >
                {t("footer.english")}
              </span>
              <span
                className={`pl-2 language-btn-footer ${
                  language === "es" && "active"
                }`}
                onClick={() => handleLanguageSwitch("es")}
                style={{ cursor: "pointer" }}
              >
                {t("footer.spanish")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-content-center col-12 version">
          <ListBox
            value={selectedItem}
            onChange={(e) => handleListItem(e)}
            options={footerItems}
            optionLabel="name"
            className="w-full"
          />
        </div>
      </footer>
    </div>
  );
};

export default Footer;
