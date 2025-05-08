import React, { FC, useEffect, useRef, useState } from "react";
import "react-phone-number-input/style.css";
import DropdownMenu from "../InputDropdown";
import Input from "../InputText";
import { Button } from "primereact/button";
import { useTranslation } from "next-i18next";
import { AboutYouProps } from "@/Types/CommonComponent.type";
import PhoneNumberInput from "../PhoneNumberInput";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import RadioOption from "../RadioButton/RadioButton";
import { aboutYouValidation } from "../../utils/FormSchema";
import Checkbox from "../Checkbox/Checkbox";
import FocusError from "../FocusError";
import { apiTrigger } from "@/ApiQuery/apiTrigger";
import { API_ROUTES } from "@/Constant";
import { Toast } from "primereact/toast";
import PreserveForm from "../PreserveForm";
import { useSelector } from "react-redux";
import { set } from "react-hook-form";
import Image from "next/image";
import arrowicon from "../../../public/assets/images/arrowicon.png";
interface NationalityOption {
  name: string;
  code: string;
}

const AboutYou: FC<AboutYouProps> = ({
  handleNext,
  handleAboutData,
  existingCustomer,
  setSpinnerLoading,
}) => {
  const { t } = useTranslation("common");
  const toast = useRef<Toast>(null);
  const [nationality, setNationality] = useState<NationalityOption[]>([]);
  const sharedData = useSelector((state: any) => state?.sharedData?.data);

  const idTypes = [
    { name: "NIE", code: "NIE" },
    { name: "Passport", code: "Passport" },
    { name: "European ID Card (for EU)", code: "EU" },
    { name: "DNI (ID Card)", code: "DNI" },
    { name: "NIF", code: "NIF" },
  ];

  const genderOptions = [
    { value: "MR", label: t("ABOUTUS.mr") },
    { value: "MS", label: t("ABOUTUS.ms") },
  ];
  // Generate day options
  const days = Array.from({ length: 31 }, (_, i) => ({
    name: (i + 1).toString(),
    code: (i + 1).toString(),
  }));

  // Generate month options
  const months = Array.from({ length: 12 }, (_, i) => ({
    name: new Date(0, i).toLocaleString("default", { month: "long" }),
    code: (i + 1).toString(),
  }));

  // Generate year options for years before 18 years ago
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 18; // This will be 2007 (2025 - 18)
  const numberOfYears = 100; // Adjust this number as needed
  // Generate years before the startYear
  const years = Array.from({ length: numberOfYears }, (_, i) => ({
    name: (startYear - i).toString(),
    code: (startYear - i).toString(),
  }));

  const handleSubmit = async (values: any) => {
    try {
      setSpinnerLoading(true);
      const res = await apiTrigger({
        route: API_ROUTES.POST_CHECK_EMAIL,
        useApiGuestClient: false,
        requestBody: {
          email: values.email,
        },
        isPublicRoute: false,
      });

      // Check if email exists in response
      if (res === true && !existingCustomer) {
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: t("ABOUTUS.alreadyExist"),
            life: 5000,
          });
          return setSpinnerLoading(false);
        }
      }
      // Only proceed if email doesn't exist
      if (handleAboutData) {
        const addressData = {
          firstName: values.firstName,
          name: `${values.firstName}  ${values.lastName}`,
          email: values.email,
          idNumber: values.idNumber,
          idType: values.idType,
        };
        handleAboutData(addressData);
      }

      if (values && handleNext) {
        handleNext(values);
        setSpinnerLoading(false);
      }
    } catch (error: any) {
      const errorMessage = error?.split("] ")[1] || "";
      // Handle API errors
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errorMessage || t("ABOUTUS.apiError"),
          life: 5000,
        });
      }
      setSpinnerLoading(false);
    }
  };

  const savedFormData = useSelector((state: any) => state?.sharedData?.data);
  const initialValues = existingCustomer
    ? {
        gender: sharedData?.existingCustomerData?.customer?.title || "",
        firstName: sharedData?.existingCustomerData?.customer?.firstName || "",
        lastName: sharedData?.existingCustomerData?.customer?.lastName || "",
        ...{
          day: "",
          month: "",
          year: "",
        },
        idType: sharedData?.existingCustomerData?.accounts?.accountIdType || "",
        idNumber:
          sharedData?.existingCustomerData?.accounts?.accountIdNumber || "",
        nationality:
          sharedData?.existingCustomerData?.accounts?.accountIdNationality ||
          "",
        email: sharedData?.existingCustomerData?.accounts?.email || "",
        ...{ confirmEmail: "" },
        contactNumber:
          sharedData?.existingCustomerData?.accounts?.contactNumber || "",
        confirmTerms: sharedData?.confirmTerms || false,
        confirmCheck: sharedData?.confirmCheck || false,
      }
    : {
        gender: savedFormData?.gender || "",
        firstName: savedFormData?.firstName || "",
        lastName: savedFormData?.lastName || "",
        day: savedFormData?.day || "",
        month: savedFormData?.month || "",
        year: savedFormData?.year || "",
        idType: savedFormData?.idType || "",
        idNumber: savedFormData?.idNumber || "",
        nationality: savedFormData?.nationality || "",
        email: savedFormData?.email || "",
        confirmEmail: savedFormData?.confirmEmail || "",
        contactNumber: savedFormData?.contactNumber || "",
        confirmTerms: savedFormData?.confirmTerms || false,
        confirmCheck: savedFormData?.confirmCheck || false,
      };

  useEffect(() => {
    const handleNationalities = async () => {
      try {
        const res = await apiTrigger({
          route: API_ROUTES.GET_NATIONALITY,
          useApiGuestClient: false,
          isPublicRoute: false,
        });

        if (res && Array.isArray(res)) {
          // Transform API response into required format
          const formattedNationalities = res.map((item) => ({
            name: item.description,
            code: item.description,
          }));

          setNationality(formattedNationalities);
        }
      } catch (error) {}
    };
    handleNationalities();
  }, []);

  return (
    <div className="personalDataContainer">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={aboutYouValidation(existingCustomer || false)}
        enableReinitialize={existingCustomer} // This will update form when initialValues change
      >
        {({ setFieldValue, values, resetForm }) => {
          return (
            <div className="sub-container">
              <Form>
                <div className="checkContainer">
                  <Field
                    name="gender"
                    options={genderOptions}
                    value={values.gender}
                    component={RadioOption}
                    errorFieldName="gender"
                    disabled={existingCustomer}
                  />
                </div>
                <div className="inputContainer">
                  <div className="inputDataContainer row">
                    <div className="col-md-6 col-12">
                      <Field
                        name="firstName"
                        label={t("ABOUTUS.firstName")}
                        placeholder={t("ABOUTUS.rose")}
                        component={Input}
                        value={values.firstName}
                        errorFieldName="firstName"
                        disabled={existingCustomer}
                      />
                    </div>
                    <div className="col-md-6 col-12 mt-3 mt-md-0">
                      <Field
                        name="lastName"
                        label={t("ABOUTUS.lastName")}
                        placeholder={t("ABOUTUS.mcDonnell")}
                        component={Input}
                        value={values.lastName}
                        errorFieldName="lastName"
                        disabled={existingCustomer}
                      />
                    </div>
                  </div>
                  {/* In case of existing customer date of birth is not returned from crm hence control is not shown */}
                  {existingCustomer !== true && (
                    <div className="dateContainer">
                      <label className="dateLabel">
                        {t("ABOUTUS.dateOfBirth")}
                      </label>
                      <div className="row dropDownContainer gy-sm-0 gy-3">
                        <div className="col-sm-6 col-lg-4 col-md-4">
                          <Field
                            name="day"
                            label={false}
                            placeholder={t("ABOUTUS.day")}
                            options={days}
                            component={DropdownMenu}
                            errorFieldName="day"
                            disabled={existingCustomer}
                          />
                        </div>
                        <div className="col-sm-6 col-lg-4 col-md-4">
                          <Field
                            name="month"
                            placeholder={t("ABOUTUS.month")}
                            options={months}
                            component={DropdownMenu}
                            errorFieldName="month"
                            disabled={existingCustomer}
                          />
                        </div>
                        <div className="col-sm-6 col-lg-4 col-md-4">
                          <Field
                            name="year"
                            placeholder={t("ABOUTUS.year")}
                            options={years}
                            component={DropdownMenu}
                            errorFieldName="year"
                            disabled={existingCustomer}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="IdentityContainer">
                    <label className="idDateLabel">
                      {t("ABOUTUS.identity")}
                    </label>
                    <div className="idDropDown row gy-sm-0 gy-3">
                      <div className="col-md-6 col-12">
                        <Field
                          name="idType"
                          label={t("ABOUTUS.idType")}
                          placeholder={t("ABOUTUS.select")}
                          options={idTypes}
                          component={DropdownMenu}
                          errorFieldName="idType"
                          disabled={existingCustomer}
                        />
                      </div>
                      <div className="col-md-6 col-12">
                        <Field
                          name="idNumber"
                          label={t("ABOUTUS.idNumber")}
                          placeholder={t("ABOUTUS.idPlaceholder")}
                          component={Input}
                          value={values.idNumber}
                          errorFieldName="idNumber"
                          disabled={existingCustomer}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="inputDataContainer">
                    <Field
                      name="nationality"
                      label={t("ABOUTUS.nationality")}
                      placeholder={t("ABOUTUS.select")}
                      options={nationality}
                      component={DropdownMenu}
                      errorFieldName="nationality"
                      disabled={existingCustomer}
                    />
                  </div>
                  <div className="IdentityContainer">
                    <label className="idDateLabel">
                      {t("ABOUTUS.contactData")}
                    </label>
                    <div className="contactDetail">
                      <Field
                        name="email"
                        label={t("ABOUTUS.email")}
                        placeholder={t("ABOUTUS.emailPlaceholder")}
                        component={Input}
                        value={values.email}
                        errorFieldName="email"
                        disabled={existingCustomer}
                      />
                    </div>
                    {existingCustomer !== true && (
                      <div className="contactDetail">
                        <Field
                          name="confirmEmail"
                          label={t("ABOUTUS.confirmEmail")}
                          placeholder={t("ABOUTUS.emailPlaceholder")}
                          component={Input}
                          value={values.confirmEmail}
                          errorFieldName="confirmEmail"
                          disabled={existingCustomer}
                        />
                      </div>
                    )}
                    <div className="contactDetail">
                      <Field
                        name="contactNumber"
                        component={PhoneNumberInput}
                        label={t("ABOUTUS.contactNumber")}
                        placeholder={t("ABOUTUS.contactPlaceholder")}
                        value={values.contactNumber}
                        errorFieldName="contactNumber"
                        disabled={existingCustomer}
                      />
                     
                    </div>
                    <div className="checkBox-container">
                      <div className="checkBox">
                        <Field
                          name="confirmTerms"
                          errorFieldName="confirmTerms"
                        >
                          {({ field }: FieldProps) => (
                            <Checkbox
                              {...field}
                              checked={field.value}
                              onChange={(e) =>
                                setFieldValue("confirmTerms", e?.checked)
                              }
                            />
                          )}
                        </Field>
                        <label className="checkBoxLabel">
                          {t("ABOUTUS.iAcceptLobster")}
                          <a
                            href="https://www.lobster.es/legal-stuff/privacy-policy/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {" "}
                            {t("ABOUTUS.privacyPolicy")}
                          </a>{" "}
                          {t("ABOUTUS.and")}
                          {sharedData?.shoppingCart?.cartType === "fibre" && (
                            <a
                              href="https://www.lobster.es/legal-stuff/terms-and-conditions-for-fibre/"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("ABOUTUS.termsConditions")}
                            </a>
                          )}
                          {sharedData?.shoppingCart?.cartType === "mobile" && (
                            <a
                              href="https://www.lobster.es/legal-stuff/general-terms-and-conditions-for-mobile-services/"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("ABOUTUS.termsConditions")}
                            </a>
                          )}
                          {sharedData?.shoppingCart?.cartType === "bundle" && (
                            <>
                              <a
                                href="https://www.lobster.es/legal-stuff/general-terms-and-conditions-for-mobile-services/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {t("ABOUTUS.termsConditions_mobile")}
                              </a>
                              {t("ABOUTUS.and")}
                              <a
                                href="https://www.lobster.es/legal-stuff/terms-and-conditions-for-fibre/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {t("ABOUTUS.termsConditions_fibre")}
                              </a>
                            </>
                          )}
                        </label>
                      </div>
                      <ErrorMessage
                        name="confirmTerms"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="checkBox-container">
                      <div className="checkBox">
                        <Field name="confirmCheck">
                          {({ field }: FieldProps) => (
                            <Checkbox
                              {...field}
                              checked={field?.value}
                              onChange={(e) =>
                                setFieldValue("confirmCheck", e?.checked)
                              }
                            />
                          )}
                        </Field>
                        <label className="checkBoxLabel">
                          {t("ABOUTUS.confirmMessage")}
                        </label>
                      </div>
                      <ErrorMessage
                        name="confirmCheck"
                        component="div"
                        className="error"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="toast-container">
                      <Toast ref={toast} />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="next-button">
                  {t("ABOUTUS.next")}
                </Button>
                {/* OSP-183 :Automatically scrolls and focuses to the first form field withan error upon form submission. */}
                <FocusError />
                {/* OSP-209 :Preserve form data in case if user get back to previous step before form submission. */}
                <PreserveForm />
              </Form>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};
export default AboutYou;
