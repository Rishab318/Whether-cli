"use client";
import { EmailAddress, Password, CallUsOn, SignIn } from "@/Constant";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Form, FormGroup } from "reactstrap";
import lobsterLogo from "../../../public/assets/svg/lobsterLogo.svg";
import phoneIcon from "../../../public/assets/svg/phoneIcon.svg";
import { useTranslation } from "next-i18next";
import { i18n } from "next-i18next";
import { I18nProvider } from "@/app/i18n/i18n-context";
import InputText from "@/CommonComponent/InputText";
import InputDropdown from "@/CommonComponent/InputDropdown";
import AboutYou from "@/CommonComponent/AboutYou";

const UserForm = () => {
  return (
    <div style={{ background: "white" }}>
      {/* <div className="login-header">
          <div>
            <Image
              priority
              width={168}
              height={30}
              className="img-fluid for-light"
              src={lobsterLogo}
              alt="login page"
            />
          </div>
          <div className="call-us-on">
            <Dropdown
              aria-labelledby={dropdownId}
              placeholder="Select Language"
              {...props}
              onOptionSelect={handleLanguageChange}
            >
              {options.map((option) => (
                <Option key={option.code} value={option.label}>
                  {option.label}
                </Option>
              ))}
            </Dropdown>
            <Image
              priority
              width={31}
              height={39}
              className="img-fluid for-light"
              src={phoneIcon}
              alt="login page"
            />
            <div>
              <p className="call-us-on-text">{CallUsOn}</p>
              <h4 className="calling-number">900 822 622</h4>
            </div>
          </div>
        </div> */}
      <div>
        {/* <div className="login-main mx-auto">
              <Form
                className="theme-form"
                onSubmit={(event) => formSubmitHandle(event)}
              >
                <h4 className="login-title">{t("LOGIN.WELCOME_MESSAGE")}</h4>
                <p className="login-description">
                  {t("LOGIN.WELOME_DESCRIPTION")}
                </p>
                <FormGroup className="form-group">
                  <Label
                    htmlFor={inputId}
                    size={props.size}
                    disabled={props.disabled}
                  >
                    {t("LOGIN.EMAIL")}
                  </Label>
                  <Input
                    id={inputId}
                    type="email"
                    name="email"
                    placeholder={t("LOGIN.ENTER_USERNAME")}
                    {...props}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className="col-form-label">
                    {t("LOGIN.PASSWORD")}
                  </Label>
                  <div className="form-input position-relative">
                    <Input
                      type={show ? "text" : "password"}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={t("LOGIN.ENTER_PASSWORD")}
                    />
                  </div>
                  <h4 className="forgot-password my-4 text-center">
                    {t("LOGIN.FORGOT_PASSWORD")}
                  </h4>
                  <div className="text-end">
                    <Button type="submit" className="btn rounded-pill w-100">
                      {t("LOGIN.LOGIN")}
                    </Button>
                  </div>
                </FormGroup>
              </Form>
            </div> */}
      </div>
    </div>
  );
};
export default UserForm;
