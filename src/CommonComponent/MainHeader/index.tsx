import * as React from "react";
import Image from "next/image";
import lobsterLogo from "../../../public/assets/svg/lobsterLogo.svg";
import phoneIconColored from "../../../public/assets/svg/phoneIcon-colored.svg";
import phoneIconWhite from "../../../public/assets/svg/phoneIcon-white.svg";
import menuIcon from "../../../public/assets/svg/menuIcon.svg";
import loginIcon from "../../../public/assets/svg/loginIcon.svg";
import aboutUsIcon from "../../../public/assets/svg/aboutUsIcon.svg";
import helpIcon from "../../../public/assets/svg/helpIcon.svg";
import mobile from "../../../public/assets/svg/mobile.svg";
import fibre from "../../../public/assets/svg/fibre.svg";
import mobileFibre from "../../../public/assets/svg/mobileFibre.svg";
import CustomButton from "../CustomButton";
import { i18n, useTranslation } from "next-i18next";
import Link from "next/link";
import { Divider } from "primereact/divider";
import planetEurope from "../../../public/assets/svg/planetEurope.svg";
import { Button } from "primereact/button";
import Close from "../../../public/assets/svg/Close.svg";
import Ribbon from "../../../public/assets/svg/Ribbon.svg";
import router from "next/router";
import { useState } from "react";
const MainHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeSubmenu, setActiveSubmenu] = React.useState<number | null>(null);
  const { t, i18n } = useTranslation("common");
  const [language, setLanguage] = useState("en");
  let lobster_url = process.env.NEXT_PUBLIC_LOBSTER_WEBSITE_URL;
  if (i18n.language === "es") {
    lobster_url = process.env.NEXT_PUBLIC_LOBSTER_WEBSITE_URL + "/es";
  }
  const lobster_url_login = process.env.NEXT_PUBLIC_LOBSTER_WEBSITE_URL_LOGIN;
  const handleLanguageSwitch = (language: string) => {
    i18n.changeLanguage(language);
    setLanguage(language);
  };
  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleSubmenu = (index: number) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  const headerColorButtons = [
    {
      btnName: t("HEADER.callMeBack"),
      className: "call-back-button xs-12",
      startImg: phoneIconColored,
      route: `${lobster_url}/#callMeBackModal`, // Route for Call Me Back
    },
    {
      btnName: t("HEADER.joinUs"),
      className: "join-us-button xs-12",
      startImg: phoneIconWhite,
    },
  ];

  //routes for headers
  const headerRightButtons = [
    {
      btnName: t("HEADER.aboutUs"),
      className: "header-button",
      startImg: aboutUsIcon,
      route: `${lobster_url}/about/`,
    },

    {
      btnName: "Find a store",
      className: "header-button-mobile",
      startImg: loginIcon,
      route: `${lobster_url}/find-a-store/`,
    },
    {
      btnName: t("HEADER.help"),
      className: "header-button",
      startImg: helpIcon,
      route: `${lobster_url}/help/`,
    },
    {
      btnName: "Activate SIM",
      className: "header-button-mobile",
      startImg: loginIcon,
      route: `${lobster_url}/activate-sim/`,
    },
    {
      btnName: t("HEADER.logIn"),
      className: "header-button",
      startImg: loginIcon,
      route: `${lobster_url_login}/selfcare/my-account#login`,
    },

    {
      submenuOptions: [
        {
          id: 1,
          btnName: t("footer.english"),
          className: "header-eng-button submenu-option",
          route: "#english",
        },
        {
          id: 2,
          btnName: t("footer.spanish"),
          className: "header-button submenu-option",
          route: "#spanish",
        },
      ],
    },
  ];

  const headerLink = [
    {
      className: "nav-item",
      linkClassName: "nav-link nav-link-mobile xs-12",
      startImg: mobile,
      label: t("HEADER.mobile"),
      route: `${lobster_url}/pay-as-you-go-plans/`,
    },
    {
      className: "nav-item",
      linkClassName: "nav-link nav-link-mobile xs-12",
      startImg: fibre,
      label: t("HEADER.fibre"),
      route: `${lobster_url}/fibre-plans/`,
    },
    {
      className: "nav-item",
      linkClassName: "nav-link nav-link-mobile xs-12",
      startImg: mobileFibre,
      label: t("HEADER.mobileFibre"),
      route: `${lobster_url}/bundle-mobile-fibre/`,
    },
  ];

  return (
    <>
      {/* added new links */}
      <div className="header-links align-items-center">
        {/* Quick access buttons for Activate SIM and Find a Store */}
        <Divider layout="vertical" />
        <Link
          href={`${lobster_url}/activate-sim/`}
          className="d-flex align-items-center"
        >
          <span>{t("HEADER.activate")}</span>
        </Link>
        <Divider layout="vertical" />
        <Link
          href={`${lobster_url}/find-a-store/`}
          className="d-flex align-items-center"
        >
          <span>{t("HEADER.store")}</span>
        </Link>
        <Divider layout="vertical" />
        <Image
          priority
          src={planetEurope}
          alt="login page"
          width={16}
          height={16}
          className="img pl-1"
        />
        <span
          className={`px-2 language-btn ${language === "en" && "active"}`}
          onClick={() => handleLanguageSwitch("en")}
          style={{ cursor: "pointer" }}
        >
          {t("footer.english")}
        </span>
        <span
          className={`pl-2 language-btn ${language === "es" && "active"}`}
          onClick={() => handleLanguageSwitch("es")}
          style={{ cursor: "pointer" }}
        >
          {t("footer.spanish")}
        </span>
      </div>

      <div
        className={
          isMenuOpen
            ? "menu-open main-header-container"
            : "main-header-container"
        }
        style={{
          position: "fixed",
          top: "21px",
          width: "100%",
          zIndex: "100",
        }}
      >
        <div className="nav-container">
          <nav
            className={`navbar navbar-expand-xl navbar-light header ${
              isMenuOpen ? "show" : ""
            }`}
          >
            <div className="container">
              <Link href={`${lobster_url}`}>
                <Image
                  priority
                  className="img-fluid for-light"
                  src={lobsterLogo}
                  alt="login page"
                />
              </Link>

              {/* Menu Toggle Button */}
              <CustomButton
                className="navbar-toggler"
                onClick={handleMenuToggle}
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation"
                btnName={t("HEADER.menuButton")}
                endImg={isMenuOpen ? Close : menuIcon}
              ></CustomButton>

              {/* Collapsible Menu */}
              <div
                className={`collapse navbar-collapse ${
                  isMenuOpen ? "show" : ""
                }`}
                id="navbarTogglerDemo03"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  {headerLink.map((menuItem, index) => (
                    <li key={index} className={menuItem.className}>
                      <Link
                        className={menuItem.linkClassName}
                        href={menuItem.route}
                      >
                        {menuItem.startImg && (
                          <Image
                            src={menuItem.startImg}
                            alt={`${menuItem.label} icon`}
                            width={32}
                            height={32}
                            className="nav-icon me-2"
                          />
                        )}
                        <span>{menuItem.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Header Buttons */}
                <div className="header-buttons-container">
                  {headerColorButtons.map((button, index) => (
                    <CustomButton
                      key={index}
                      btnName={button.btnName}
                      className={button.className}
                      startImg={button.startImg}
                      onClick={() => {
                        if (button.route) {
                          window.location.href = button.route;
                        }
                      }}
                    />
                  ))}
                  <div className=" header-logo-buttons">
                    {headerRightButtons.map((button: any, index: number) => (
                      <div key={index} className="buttons-submenu-container">
                        <div className="button-with-submenu">
                          <CustomButton
                            btnName={button.btnName}
                            className={button.className}
                            startImg={button.startImg}
                            onClick={() => {
                              if (button.submenuOptions) {
                                toggleSubmenu(index);
                              } else if (button.route) {
                                // For external links
                                if (button.route.startsWith("http")) {
                                  window.open(button.route, "_blank");
                                } else {
                                  // For internal routes
                                  window.location.href = button.route;
                                }
                              }
                            }}
                          />
                          {button?.submenuOptions && (
                            <div className="submenu-container">
                              {button.submenuOptions.map((subOption: any) => (
                                <>
                                  <CustomButton
                                    key={subOption.id}
                                    btnName={subOption.btnName}
                                    className={subOption.className}
                                    onClick={() => {
                                      if (subOption.route) {
                                        window.location.href = subOption.route;
                                      }
                                      toggleSubmenu(index);
                                    }}
                                  />
                                </>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MainHeader;
