"use client";
import React, { useRef, useState, useEffect, FC } from "react";
import Image from "next/image";
import message from "../../../../../public/assets/svg/message.svg";
import { Formik, Field, Form } from "formik";
import { callMeBackSchema } from "@/utils/FormSchema";
import Input from "@/CommonComponent/InputText";
import PhoneNumberInput from "@/CommonComponent/PhoneNumberInput";
import { Button } from "reactstrap";
import CustomerType from "@/Components/CustomerType/CustomerType";
import { useTranslation } from "react-i18next";
import { apiTrigger } from "@/ApiQuery/apiTrigger";
import { API_ROUTES } from "@/Constant";
import spinloader from "../../../../../public/assets/svg/spinloader.gif";
import { useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import { SessionData } from "@/Types/Session.type";

const UserDetails = () => {
  const { t } = useTranslation("common");
  const sharedData = useSelector((state: any) => state?.sharedData?.data);
  const [customerType, setCustomerType] = useState<boolean>(true);
  const [spinnerLoading, setSpinnerLoading] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const toast = useRef<Toast>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [storedProducts, setStoredProducts] = useState<string>("");

  const initialValues = {
    firstName: "",
    lastName: "",
    contactNumber: "",
    contactEmail: "",
  };

  // Load products from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("productCodes");

    if (savedProducts) {
      setStoredProducts(savedProducts);
    }
  }, []);
  // Applied this condition for selection card for number header
  const handleCustomerCard = (
    data: string | null,
    cardindex: number | null | undefined
  ) => {
    if (cardindex === 0) {
      setCustomerType(false);
    } else if (cardindex === 1) {
      setCustomerType(true);
    }
  };

  const fetchSessionData = async () => {
    try {
      const response = await fetch("/api/session");
      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
        let updatedPackageName = [data?.packageCode];
        // if will be called in case of bundle
        if (data?.packageCode && data?.packageCode.includes(",")) {
          updatedPackageName = data?.packageCode.split(",");
        }
        if (updatedPackageName) {
        }
      }
    } catch (error) {}
  };

  // Function to extract product codes from cart items
  const getProductCodes = () => {
    const cartItems = sharedData?.shoppingCart?.productsInfo?.results || [];

    // Check if we have cart items
    if (cartItems.length > 0) {
      // Extract product codes from each item and join with commas
      const productCodes = cartItems
        .map((item: { productName: any }) => item.productName || "")
        .filter(Boolean)
        .join(",");

      // Store in localStorage
      localStorage.setItem("productCodes", productCodes);
      setStoredProducts(productCodes);
      return productCodes;
    }

    // If no products in cart, try to fetch from session
    return storedProducts || fetchSessionData;
  };

  return (
    <>
      <div className="call-me">
        <div className="callme-header">
          <h1>{t("userDetails.helpOffer")}</h1>
          <Image
            priority
            src={message}
            alt="login page"
            width={160}
            height={160}
            className="img"
          />
        </div>

        <div className="container">
          <p>{t("userDetails.callmeText")}</p>

          <Formik
            initialValues={initialValues}
            validationSchema={callMeBackSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              // Disable the button immediately when submitting
              setButtonDisabled(true);
              setSpinnerLoading(true);

              // Get dynamic product codes
              const productCodes = getProductCodes();

              const requestBody = {
                data: [
                  {
                    First_Name: values.firstName,
                    Last_Name: values.lastName,
                    Email: values.contactEmail,
                    Phone: values.contactNumber,
                    Current_Client: customerType,
                    Coverage: false,
                    Gender_Title: "",
                    Title: "",
                    Address: sharedData?.address,
                    Nacionalidad: "",
                    Prefix: "",
                    Post_Code: sharedData?.postCode,
                    Town: sharedData?.town,
                    Birthday: "",
                    ID_Type: "",
                    ID_Number: "",
                    products: productCodes,
                  },
                ],
              };

              try {
                if (toast.current) {
                  toast.current.clear();
                }

                const res = (await apiTrigger({
                  route: API_ROUTES.POST_BIGIN,
                  useApiGuestClient: false,
                  requestBody,
                  isPublicRoute: false,
                })) as any;

                if (res) {
                  if (toast.current) {
                    const code = res.data[0]?.code?.toLowerCase();
                    if (code === "success") {
                      toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: t("userDetails.successfully"),
                        sticky: true,
                      });
                      resetForm();
                    } else {
                      toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: t("GENERAL.apiFallbackError"),
                        sticky: true,
                      });
                      // Re-enable button on error
                      setButtonDisabled(false);
                    }
                  }
                }
              } catch (error: any) {
                const errorMessage = error?.split("] ")[1] || "";
                if (toast.current) {
                  toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: errorMessage || t("GENERAL.apiFallbackError"),
                    life: 5000,
                  });
                }
                // Re-enable button on error
                setButtonDisabled(false);
              } finally {
                setSpinnerLoading(false);
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, values }) => (
              <Form>
                <div className="row">
                  <div className="col-12">
                    <Field
                      name="firstName"
                      label={t("userDetails.firstName")}
                      value={values.firstName}
                      errorFieldName="firstName"
                      placeholder="Rose"
                      component={Input}
                    />
                  </div>
                  <div className="col-12">
                    <Field
                      name="lastName"
                      label={t("userDetails.lastName")}
                      value={values.lastName}
                      errorFieldName="lastName"
                      placeholder="McDonald"
                      component={Input}
                    />
                  </div>
                  <div className="info-cards my-3">
                    <label>{t("userDetails.existingCustomer")}</label>
                    <CustomerType
                      defaultCardIndex={null}
                      userDetailRender={true}
                      customerCardSelect={handleCustomerCard}
                    />
                  </div>
                  <div className="col-12">
                    {" "}
                    <Field
                      name="contactNumber"
                      component={PhoneNumberInput}
                      label={
                        customerType
                          ? t("userDetails.contactNumber")
                          : t("userDetails.customerNumberField")
                      }
                      placeholder="612345678"
                      value={values.contactNumber}
                      errorFieldName="contactNumber"
                    />
                  </div>
                  <div className="col-12">
                    {" "}
                    <Field
                      name="contactEmail"
                      label={t("userDetails.emailField")}
                      placeholder="name@gmail.com"
                      value={values.contactEmail}
                      errorFieldName="contactEmail"
                      component={Input}
                    />
                  </div>
                  <div className="col-12 send-button">
                    <Button
                      type="submit"
                      variant="contained"
                      className="send-btn"
                      disabled={isSubmitting || buttonDisabled}
                    >
                      {t("userDetails.submit")}
                    </Button>
                  </div>
                  {/* added toaster  */}
                  <div className="col-12 justify-content-center d-flex mb-5">
                    <div className="toast-container">
                      <Toast ref={toast} />
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      {/* added loader  */}
      {spinnerLoading && (
        <div className="spinner-container">
          <Image src={spinloader} alt="Loading..." />
        </div>
      )}
    </>
  );
};

export default UserDetails;
