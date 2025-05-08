import { Card } from "primereact/card";
import { InputSwitch } from "primereact/inputswitch";
import React, { FC, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "primereact/button";
import cross from "../../../public/assets/svg/cross.svg";
import { useTranslation } from "react-i18next";
import { Dialog, DialogBody, DialogSurface } from "@fluentui/react-components";
import { Field, FieldProps, Form, Formik } from "formik";
import PreserveForm from "@/CommonComponent/PreserveForm";
import spinloader from "../../../public/assets/svg/spinloader.gif";

interface PaymentInformationProp {
  open?: boolean;
  paymentUrl: string;
  isRecurringDisabled?: boolean;
  existingCustomer?: boolean;
  onSuccess?: (sessionId?: string) => void;
  onRecurringToggle?: (isRecurring: boolean) => void;
}

const PaymentInformation: FC<PaymentInformationProp> = ({
  open,
  paymentUrl,
  isRecurringDisabled,
  onRecurringToggle,
  onSuccess,
  existingCustomer,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation("common");
  const [checked, setChecked] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleToggle = (e: { value: boolean }) => {
    setChecked(e.value);
    onRecurringToggle?.(e.value);
    if (!e.value) {
      setIsVisible(true);
    }
  };

  const closeCard = () => {
    setChecked(true);
    onRecurringToggle?.(true);
    setIsVisible(false);
  };

  // Reset payment states when URL changes
  useEffect(() => {
    setPaymentStatus(null);
    setPaymentResult(null);
    setPaymentError(null);
  }, [paymentUrl]);

  // Handle messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Process messages from the iframe
      if (event.data && event.data.type) {
        switch (event.data.type) {
          case "payment_initialized":
            if (!event.data.success) {
              setPaymentError(
                event.data.error || "Failed to initialize payment"
              );
            }
            break;

          case "payment_result":
            setPaymentResult(event.data.result);

            // Set payment status
            const status =
              event.data.result?.order?.status || event.data.result?.status;
            setPaymentStatus(status || "unknown");
            // Only call onSuccess if status is "success"
            if (status === "success") {
              if (event.data.result?.sessionId) {
                onSuccess?.(event.data.result.sessionId);
              } else {
                onSuccess?.();
              }
            }
            break;
        }
      }
    };

    // Add event listener
    window.addEventListener("message", handleMessage);

    // Clean up
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Get URL for the payment HTML file
  const getPaymentPageUrl = () => {
    if (!paymentUrl) return "";

    // In production, this should point to your hosted payment.html file
    // For development, you can use a local path
    const paymentPageBase = "/payment.html";

    // Encode the payment URL and append as query parameter
    return `${paymentPageBase}?paymentUrl=${encodeURIComponent(paymentUrl)}`;
  };

  return (
    <div className="payment-info-container">
      <Formik onSubmit={() => {}} initialValues={{ isRecurring: true }}>
        {({ setFieldValue, values }) => {
          return (
            <Form>
              <div className="row">
                <div className="col-12">
                  {/* this button is removed from the fibre flow due to in fibre we don't need to send recurring key in complete sale*/}
                  <div
                    className={`payment-container ${
                      isRecurringDisabled && "d-none"
                    }`}
                  >
                    <div>
                      <Field name="isRecurring" value={values.isRecurring}>
                        {({ field }: FieldProps) => (
                          <InputSwitch
                            {...field}
                            checked={field.value}
                            onChange={(e) => {
                              handleToggle(e);
                              setFieldValue("isRecurring", e.value);
                              setChecked(e.value);
                              onRecurringToggle?.(e.value);
                            }}
                          />
                        )}
                      </Field>
                    </div>
                    <span>
                      <span
                        onClick={() =>
                          !values.isRecurring && setIsVisible(true)
                        }
                      >
                        {t("paymentInformation.autoRenew")}
                      </span>
                      <span className="switchLabel">
                        {t("paymentInformation.autoRenewDescription")}
                      </span>
                    </span>
                  </div>
                  {/* Payment iframe container */}
                  {!existingCustomer && (
                    <div
                      className="payment-container"
                      style={{ marginTop: "20px" }}
                    >
                      {/* Payment iframe */}
                      <div className="iframeParent">
                        {paymentUrl && (
                          <iframe
                            ref={iframeRef}
                            src={getPaymentPageUrl()}
                            className="iframe"
                            allow="payment"
                          />
                        )}
                      </div>

                      {/* Fallback for issues */}
                      {paymentUrl && paymentError && (
                        <div style={{ marginTop: "15px", textAlign: "center" }}>
                          <Button
                            onClick={() => window.open(paymentUrl, "_blank")}
                          >
                            Open Payment in New Window
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Dialog open={isVisible}>
                  <DialogSurface className="auto-renew-popup">
                    <DialogBody className="payment-card-dialog">
                      <div className="payment-card">
                        <Card className="login-card-container">
                          <div className="login-card-close">
                            <Image
                              className="cross-img"
                              src={cross}
                              width={32}
                              height={32}
                              alt="close"
                              onClick={() => {
                                closeCard();
                                setChecked(true);
                                onRecurringToggle?.(true);
                                setFieldValue("isRecurring", true);
                              }}
                            />
                          </div>
                          <div className="login-card-content">
                            <p className="title">
                              {t("paymentInformation.title")}
                            </p>
                            <span className="description">
                              <span className="header">
                                {t("paymentInformation.header")}
                              </span>
                              <span>{t("paymentInformation.description")}</span>
                            </span>
                            <div className="btns">
                              <Button
                                type="submit"
                                className="myplan-btn"
                                onClick={() => {
                                  setIsVisible(false);
                                  setChecked(true);
                                  onRecurringToggle?.(true);
                                  setFieldValue("isRecurring", true);
                                }}
                              >
                                {t("paymentInformation.autoRenewButton")}
                              </Button>
                              <Button
                                type="submit"
                                className="confirm-btn"
                                onClick={() => {
                                  setIsVisible(false);
                                  setChecked(false);
                                  onRecurringToggle?.(false);
                                  setFieldValue("isRecurring", false);
                                }}
                              >
                                {t("paymentInformation.confirmationButton")}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </DialogBody>
                  </DialogSurface>
                </Dialog>
              </div>
              {/* OSP-209 :Preserve form data in case if user get back to previous step before form submission. */}
              <PreserveForm />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default PaymentInformation;
