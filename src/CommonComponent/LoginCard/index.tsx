import React, { FC, forwardRef, useImperativeHandle, useRef } from "react";
import { Card } from "primereact/card";
import { Formik, Field, Form } from "formik";
import Image from "next/image";
import CustomButton from "../CustomButton";
import Input from "../InputText";
import cross from "../../../public/assets/svg/cross.svg";
import { validationSchema } from "@/utils/FormSchema";
import { useTranslation } from "react-i18next";
import { Dialog, DialogBody, DialogSurface } from "@fluentui/react-components";
import FocusError from "../FocusError";
import { Toast } from "primereact/toast";

interface LoginCardProp {
  open: boolean;
  onClose?: () => void;
  handleSubmit: (value: any) => void;
}

const LoginCard = forwardRef<any, LoginCardProp>(
  ({ open = false, onClose, handleSubmit }, ref) => {
    const { t } = useTranslation("common");
    const toast = useRef<Toast>(null);

    // Expose the showToast function to the parent component
    useImperativeHandle(ref, () => ({
      show: (toastParams: any) => {
        if (toast.current) {
          toast.current.show(toastParams);
        }
      },
      clear: () => {
        if (toast.current) {
          toast.current.clear();
        }
      },
    }));
    const handleClose = () => {
      if (onClose) {
        onClose();
      }
    };
    const forgot_url = process.env.NEXT_PUBLIC_PASSWORD_RESET_URL;

    return (
      <Dialog open={open}>
        <DialogSurface className="login-popup">
          <DialogBody>
            <div className="login-card">
              <Card className="login-card-container">
                <div className="login-card-close">
                  <Image
                    className="cross-img"
                    src={cross}
                    width={32}
                    height={32}
                    alt="close"
                    onClick={handleClose}
                  />
                </div>
                <div className="login-card-content">
                  <p className="title">{t("loginCard.title")}</p>
                  <p className="description">{t("loginCard.description")}</p>

                  <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values }) => (
                      <Form>
                        <div className="form-group">
                          <Field
                            name="email"
                            label={t("loginCard.email")}
                            errorFieldName="email"
                            value={values.email}
                            placeholder="name@gmail.com"
                            component={Input}
                          />
                        </div>

                        <div className="form-group">
                          <Field
                            name="password"
                            label={t("loginCard.password")}
                            value={values.password}
                            errorFieldName="password"
                            password={true}
                            placeholder="••••••••"
                            component={Input}
                          />
                        </div>

                        <a
                          href={`${forgot_url}#forgotten-password`}
                          className="password-link"
                        >
                          {t("loginCard.forgotPassword")}
                        </a>

                        <div className="form-submit">
                          <button className="send-button" type="submit">
                            {t("loginCard.buttonName")}
                          </button>
                        </div>
                        {/* OSP-183 :Automatically scrolls and focuses to the first form field withan error upon form submission. */}
                        <FocusError />
                      </Form>
                    )}
                  </Formik>
                  <div className="toast-container">
                    <Toast ref={toast} />
                  </div>
                </div>
              </Card>
            </div>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    );
  }
);
LoginCard.displayName = "LoginCard";

export default LoginCard;
