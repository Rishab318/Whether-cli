import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { useTranslation } from "next-i18next";
import Input from "../InputText";
import { addressFormValidation } from "../../utils/FormSchema";
import { DeliveryAddressProps } from "@/Types/CommonComponent.type";
import { Formik, Form, Field, FieldProps } from "formik";
import { useEffect, useRef, useState } from "react";
import FocusError from "../FocusError";
import { Toast } from "primereact/toast";
import PreserveForm from "../PreserveForm";
import { useSelector } from "react-redux";
import { apiTrigger } from "@/ApiQuery/apiTrigger";
import { API_ROUTES, defaultCountryName } from "@/Constant";

interface AddressFormValues {
  // Delivery Address
  country?: string;
  postalCode?: string;
  town?: string;
  addressline1?: string;
  addressline2?: string;

  // Toggle for same as delivery
  addressSwitch?: boolean;

  // Billing Address
  billingCountry?: string;
  billingPostalCode?: string;
  billingTown?: string;
  billingAddressline1?: string;
  billingAddressline2?: string;
}

const DeliveryAddress: React.FC<DeliveryAddressProps> = ({
  handleDelivery,
  handleNext,
  handleDataSubmit,
  singleAddressForm,
  showNextButton,
  billingAddressNext,
  visible,
  selectedCardIndex,
  existingCustomer,
  buyNowEnable,
}) => {
  const { t } = useTranslation("common");
  const toast = useRef<Toast>(null);
  const [show, setShow] = useState<boolean>(false);
  const [showBillingForm, setShowBillingForm] = useState<boolean>(false);
  const sharedData = useSelector((state: any) => state?.sharedData?.data);
  const initialValues: AddressFormValues = existingCustomer
    ? {
        // Delivery Address
        country:
          sharedData?.existingCustomerData?.accounts?.geographicAddress?.[0]
            .addressCountry || defaultCountryName,
        postalCode:
          sharedData?.existingCustomerData?.accounts?.geographicAddress?.[0]
            .addressPostcode || "",
        town:
          sharedData?.existingCustomerData?.accounts?.geographicAddress?.[0]
            .addressAreaName || "",
        addressline1:
          `${sharedData?.existingCustomerData?.accounts?.geographicAddress?.[0].addressName} , ${sharedData?.existingCustomerData?.accounts?.geographicAddress?.[0].addressStreetName}  ${sharedData?.existingCustomerData?.accounts?.geographicAddress?.[0].addressStreetNumber}` ||
          "",
        addressline2:
          sharedData?.existingCustomerData?.accounts?.geographicAddress?.[0]
            .addressLocality || "",

        // Toggle default to true (same as delivery)
        addressSwitch: true,

        // Billing Address (initially empty)
        ...(singleAddressForm && {
          billingCountry:
            sharedData?.existingCustomerData?.accounts?.geographicAddress?.[0]
              .country || defaultCountryName,
          billingPostalCode:
            sharedData?.existingCustomerData?.accounts?.geographicAddress?.[0]
              .postcode || "",
          billingTown:
            sharedData?.existingCustomerData?.accounts?.geographicAddress?.[0]
              .city || "",
          billingAddressline1:
            sharedData?.existingCustomerData?.accounts?.geographicAddress?.[0]
              .streetName || "",
          billingAddressline2:
            sharedData?.existingCustomerData?.accounts?.geographicAddress?.[0]
              .locality || "",
        }),
      }
    : {
        // Delivery Address
        ...(selectedCardIndex !== 0 && {
          country: sharedData?.country || defaultCountryName,
          postalCode: sharedData?.postalCode || "",
          town: sharedData?.town || "",
          addressline1: sharedData?.addressline1 || "",
          addressline2: sharedData?.addressline2 || "",
        }),

        // Toggle default to true (same as delivery)
        ...(singleAddressForm && {
          addressSwitch: sharedData?.addressSwitch || true,
        }),

        // Billing Address (initially empty)
        ...(sharedData?.addressSwitch
          ? {
              billingCountry: sharedData?.country || defaultCountryName,
              billingPostalCode: sharedData?.postalCode || "",
              billingTown: sharedData?.town || "",
              billingAddressline1: sharedData?.addressline1 || "",
              billingAddressline2: sharedData?.addressline2 || "",
            }
          : singleAddressForm && {
              billingCountry: sharedData?.billingCountry || defaultCountryName,
              billingPostalCode: sharedData?.billingPostalCode || "",
              billingTown: sharedData?.billingTown || "",
              billingAddressline1: sharedData?.billingAddressline1 || "",
              billingAddressline2: sharedData?.billingAddressline2 || "",
            }),
      };

  const handleSubmit = (values: AddressFormValues) => {
    const deliveryAddress = `${values.addressline1} ${values.addressline2}, ${values.postalCode}, ${values.town}`;
    const billingAddress = values.addressSwitch
      ? deliveryAddress
      : `${values.billingAddressline1} ${values.billingAddressline2}, ${values.postalCode}, ${values.town}`;

    // Handle delivery address
    handleDelivery?.(values.addressline1 ? deliveryAddress?.trim() : "");
    billingAddressNext?.(values);
    handleDataSubmit?.(values);
    // Handle form submission based on conditions
    if (values && billingAddressNext && showNextButton) {
      billingAddressNext(values);
    } else if (handleNext) {
      handleNext({
        ...values,
        billingAddress: billingAddress,
      });
    }
  };

  useEffect(() => {
    if (
      showNextButton &&
      selectedCardIndex !== undefined &&
      selectedCardIndex === 1
    ) {
      setShow(true);
    } else if (visible) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [selectedCardIndex, showNextButton, visible]);
  const handlePostalCode = async (
    postCode: string,
    setFieldValue: (field: string, name: string) => void
  ) => {
    setFieldValue("town", "");
    try {
      if (postCode && postCode.length === 5) {
        // Only trigger when postal code is valid length

        const res = (await apiTrigger({
          route: API_ROUTES.GET_POSTAL_CODE,
          useApiGuestClient: false,
          queryParams: {
            postal_code: postCode,
          },
          isPublicRoute: false,
        })) as any;
        if (res) {
          setFieldValue("town", res[0].muncipality_name);
        }
      }
    } catch (error: any) {
      const errorMessage = error?.split("] ")[1] || "";
      // Clear town field on error
      setFieldValue("town", "");

      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errorMessage || "",
          life: 5000,
        });
      }
    }
  };
  const handleBillingPostalCode = async (
    postCode: string,
    setFieldValue: (field: string, name: string) => void
  ) => {
    setFieldValue("billingTown", "");
    try {
      if (postCode && postCode.length === 5) {
        // Only trigger when postal code is valid length
        const res = (await apiTrigger({
          route: API_ROUTES.GET_POSTAL_CODE,
          useApiGuestClient: false,
          queryParams: {
            postal_code: postCode,
          },
          isPublicRoute: false,
        })) as any;
        if (res) {
          setFieldValue("billingTown", res[0].muncipality_name);
        }
      }
    } catch (error: any) {
      const errorMessage = error?.split("] ")[1] || "";
      // Clear billingTown field on error
      setFieldValue("billingTown", "");

      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errorMessage || "",
          life: 5000,
        });
      }
    }
  };
  return (
    <div className="addressContainer">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={addressFormValidation(
          singleAddressForm,
          selectedCardIndex,
          sharedData?.addressSwitch,
          existingCustomer
        )} // Parameters to handle validation for same address as delivery and installation or different address
        enableReinitialize={existingCustomer} // This will update form when initialValues change
      >
        {({ setFieldValue, values }) => (
          <div className="sub-container">
            <Form>
              {show && (
                <>
                  {/* Delivery Address Form */}
                  <div className="inputContainer">
                    <div className="country col-12">
                      <Field
                        name="country"
                        label={t("DELIVERYADDRESS.country")}
                        placeholder={t("DELIVERYADDRESS.countryPlaceholder")}
                        component={Input}
                        value={values.country}
                        errorFieldName="country"
                        disabled={true}
                      />
                    </div>
                    <div className="cityContainer mb-4 row">
                      <div className="col-6 ">
                        <Field
                          name="postalCode"
                          label={t("DELIVERYADDRESS.postCode")}
                          placeholder={t(
                            "DELIVERYADDRESS.postalCodePlaceholder"
                          )}
                          component={Input}
                          value={values.postalCode}
                          type="text"
                          maxLength={5}
                          errorFieldName="postalCode"
                          disabled={existingCustomer}
                          onChange={(e: any) => {
                            // Handle both direct value and event object cases
                            const inputValue =
                              typeof e === "string"
                                ? e
                                : e?.target?.value || "";

                            // Only allow numeric characters
                            const numericValue = inputValue.replace(
                              /[^0-9]/g,
                              ""
                            );

                            // Limit to 5 digits
                            const limitedValue = numericValue.slice(0, 5);
                            setFieldValue("postalCode", limitedValue);
                            handlePostalCode(limitedValue, setFieldValue);
                          }}
                        />
                      </div>
                      <div className="col-6 townCity">
                        <Field
                          name="town"
                          label={t("DELIVERYADDRESS.town")}
                          placeholder={t("DELIVERYADDRESS.townPlaceholder")}
                          component={Input}
                          value={values.town}
                          errorFieldName="town"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="country">
                      <Field
                        name="addressline1"
                        label={t("DELIVERYADDRESS.addressLine1")}
                        placeholder={t(
                          "DELIVERYADDRESS.addressLine1Placeholder"
                        )}
                        component={Input}
                        value={values.addressline1}
                        errorFieldName="addressline1"
                        disabled={existingCustomer}
                      />
                    </div>
                    <div className="country addressline2">
                      <Field
                        name="addressline2"
                        label={t("DELIVERYADDRESS.addressLine2")}
                        placeholder={t(
                          "DELIVERYADDRESS.addressLine2Placeholder"
                        )}
                        component={Input}
                        value={values.addressline2}
                        errorFieldName="addressline2"
                        disabled={existingCustomer}
                      />
                    </div>

                    {/* Toggle Switch for Billing Address */}
                    {singleAddressForm && (
                      <div className="col-12 switchContainer">
                        <Field
                          name="addressSwitch"
                          value={values.addressSwitch}
                        >
                          {({ field }: FieldProps) => (
                            <InputSwitch
                              {...field}
                              checked={field.value}
                              onChange={(e) => {
                                setFieldValue("addressSwitch", e.value);
                                setShowBillingForm(!e.value);
                              }}
                            />
                          )}
                        </Field>
                        <span className="switchLabel">
                          {existingCustomer
                            ? t("DELIVERYADDRESS.confirmSameDeliveryAddress")
                            : t("DELIVERYADDRESS.confirmAddressMessage")}
                          {}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Billing Address Form */}
                  {!values.addressSwitch &&
                    showBillingForm &&
                    singleAddressForm && (
                      <div className="inputContainer mt-4">
                        {/* <h3 className="content-label mb-3">Billing address</h3> */}
                        <div className="country col-12">
                          <Field
                            name="billingCountry"
                            label={t("DELIVERYADDRESS.country")}
                            placeholder={t(
                              "DELIVERYADDRESS.countryPlaceholder"
                            )}
                            component={Input}
                            value={values.billingCountry}
                            errorFieldName="billingCountry"
                            disabled={true}
                          />
                        </div>
                        <div className="col-12 cityContainer row mb-4">
                          <div className="col-6 ">
                            <Field
                              name="billingPostalCode"
                              label={t("DELIVERYADDRESS.postCode")}
                              placeholder={t(
                                "DELIVERYADDRESS.postalCodePlaceholder"
                              )}
                              component={Input}
                              value={values.billingPostalCode}
                              errorFieldName="billingPostalCode"
                              onChange={(value: string) => {
                                setFieldValue("billingPostalCode", value);
                                handleBillingPostalCode(value, setFieldValue);
                              }}
                            />
                          </div>
                          <div className="col-6 townCity">
                            <Field
                              name="billingTown"
                              label={t("DELIVERYADDRESS.town")}
                              placeholder={t("DELIVERYADDRESS.townPlaceholder")}
                              component={Input}
                              value={values.billingTown}
                              errorFieldName="billingTown"
                            />
                          </div>
                        </div>
                        <div className="country">
                          <Field
                            name="billingAddressline1"
                            label={t("DELIVERYADDRESS.addressLine1")}
                            placeholder={t(
                              "DELIVERYADDRESS.addressLine1Placeholder"
                            )}
                            component={Input}
                            value={values.billingAddressline1}
                            errorFieldName="billingAddressline1"
                          />
                        </div>
                        <div className="country addressline2">
                          <Field
                            name="billingAddressline2"
                            label={t("DELIVERYADDRESS.addressLine2")}
                            placeholder={t(
                              "DELIVERYADDRESS.addressLine2Placeholder"
                            )}
                            component={Input}
                            value={values.billingAddressline2}
                            errorFieldName="billingAddressline2"
                          />
                        </div>
                      </div>
                    )}
                </>
              )}
              <div className="mt-3 mt-md-0">
                <div className="toast-container">
                  <Toast ref={toast} />
                </div>
              </div>
              <Button type="submit" className="next-button">
                {buyNowEnable
                  ? t("customerType.buyNow")
                  : t("customerType.next")}
              </Button>
              {/* OSP-183 :Automatically scrolls and focuses to the first form field withan error upon form submission. */}
              <FocusError />
              {/* OSP-209 :Preserve form data in case if user get back to previous step before form submission. */}
              <PreserveForm />
            </Form>
          </div>
        )}
      </Formik>
      <Toast></Toast>
    </div>
  );
};

export default DeliveryAddress;
