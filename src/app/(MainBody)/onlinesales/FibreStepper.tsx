"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "reactstrap";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import { ApiResponse, PlanDetailsProps } from "@/Types/CommonComponent.type";
import FibreCoverage from "@/CommonComponent/Fibrecoverage";
import CustomerType from "@/Components/CustomerType/CustomerType";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import DOMPurify from "dompurify";
import AboutYou from "@/CommonComponent/AboutYou";
import BillingAddress from "@/CommonComponent/BillingAddress";
import YourOrder from "@/CommonComponent/YourOrder";
import "../../../../public/assets/scss/pages/_fibre-stepper.scss";
import { useRouter } from "next/navigation";
import { apiTrigger } from "@/ApiQuery/apiTrigger";
import { API_ROUTES, PLAN_TYPES } from "@/Constant";
import PaymentInformation from "@/Components/PaymentInformation/PaymentInformation";
import { useDispatch, useSelector } from "react-redux";
import {
  updateExistingUserData,
  updateShoppingCart,
  updateUserInfo,
} from "@/Redux/Reducers/SharedData/SharedDataSlice";
import { Toast } from "primereact/toast";
import LoginCard from "@/CommonComponent/LoginCard";
const PlanDetails: React.FC<PlanDetailsProps> = ({
  packagePrice,
  packageName,
  setSpinnerLoading,
}) => {
  const toast = useRef<Toast>(null);
  const childRef = useRef<Toast>(null);
  const { t } = useTranslation("common");
  const router = useRouter();
  const [activeStep, setActiveStep] = React.useState(0);
  const [customerTypeCard, setCustomerTypeCard] = useState<number | null>(null);
  const [visible, setVisible] = React.useState(false);
  const [sublabel, setSublabel] = useState("");
  const [sublabel1, setSublabel1] = useState("");
  const [sublabel2, setSublabel2] = useState<any>();
  const [sublabel3, setSublabel3] = useState<any>();
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [billingAddressSame, setBillingAddressSame] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );
  const sharedData = useSelector((state: any) => state?.sharedData?.data);
  const dispatch = useDispatch();

  const handleNext = (data?: any) => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setVisible(true);
  };
  const sanitizeWorldPayUrl = (url: string) => {
    // new iframe url for payment screen
    const extraParams =
      "&iframeHelperURL=https://care.lobster.es/selfcare/skin/html/helper.html";

    const fullUrl = url + extraParams;
    return DOMPurify.sanitize(fullUrl);
  };
  const handleCustomerRegistration = async (data: any) => {
    const cartItems = sharedData?.shoppingCart?.productsInfo?.results;
    const salesRegion = sharedData?.shoppingCart?.salesRegion;
    const selectedAddressDescription = {
      block: "",
      door: "",
      letter: "",
      stair: "",
      floor: "",
      hand1: "",
      hand2: "",
      summary: "",
    };
    let updatedAddress: any;
    updatedAddress = {
      ...selectedAddressDescription,
      ...sharedData.floorAddress,
    };
    const flatAddress = (
      (updatedAddress.block ? `${updatedAddress.block} ` : "") +
      (updatedAddress.door ? `${updatedAddress.door} ` : "") +
      (updatedAddress.letter ? `${updatedAddress.letter} ` : "") +
      (updatedAddress.stair ? `${updatedAddress.stair} ` : "") +
      (updatedAddress.hand1 ? `${updatedAddress.hand1} ` : "") +
      (updatedAddress.hand2 ? `${updatedAddress.hand2}` : "")
    ).trim(); // Remove trailing spaces

    const installationAddress = {
      geographicAddress: {
        addressType: "installation",
        addressCountry: data?.country?.split(" (")[0] || "",
        addressStreetName:
          `${sharedData?.buildingAddress?.street_type} ${sharedData?.buildingAddress?.street_name}` ||
          "",
        addressStreetNumber: sharedData?.buildingAddress?.number || "",
        addressName: sharedData?.floorAddress?.floor || "",
        addressPostcode: sharedData?.buildingAddress?.postal_code || "",
        addressAreaName: sharedData?.buildingAddress?.town || "",
        addressLocality: sharedData?.buildingAddress?.province || "",
        addressSubBuildingName: flatAddress || "",
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
      nationality: sharedData?.country || "",
      email: sharedData?.email || "",
      confirmEmail: sharedData?.confirmEmail || "",
      phoneNumber: sharedData?.contactNumber || "",
      salesRegion: salesRegion,
      geographicAddress: [
        {
          addressType: "billing",
          addressCountry: billingAddressSame
            ? data?.country?.split(" (")[0]
            : data?.country?.split(" (")[0],
          addressStreetName: billingAddressSame
            ? `${sharedData.buildingAddress.street_type} ${sharedData.buildingAddress.street_name}`
            : "",
          addressStreetNumber: billingAddressSame
            ? sharedData.buildingAddress.number
            : "",
          addressName: billingAddressSame
            ? sharedData.floorAddress.floor
            : data?.addressline1,
          addressPostcode: billingAddressSame
            ? sharedData.buildingAddress.postal_code
            : data?.postalCode,
          addressAreaName: billingAddressSame
            ? sharedData.buildingAddress.town
            : data?.town,
          addressLocality: billingAddressSame
            ? sharedData.buildingAddress.province
            : data?.addressline2,
          addressSubBuildingName: billingAddressSame ? flatAddress : "",
        },
        {
          addressType: "communication",
          addressCountry: data?.country?.split(" (")[0],
          addressStreetName: `${sharedData.buildingAddress.street_type} ${sharedData.buildingAddress.street_name}`,
          addressStreetNumber: sharedData.buildingAddress.number,
          addressName: sharedData.floorAddress.floor,
          addressPostcode: sharedData.buildingAddress.postal_code,
          addressAreaName: sharedData.buildingAddress.town,
          addressLocality: sharedData.buildingAddress.province,
          addressSubBuildingName: flatAddress,
        },
      ],
      shoppingCart: {
        type: "newSales",
        status: "open",
        cartItem: cartItems?.map((item: any, index: number) => ({
          ...installationAddress,
          cartItemNumber: index + 1,
          type: item?.planType,
          action: "Add",
          quantity: 1,
          productOfferingName: item?.productName,
          territoryOwner: sharedData?.unitAddressCoverage?.territoryOwner,
        })),
      },
    };
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
        setSpinnerLoading(false);
        setVisible(false);
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
  const handleCompleteSale = async () => {
    setSpinnerLoading(true);
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = localStorage.getItem("user_session_id") as string;
    }
    try {
      const data = (await apiTrigger({
        useApiGuestClient: false,
        route: API_ROUTES.POST_COMPLETE_SALE,
        isMockEnabled: false,
        isPublicRoute: false,
        customHeaders: { "user-session-id": currentSessionId },
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
    } finally {
      setSpinnerLoading(false);
    }
  };

  // OSP-275 : For the existing customer flow this complete sale triggered
  const handleCompleteLoginSale = async (Id: string) => {
    setSpinnerLoading(true);
    const cartItems = sharedData?.shoppingCart?.productsInfo?.results;
    const selectedAddressDescription = {
      block: "",
      door: "",
      letter: "",
      stair: "",
      floor: "",
      hand1: "",
      hand2: "",
      summary: "",
    };
    let updatedAddress: any;
    updatedAddress = {
      ...selectedAddressDescription,
      ...sharedData.floorAddress,
    };
    const flatAddress = (
      (updatedAddress.block ? `${updatedAddress.block} ` : "") +
      (updatedAddress.door ? `${updatedAddress.door} ` : "") +
      (updatedAddress.letter ? `${updatedAddress.letter} ` : "") +
      (updatedAddress.stair ? `${updatedAddress.stair} ` : "") +
      (updatedAddress.hand1 ? `${updatedAddress.hand1} ` : "") +
      (updatedAddress.hand2 ? `${updatedAddress.hand2}` : "")
    ).trim(); // Remove trailing spaces
    const installationAddress = {
      geographicAddress: {
        addressType: "installation",
        addressCountry: sharedData?.country?.split(" (")[0],
        addressStreetName: `${sharedData.buildingAddress.street_type} ${sharedData.buildingAddress.street_name}`,
        addressStreetNumber: sharedData.buildingAddress.number,
        addressName: sharedData.floorAddress.floor,
        addressPostcode: sharedData.buildingAddress.postal_code,
        addressAreaName: sharedData.buildingAddress.town,
        addressLocality: sharedData.buildingAddress.province,
        addressSubBuildingName: flatAddress,
      },
    };
    const loginBillingAddress =
      sharedData?.existingCustomerData?.accounts?.geographicAddress?.[0];
    const requestBody = {
      IS_MOBILE_RECURRING_ENABLED: sharedData?.isRecurring || false,
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
          territoryOwner: sharedData?.unitAddressCoverage?.territoryOwner,
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

  const handleFibreCard = (data: any) => {
    setSublabel(` ${data?.street} ${data?.floor} `);
    setSelectedAddress(` ${data?.street} ${data?.floor} `);
  };
  // OSP-195 : Login popup handle function
  const handleCustomerCard = (
    data: string | null,
    cardindex: number | null | undefined
  ) => {
    setSublabel1(data || "");
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
        handleNext(res); // use this when login api deployed
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

  const handleAboutData = (data: any) => {
    setSublabel2(data);
  };
  const handleBillingData = (data: string) => {
    setSublabel3(data);
  };
  const billingAddressSelect = (index: number | null) => {
    setBillingAddressSame(index === 0 ? true : false);
  };
  const steps = [
    {
      label: "Fibre coverage",
      description: (
        <FibreCoverage
          FibreCoverageCard={handleFibreCard}
          handleAddress={handleFibreCard}
          handleNext={handleNext}
          setSpinnerLoading={setSpinnerLoading}
        />
      ),
      data: <span>{sublabel}</span>,
    },
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
      data: <span>{sublabel1}</span>,
    },
    {
      label: t("ABOUTUS.aboutYouText"),
      description: (
        <AboutYou
          handleAboutData={handleAboutData}
          handleNext={handleNext}
          existingCustomer={customerTypeCard === 1 ? true : false}
          setSpinnerLoading={setSpinnerLoading}
        />
      ),
      data: (
        <div className="sublabel">
          <span>
            {sublabel2?.name} . {sublabel2?.idNumber}
          </span>
          <span>{sublabel2?.email}</span>
        </div>
      ),
    },
    {
      label: "Billing Address",
      description: (
        <BillingAddress
          handleDelivery={handleBillingData}
          handleDataSubmit={(data) => {
            if (customerTypeCard === 1) {
              //In existing comtomer this will by-pass form from this step to document upload screen and complete sale will be triggered here
              handleCompleteLoginSale(sessionId);
            } else {
              handleCustomerRegistration(data);
            }
          }}
          selectedAddress={selectedAddress}
          singleAddressForm={false}
          existingCustomer={customerTypeCard === 1 ? true : false}
          buyNowEnable={customerTypeCard === 1 ? true : false}
          onCardSelect={billingAddressSelect}
        />
      ),
      data: (
        <span>
          {sublabel3 || selectedAddress?.trim().replace(/\s*,\s*$/, "") || ""}
        </span>
      ),
    },
    {
      label: t("PAYMENTINFORMATION.paymentInfoText"),
      description: (
        <>
          <PaymentInformation
            paymentUrl={paymentUrl}
            onSuccess={handleCompleteSale}
            isRecurringDisabled={true}
          />
        </>
      ),
      data: <></>,
    },
  ];

  return (
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
                        <div className="Custom-step">
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
                                <div className="step-sublabel">{step.data}</div>
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
                                Change
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
              <div className="toast-container px-3 px-lg-5 ms-4">
                <Toast ref={toast} />
              </div>
            </Box>
          </div>
        </div>

        <div className="col-md-4 col-12">
          <div className="order-detail-card">
            <div>
              <YourOrder
                mobilePlan={false}
                fibrePlan={true}
                planName={packageName ? packageName : ""}
                planPrice={packagePrice ? packagePrice : ""}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;
