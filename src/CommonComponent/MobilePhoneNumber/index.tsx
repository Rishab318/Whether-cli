import React, { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { InputSwitch } from "primereact/inputswitch";
import Input from "../InputText";
import DropdownMenu from "../InputDropdown";
import { useTranslation } from "next-i18next";
import cardImage from "../../../public/assets/svg/cardImage.svg";
import { mobileNumberFormValidation } from "../../utils/FormSchema";
import Image from "next/image";
import { MobilePhoneNumberProps } from "@/Types/CommonComponent.type";
import CheckedIcon from "../../../public/assets/svg/checkbox.svg";
import { CircleRegular } from "@fluentui/react-icons";
import { Button } from "primereact/button";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import FocusError from "../FocusError";
import { API_ROUTES } from "@/Constant";
import { apiTrigger } from "@/ApiQuery/apiTrigger";
import PreserveForm from "../PreserveForm";
import { useSelector } from "react-redux";
import { Toast } from "primereact/toast";
interface NationalityOption {
  name: string;
  code: string;
}
const MobilePhoneNumber: React.FC<MobilePhoneNumberProps> = ({
  onCardSelect,
  onSimConfirm,
  onSelect,
  handleNext,
  onChange,
}) => {
  const { t } = useTranslation("common");
  const toast = useRef<Toast>(null);
  const savedFormData = useSelector((state: any) => state?.sharedData?.data);
  const [cardIndex, setCardIndex] = useState<number | null>(
    savedFormData?.selectedCard ?? null
  );
  const [nationality, setNationality] = useState<NationalityOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const cardDataArray = [
    {
      title: t("MOBILENUMBER.cardTitle1"),
      subTitle: t("MOBILENUMBER.cardSubTitle1"),
    },
    {
      title: t("MOBILENUMBER.cardTitle2"),
      subTitle: t("MOBILENUMBER.cardSubTitle2"),
    },
  ];

  const handleMobileNumber = async (
    mobileNumber: string | undefined,
    setFieldValue: (field: string, value: string) => void
  ) => {
    setFieldValue("mobileProvider", "");
    if (mobileNumber?.length === 9) {
      try {
        setIsLoading(true);
        setApiError(null);
        const data = (await apiTrigger({
          useApiGuestClient: false,
          route: API_ROUTES.POST_OPERATOR_NAME,
          isMockEnabled: false,
          isPublicRoute: false,
          requestBody: {
            msisdn: mobileNumber,
          },
        })) as any;

        if (data) {
          setFieldValue("mobileProvider", data?.OperatorName);
          setFieldValue("mobileProviderCode", data?.NodoOperatorCode);
        } else {
          setApiError("No operator found");
        }
        onChange && onChange(mobileNumber);
      } catch (error: any) {
        const errorMessage = error?.split("] ")[1] || "";
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: errorMessage || "",
            life: 5000,
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCardClick = (index: number, resetForm: (values: any) => void) => {
    const newIndex = cardIndex === index ? null : index;
    if (index === 0) {
      const defaultValues = {
        currentMobileNumber: "",
        mobileProvider: "",
        currentSIM: "",
        ICCIDNumber: "",
        ownerDetailSwitch: true,
      } as any;
      resetForm({
        values: defaultValues,
      });
      onChange?.("");
    }
    setCardIndex(newIndex);
    onCardSelect &&
      onCardSelect(newIndex !== null ? cardDataArray[newIndex].title : "");
    onSelect && onSelect(newIndex !== null ? newIndex : null);
  };
  const initialValues = {
    currentMobileNumber: savedFormData?.currentMobileNumber || "",
    mobileProvider: savedFormData?.mobileProvider || "",
    currentSIM: savedFormData?.currentSIM || "",
    ICCIDNumber: savedFormData?.ICCIDNumber || "",
    ownerDetailSwitch:
      savedFormData?.ownerDetailSwitch === false || undefined ? false : true,
    ...(savedFormData?.ownerDetailSwitch
      ? null
      : {
          portingFirstName: savedFormData?.portingFirstName || "",
          portingLastName: savedFormData?.portingLastName || "",
          portingIdType: savedFormData?.portingIdType || "",
          portingIdNumber: savedFormData?.portingIdNumber || "",
          portingNationality: savedFormData?.portingNationality || "",
        }),
  };

  const simSelect = [
    {
      name: t("MOBILENUMBER.simSelectName1"),
      code: t("MOBILENUMBER.simSelectName1"),
    },
    {
      name: t("MOBILENUMBER.simSelectName2"),
      code: t("MOBILENUMBER.simSelectName2"),
    },
  ];

  const idTypes = [
    { name: "NIE", code: "NIE" },
    { name: "Passport", code: "Passport" },
    { name: "European ID Card (for EU)", code: "EU" },
    { name: "DNI (ID Card)", code: "DNI" },
    { name: "NIF", code: "NIF" },
  ];

  const handleSubmit = (values: any) => {
    onSimConfirm && onSimConfirm(values?.currentSIM);
    if (values && handleNext && values.selectedCard !== null) {
      handleNext(values);
    }
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
    <div className="phoneNumberContainer">
      <Formik
        onSubmit={handleSubmit}
        validationSchema={
          cardIndex === 1
            ? mobileNumberFormValidation(initialValues)
            : undefined
        }
        initialValues={initialValues}
      >
        {({ setFieldValue, values, resetForm }) => {
          return (
            <Form>
              <p className="option">{t("customerType.selectOption")}:</p>
              <div className="cards row">
                {cardDataArray.map((item, index) => (
                  <div className="col-6" key={index}>
                    <div className="card-container position-relative">
                      <div className="icon-container position-absolute top-0 end-0 m-2">
                        {cardIndex === index ? (
                          <Image
                            src={CheckedIcon}
                            alt="Selected"
                            width={24}
                            height={24}
                          />
                        ) : (
                          <CircleRegular
                            fontSize={24}
                            className="circle-regular-icon"
                          />
                        )}
                      </div>
                      <Card
                        key={index}
                        title={item.title}
                        subTitle={item.subTitle}
                        className={`${
                          cardIndex == index ? "selected-card" : "p-card"
                        }`}
                        onClick={() => {
                          handleCardClick(index, resetForm);
                          setFieldValue("selectedCard", index);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {cardIndex === 1 && (
                <>
                  <div className="currentDetailContainer row">
                    <label className="col-12 subLabel">
                      {t("MOBILENUMBER.mobileProviderHeading")}
                    </label>
                    <div className="col-6">
                      <Field
                        name="currentMobileNumber"
                        label={t("MOBILENUMBER.currentMobileNumber")}
                        placeholder={t("MOBILENUMBER.currentMobilePlaceholder")}
                        component={Input}
                        value={values.currentMobileNumber}
                        onChange={(value: any) => {
                          handleMobileNumber(value, setFieldValue);
                        }}
                        maxLength={9}
                        errorFieldName="currentMobileNumber"
                      />
                    </div>
                    <div className="col-6 provider">
                      <Field
                        name="mobileProvider"
                        label={t("MOBILENUMBER.mobileProvider")}
                        placeholder={t(
                          "MOBILENUMBER.mobileProviderPlaceholder"
                        )}
                        component={Input}
                        value={values.mobileProvider}
                        errorFieldName="mobileProvider"
                        disabled
                      />
                    </div>
                    <div className="col-12">
                      <Field
                        name="currentSIM"
                        label={t("MOBILENUMBER.currentSIM")}
                        placeholder={t("MOBILENUMBER.select")}
                        component={DropdownMenu}
                        errorFieldName="currentSIM"
                        options={simSelect}
                      />
                    </div>
                  </div>
                  {values.currentSIM === t("MOBILENUMBER.simSelectName1") && (
                    <div className="col-12">
                      {values.currentSIM ===
                        t("MOBILENUMBER.simSelectName1") && (
                        <>
                          <Field
                            name="ICCIDNumber"
                            label={t("MOBILENUMBER.iccIdNumber")}
                            placeholder={t(
                              "MOBILENUMBER.iccIdNumberPlaceholder"
                            )}
                            component={Input}
                            value={values.ICCIDNumber}
                            errorFieldName="ICCIDNumber"
                          />
                          <div className="info-section">
                            <p className="iccid">
                              {t("MOBILENUMBER.iccIdInfo")}
                            </p>
                            <Image src={cardImage} alt={""}></Image>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  <div className="col-12 switchContainer">
                    <Field
                      name="ownerDetailSwitch"
                      value={values.ownerDetailSwitch}
                    >
                      {({ field }: FieldProps) => (
                        <InputSwitch
                          {...field}
                          onChange={(e) => {
                            setFieldValue("ownerDetailSwitch", e?.value);
                            if (e.value) {
                              setFieldValue("portingFirstName", "");
                              setFieldValue("portingLastName", "");
                              setFieldValue("portingIdType", "");
                              setFieldValue("portingIdNumber", "");
                              setFieldValue("portingNationality", "");
                            }
                          }}
                          checked={field.value}
                        />
                      )}
                    </Field>
                    <span className="switchLabel">
                      {t("MOBILENUMBER.switchLabel")}
                    </span>
                  </div>

                  {values.ownerDetailSwitch === false && (
                    <div className="ownerDetailscontainer">
                      <div className="row">
                        <div className="col-12">
                          <div className="ownerDetails row">
                            <label className="col-12 subLabel">
                              {t("MOBILENUMBER.ownerDetailsLabel")}
                            </label>
                            <p>{t("MOBILENUMBER.ownerDetailsSubLabel")}</p>
                          </div>
                        </div>
                        <div className="col-12">
                          <Field
                            name="portingFirstName"
                            label={t("MOBILENUMBER.firstName")}
                            placeholder={t("MOBILENUMBER.firstNamePlaceholder")}
                            component={Input}
                            value={values.portingFirstName}
                            errorFieldName="portingFirstName"
                          />
                        </div>
                        <div className="col-12">
                          <Field
                            name="portingLastName"
                            label={t("MOBILENUMBER.lastName")}
                            placeholder={t("MOBILENUMBER.lastNamePlaceholder")}
                            component={Input}
                            value={values.portingLastName}
                            errorFieldName="portingLastName"
                          />
                        </div>
                        <div className="col-6">
                          <Field
                            name="portingIdType"
                            label={t("MOBILENUMBER.idType")}
                            placeholder={t("MOBILENUMBER.select")}
                            component={DropdownMenu}
                            errorFieldName="portingIdType"
                            options={idTypes}
                          />
                        </div>
                        <div className="col-6">
                          <Field
                            name="portingIdNumber"
                            label={t("MOBILENUMBER.idNumber")}
                            placeholder={t("MOBILENUMBER.idNumberPlaceholder")}
                            component={Input}
                            value={values.portingIdNumber}
                            errorFieldName="portingIdNumber"
                          />
                        </div>
                        <div className="col-12">
                          <Field
                            name="portingNationality"
                            label={t("MOBILENUMBER.nationality")}
                            placeholder={t("MOBILENUMBER.select")}
                            component={DropdownMenu}
                            errorFieldName="portingNationality"
                            options={nationality}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div className="toast-container">
                <Toast ref={toast} />
              </div>
              <Button
                type="submit"
                className="next-button"
                disabled={cardIndex === null}
              >
                {t("ABOUTUS.next")}
              </Button>
              {/* OSP-183 :Automatically scrolls and focuses to the first form field withan error upon form submission. */}
              <FocusError />
              {/* OSP-209 :Preserve form data in case if user get back to previous step before form submission. */}
              <PreserveForm />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default MobilePhoneNumber;
