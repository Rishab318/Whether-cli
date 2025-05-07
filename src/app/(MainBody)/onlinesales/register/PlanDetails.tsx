"use client";
import AboutYou from "@/CommonComponent/AboutYou";
import DeliveryAddress from "@/CommonComponent/DeliveryAddress";
import MobilePhoneNumber from "@/CommonComponent/MobilePhoneNumber";
import YourOrder from "@/CommonComponent/YourOrder";
import CustomerType from "@/Components/CustomerType/CustomerType";
import { ApiResponse, PlanDetailsProps } from "@/Types/CommonComponent.type";
import { Box } from "@mui/material";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "reactstrap";
import { API_ROUTES, PLAN_TYPES, STORAGE_KEYS } from "@/Constant";
import "../../../../../public/assets/scss/pages/_plan-details.scss";
import PaymentInformation from "@/Components/PaymentInformation/PaymentInformation";
import { apiTrigger } from "@/ApiQuery/apiTrigger";
import DOMPurify from "dompurify";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import LoginCard from "@/CommonComponent/LoginCard";
import {
  updateExistingUserData,
  updateMobileCommunicationAddress,
  updateShoppingCart,
  updateUserInfo,
} from "@/Redux/Reducers/SharedData/SharedDataSlice";
import { useDispatch, useSelector } from "react-redux";
const PlanDetails: React.FC<PlanDetailsProps> = ({
  packageName,
  packagePrice,
  setSpinnerLoading,
}) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [customerTypeCard, setCustomerTypeCard] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [sublabel, setSublabel] = useState("");
  const [sublabel1, setSublabel1] = useState("");
  const [sublabel2, setSublabel2] = useState<any>();
  const [sublabel3, setSublabel3] = useState<any>();
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );
  const [isAutoRenew, setIsAutoRenew] = useState<boolean>(true);
  const toast = useRef<Toast>(null);
  const childRef = useRef<Toast>(null);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [mobileNumber, setMobileNumber] = useState("");
  // new states for api
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dispatch = useDispatch();
  const sharedData = useSelector((state: any) => state?.sharedData?.data);

  const handleNext = (data?: any, skipNextStep: boolean = false) => {
    setActiveStep((prevActiveStep) => {
      let nextStep = prevActiveStep;
      if (skipNextStep) {
        // Skip one step by adding 2
        nextStep = prevActiveStep + 2;
        scrollToSection(nextStep);
        return nextStep;
      }
      nextStep = prevActiveStep + 1;
      scrollToSection(nextStep);
      return nextStep;
    });
    setVisible(activeStep + (skipNextStep ? 2 : 1) < steps.length);
  };

  const scrollToSection = (nextStep: number) => {
    setTimeout(() => {
      const stepElement = stepRefs.current[nextStep];
      if (stepElement) {
        const yOffset = -80; // Top padding
        const y =
          stepElement.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 500); // Small delay to allow state update and above animate stop before 500ms
  };

  const handleCustomerRegistration = async (data: any) => {
    const cartItems = sharedData?.shoppingCart?.productsInfo?.results;
    const referralCode = sharedData?.shoppingCart?.referralCode;
    const iccid =
      sharedData?.currentSIM === "Yes, it’s ‘pay-as-you-go’"
        ? {
            portinPayAsYouGo: true,
            prepaidPort: true,
            iccid: sharedData?.ICCIDNumber || "",
          }
        : { portinPayAsYouGo: false, prepaidPort: false };
    const portingFormdata =
      sharedData?.selectedCard === 1
        ? {
            portingDetails: {
              portingFirstName: sharedData?.ownerDetailSwitch
                ? sharedData?.firstName || ""
                : sharedData?.portingFirstName || "",
              portingSurname: sharedData?.ownerDetailSwitch
                ? sharedData?.lastName || ""
                : sharedData?.portingLastName || "",
              numberPort: sharedData?.currentMobileNumber,
              donorOperator: sharedData?.mobileProvider,
              donorOperatorCode: sharedData?.mobileProviderCode,
              isPortingNumber: true,
              isPortingAutomation: true,
              ...iccid,
            },
          }
        : null;

    const installationAddress = {
      geographicAddress: {
        addressType: "installation",
        addressCountry: sharedData?.country?.split(" (")[0],
        addressStreetName: "",
        addressStreetNumber: "",
        addressName: sharedData?.addressline1,
        addressPostcode: sharedData?.postalCode,
        addressAreaName: sharedData?.town,
        addressLocality: sharedData?.addressline2,
      },
    };
    const Formdata = {
      title: sharedData?.gender || "",
      firstName: sharedData?.firstName || "",
      lastName: sharedData?.lastName || "",
      birthDate:
        `${sharedData?.year}-${sharedData?.month}-${sharedData?.day}` || "",
      idType: sharedData?.idType || "",
      idNumber: sharedData?.idNumber || "",
      nationality: sharedData?.nationality || "",
      email: sharedData?.email || "",
      confirmEmail: sharedData?.confirmEmail || "",
      phoneNumber: sharedData?.contactNumber || "",
      geographicAddress: [
        {
          addressType: "billing",
          addressCountry: sharedData?.addressSwitch
            ? sharedData?.country?.split(" (")[0]
            : data?.billingCountry?.split(" (")[0] ||
              sharedData?.billingCountry?.split(" (")[0] ||
              "",
          addressStreetName: "",
          addressStreetNumber: "",
          addressName: sharedData?.addressSwitch
            ? sharedData?.addressline1
            : data?.billingAddressline1 ||
              sharedData?.billingAddressline1 ||
              "",
          addressPostcode: sharedData?.addressSwitch
            ? sharedData?.postalCode
            : data?.billingPostalCode || sharedData?.billingPostalCode || "",
          addressAriaName: sharedData?.addressSwitch
            ? sharedData?.town
            : data?.billingTown || sharedData?.billingTown || "",
          addressLocality: sharedData?.addressSwitch
            ? sharedData?.addressline2
            : data?.billingAddressline2 ||
              sharedData?.billingAddressline2 ||
              "",
        },
        {
          addressType: "communication",
          addressCountry:
            data?.country?.split(" (")[0] ||
            sharedData?.country?.split(" (")[0] ||
            "",
          addressStreetName: "",
          addressStreetNumber: "",
          addressName: data?.addressline1 || sharedData?.addressline1 || "",
          addressPostcode: data?.postalCode || sharedData?.postalCode || "",
          addressAreaName: data?.town || sharedData?.town || "",
          addressLocality: data?.addressline2 || sharedData?.addressline2 || "",
        },
      ],
      shoppingCart: {
        type: "newSales",
        status: "open",
        cartItem: cartItems?.map((item: any, index: number) => ({
          ...installationAddress,
          ...(item?.planType === "Mobile" ? portingFormdata : null),
          ...(item?.planType === "Mobile"
            ? { referralCode: referralCode }
            : null),
          cartItemNumber: index + 1,
          type: item?.planType,
          action: "Add",
          quantity: 1,
          productOfferingName: item?.productName,
        })),
      },
    };

    dispatch(
      updateMobileCommunicationAddress({
        communicationAddress: {
          summary: `${data?.addressline1 || ""}, ${data?.addressline2 || ""} ${
            data?.postalCode || ""
          } ${data?.town || ""}`,
        },
      })
    );
    try {
      setSpinnerLoading(true);
      const data = (await apiTrigger({
        useApiGuestClient: false,
        route: API_ROUTES.POST_USER_REGISTRATION,
        isMockEnabled: false,
        requestBody: Formdata,
        isPublicRoute: false,
      })) as any;
      if (data && data["World Pay HOP URL"] && data["user_session_id"]) {
        // access accountNo from the hopup url
        const urlParts = data["World Pay HOP URL"].split("_");
        if (urlParts.length > 1) {
          dispatch(
            updateUserInfo({
              accountNo: urlParts[1],
            })
          );
        }

        const sanitizedUrl = sanitizeWorldPayUrl(data["World Pay HOP URL"]);
        setPaymentUrl(sanitizedUrl);
        setSessionId(data["user_session_id"]);
        localStorage.setItem("user_session_id", data["user_session_id"]);
        setVisible(false);
        setSpinnerLoading(false);
        handleNext();
      } else {
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: t("GENERAL.apiFallbackError"),
            life: 5000,
          });
        }
      }
    } catch (error: any) {
      const errorMessage = error?.split("] ")[1] || "";
      setSpinnerLoading(false);
      // osp-183: error toster ref to handle api error
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errorMessage || t("GENERAL.apiFallbackError"),
          life: 5000,
        });
      }
    }
  };
  const handleRecurringToggle = (value: boolean) => {
    setIsAutoRenew(value);
    localStorage.setItem("auto_renew_key", `${value}`);
  };

  const handleCompleteSale = async (isAutoRenew?: boolean) => {
    setSpinnerLoading(true);

    let reccurringKey = Boolean(isAutoRenew);
    if (localStorage.getItem("auto_renew_key") === "true") {
      reccurringKey = true;
    } else if (localStorage.getItem("auto_renew_key") === "false") {
      reccurringKey = false;
    }
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = localStorage.getItem("user_session_id") as string;
    }
    try {
      const data = (await apiTrigger({
        useApiGuestClient: false,
        route: API_ROUTES.POST_COMPLETE_SALE,
        isMockEnabled: false,
        customHeaders: { "user-session-id": currentSessionId },
        requestBody: {
          IS_MOBILE_RECURRING_ENABLED: reccurringKey,
        },
        isPublicRoute: false,
      })) as any;
      if (data) {
        dispatch(
          updateUserInfo({
            firstName: sharedData?.firstName,
            email: sharedData?.email,
            idType: sharedData?.idType,
            idNumber: sharedData?.idNumber,
          })
        );
        router.push("/pages/purchase_plan");
        setSpinnerLoading(false);
      }
    } catch (error: any) {
      const errorMessage = error?.split("] ")[1] || "";
      setSpinnerLoading(false);
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errorMessage || t("GENERAL.apiFallbackError"),
          life: 5000,
        });
      }
      setSpinnerLoading(false);
    } finally {
      setSpinnerLoading(false);
    }
  };
  // OSP-275 : For the existing customer flow this complete sale triggered
  const handleCompleteLoginSale = async (Id: string) => {
    setSpinnerLoading(true);
    const reccurringKey = new Boolean(isAutoRenew);
    const cartItems = sharedData?.shoppingCart?.productsInfo?.results;
    const referralCode = sharedData?.shoppingCart?.referralCode;
    const iccid =
      sharedData?.currentSIM === "Yes, it’s ‘pay-as-you-go’"
        ? {
            portinPayAsYouGo: true,
            prepaidPort: true,
            iccid: sharedData?.ICCIDNumber || "",
          }
        : { portinPayAsYouGo: false, prepaidPort: false };
    const portingFormdata =
      sharedData?.selectedCard === 1
        ? {
            portingDetails: {
              portingFirstName: sharedData?.ownerDetailSwitch
                ? sharedData?.firstName || ""
                : sharedData?.portingFirstName || "",
              portingSurname: sharedData?.ownerDetailSwitch
                ? sharedData?.lastName || ""
                : sharedData?.portingLastName || "",
              numberPort: sharedData?.currentMobileNumber,
              donorOperator: sharedData?.mobileProvider,
              donorOperatorCode: sharedData?.mobileProviderCode,
              isPortingNumber: true,
              isPortingAutomation: true,
              ...iccid,
            },
          }
        : null;
    // we get this addres from the login response as billing Address
    const loginBillingAddress =
      sharedData?.existingCustomerData?.accounts?.geographicAddress?.[0];

    const installationAddress = {
      geographicAddress: sharedData?.addressSwitch
        ? { ...loginBillingAddress, addressType: "installation" }
        : {
            addressType: "installation",
            addressCountry: sharedData?.billingCountry?.split(" (")[0] || "",
            addressStreetName: "",
            addressStreetNumber: "",
            addressName: sharedData?.billingAddressline1 || "",
            addressPostcode: sharedData?.billingPostalCode || "",
            addressAreaName: sharedData?.billingTown || "",
            addressLocality: sharedData?.billingAddressline2 || "",
          },
    };
    const requestBody = {
      IS_MOBILE_RECURRING_ENABLED: reccurringKey,
      accountId:
        sharedData?.existingCustomerData?.accounts?.accountExternalId || "",
      geographicAddress: [
        {
          ...loginBillingAddress,
          addressType: "communication",
        },
      ],
      shoppingCart: {
        type: "newSales",
        status: "open",
        cartItem: cartItems?.map((item: any, index: number) => ({
          ...installationAddress,
          ...(item?.planType === "Mobile" ? portingFormdata : null),
          ...(item?.planType === "Mobile"
            ? { referralCode: referralCode }
            : null),
          cartItemNumber: index + 1,
          type: item?.planType,
          action: "Add",
          quantity: 1,
          productOfferingName: item?.productName,
        })),
      },
    };
    try {
      const data = (await apiTrigger({
        useApiGuestClient: false,
        route: API_ROUTES.POST_COMPLETE_LOGIN_SALE,
        isMockEnabled: false,
        isPublicRoute: false,
        customHeaders: { "user-session-id": Id },
        requestBody: requestBody, // Added body data
      })) as any;
      if (data) {
        dispatch(
          updateUserInfo({
            firstName: sharedData?.firstName,
            email: sharedData?.email,
            idType: sharedData?.idType,
            idNumber: sharedData?.idNumber,
          })
        );
        router.push("/pages/purchase_plan");
        setSpinnerLoading(false);
      }
    } catch (error: any) {
      const errorMessage = error?.split("] ")[1] || "";
      setSpinnerLoading(false);
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errorMessage || t("GENERAL.apiFallbackError"),
          life: 5000,
        });
      }
      setSpinnerLoading(false);
    } finally {
      setSpinnerLoading(false);
    }
  };

  const handleChange = (index: React.SetStateAction<number>) => {
    setActiveStep(index);
  };

  const getSelectedPlanDetails = async (
    accountId: string,
    userSessionId: string
  ) => {
    let productList: string[] = [];
    if (sharedData?.shoppingCart?.productsInfo?.results?.length === 2) {
      const fibrePlan = sharedData?.shoppingCart?.productsInfo?.results?.find(
        (item: { planType: string }) =>
          item.planType?.toLowerCase() === PLAN_TYPES.FIBRE_TYPE
      );

      const otherPlans =
        sharedData?.shoppingCart?.productsInfo?.results?.filter(
          (item: { planType: string }) =>
            item.planType?.toLowerCase() !== PLAN_TYPES.FIBRE_TYPE
        );

      if (fibrePlan) {
        productList.push(fibrePlan.productName);
      }

      otherPlans?.forEach((item: { productName: string }) => {
        productList.push(item.productName);
      });
    } else if (sharedData?.shoppingCart?.productsInfo?.results?.length === 1) {
      productList.push(
        sharedData.shoppingCart.productsInfo.results[0].productName
      );
    }
    try {
      setSpinnerLoading(true);
      // Create the new request body format with productOfferingIds array
      const requestBody = {
        productOfferingIds: productList,
        accountId: accountId,
        user_session_id: userSessionId,
      };

      const response = (await apiTrigger({
        route: API_ROUTES.GET_PRODUCT_INFO,
        useApiGuestClient: false,
        requestBody: requestBody,
        isPublicRoute: false,
      })) as ApiResponse;

      // Process the new response format
      if (response && response.results && Array.isArray(response.results)) {
        dispatch(
          updateShoppingCart({
            productsInfo: response,
          })
        );
        setSpinnerLoading(false);
      }
      setSpinnerLoading(false);
    } catch (error) {
      setSpinnerLoading(false);
    }
  };

  // OSP-195 : Login popup handle function
  const handleCustomerCard = (
    data: string | null,
    cardindex: number | null | undefined
  ) => {
    setSublabel(data || "");
    setCustomerTypeCard(cardindex ? cardindex : null);
    if (cardindex) {
      setSelectedCardIndex(cardindex);
    }
    setIsLoginOpen(cardindex === 1 ? true : false);
  };
  const handleLoginClose = () => {
    setIsLoginOpen(false);
    setSelectedCardIndex(null);
  };
  // OSP-195 : Login User API handle function
  const handleLoginUser = async (values: any) => {
    if (childRef.current) {
      childRef.current.clear();
    }
    setSpinnerLoading(true);
    try {
      const res = (await apiTrigger({
        useApiGuestClient: false,
        route: API_ROUTES.LOGIN_USER,
        isMockEnabled: false,
        requestBody: {
          emailAddress: values.email,
          password: values.password,
        },
        isPublicRoute: false,
      })) as any;
      if (res) {
        const accountId = res?.accounts?.accountExternalId;
        const userSessionId = res?.userSessionId;
        handleNext(res);
        dispatch(updateExistingUserData({ existingCustomerData: res }));
        setSelectedCardIndex(null);
        setSessionId(res?.userSessionId);
        getSelectedPlanDetails(accountId, userSessionId);
        setSpinnerLoading(false);
      }
    } catch (error: any) {
      const errorMessage = error?.split("] ")[1] || "";
      setSpinnerLoading(false);
      if (childRef.current) {
        childRef.current.show({
          severity: "error",
          summary: "Error",
          detail: errorMessage || t("GENERAL.apiFallbackError"),
          life: 5000,
        });
      }
    }
  };

  const handlePhoneData = (data: string) => {
    setSublabel1(data);
  };

  const handleMobileNumber = (mobileNumber: string | undefined) => {
    setMobileNumber(mobileNumber ? mobileNumber : "");
  };

  const handleAboutData = (data: {
    name: string;
    email: string;
    idNumber: string;
  }) => {
    setSublabel2(data);
  };

  const handleDeliveryData = (data: string) => {
    setSublabel3(data);
  };

  const sanitizeWorldPayUrl = (url: string) => {
    // new iframe url for payment screen
    const extraParams =
      "&iframeHelperURL=https://care.lobster.es/selfcare/skin/html/helper.html";

    const fullUrl = url + extraParams;
    return DOMPurify.sanitize(fullUrl);
  };

  const steps = [
    {
      label: t("customerType.lobsterCustomer"),
      description: (
        <>
          <CustomerType
            customerCardSelect={handleCustomerCard}
            handleNext={handleNext}
            defaultCardIndex={selectedCardIndex}
          />
          <LoginCard
            open={isLoginOpen}
            onClose={handleLoginClose}
            handleSubmit={handleLoginUser}
            ref={childRef}
          />
        </>
      ),
      data: <span>{sublabel}</span>,
    },
    {
      label: t("MOBILENUMBER.mobileNumberText"),
      description: (
        <MobilePhoneNumber
          onCardSelect={handlePhoneData}
          onChange={handleMobileNumber}
          handleNext={handleNext}
        />
      ),
      data: (
        <span>
          {sublabel1} {mobileNumber}
        </span>
      ),
    },
    {
      label: t("ABOUTUS.aboutYouText"),
      description: (
        <AboutYou
          handleNext={handleNext}
          handleAboutData={handleAboutData}
          existingCustomer={customerTypeCard === 1 ? true : false}
          setSpinnerLoading={setSpinnerLoading}
        />
      ),
      data: (
        <div className="data-container">
          {sublabel2 ? (
            <>
              <span className="name-idnumber">
                {sublabel2.name} <span className="middle-dot"></span>{" "}
                {sublabel2.idNumber}
              </span>
              <span>{sublabel2.email}</span>
            </>
          ) : (
            <></>
          )}
        </div>
      ),
    },
    {
      label:
        customerTypeCard === 1
          ? t("billingAddress.billingAddressTitle")
          : t("DELIVERYADDRESS.deliveryAddressText"),
      description: (
        <DeliveryAddress
          handleDelivery={handleDeliveryData}
          billingAddressNext={(data) => {
            if (customerTypeCard === 1) {
              handleNext();
            } else {
              handleCustomerRegistration(data);
            }
          }}
          singleAddressForm={true}
          visible={true}
          existingCustomer={customerTypeCard === 1 ? true : false}
        />
      ),
      data: <span>{sublabel3}</span>,
    },
    {
      label: t("PAYMENTINFORMATION.paymentInfoText"),
      description: (
        <>
          <PaymentInformation
            paymentUrl={paymentUrl}
            onSuccess={(sessionId?: string) => {
              handleCompleteSale(isAutoRenew);
            }}
            onRecurringToggle={handleRecurringToggle}
            existingCustomer={customerTypeCard === 1 ? true : false} //to remove payment iFrame screen in case of Existing customer
          />
          {customerTypeCard === 1 && (
            <Button
              className="buy-btn"
              type="submit"
              variant="contained"
              onClick={() => {
                handleCompleteLoginSale(sessionId);
              }}
            >
              {t("customerType.buyNow")}
            </Button>
          )}
        </>
      ),
      data: <></>,
    },
  ];

  return (
    <>
      <div className="planDetailContainer">
        <div className="row justify-content-between">
          <div className="col-lg-8 col-12">
            <div className="stepper">
              <Box>
                <Stepper
                  activeStep={activeStep}
                  orientation="vertical"
                  connector={null}
                >
                  {steps.map((step, index) => (
                    <Step key={step.label}>
                      {(activeStep === index ||
                        activeStep === index + 1 ||
                        activeStep === index + 2 ||
                        activeStep === index + 3 ||
                        activeStep === index + 4) && (
                        <>
                          <div
                            className={`Custom-step`}
                            ref={(el: any) => (stepRefs.current[index] = el)}
                          >
                            <StepLabel>
                              <div
                                className={`custom-stepper 
                                  ${activeStep === index ? "active" : ""} 
                                  ${activeStep > index ? "completed" : ""}`}
                              >
                                {index + 1}
                              </div>
                              <div className="content-label">
                                {step.label}
                                {activeStep > index && (
                                  <div className="step-sublabel">
                                    {step.data}
                                  </div>
                                )}
                              </div>
                              {/* added condition to disable the change button */}
                              {visible &&
                              activeStep !== 4 &&
                              activeStep !== index ? (
                                <Button
                                  className="change-btn"
                                  onClick={() => handleChange(index)}
                                  sx={{ mt: 1, mr: 1 }}
                                >
                                  {t("ABOUTUS.change")}
                                </Button>
                              ) : (
                                ""
                              )}
                            </StepLabel>
                          </div>
                          <StepContent>{step?.description}</StepContent>
                        </>
                      )}
                    </Step>
                  ))}
                </Stepper>
                <div className="toast-container px-3 px-lg-5 ms-4 ms-lg-2">
                  <Toast ref={toast} />
                </div>
              </Box>
            </div>
          </div>
          <div className="col-4">
            <div className="order-detail-card order-mobile-view">
              <YourOrder
                mobilePlan={true}
                fibrePlan={false}
                planName={packageName ? packageName : ""}
                planPrice={packagePrice ? packagePrice : ""}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default PlanDetails;
