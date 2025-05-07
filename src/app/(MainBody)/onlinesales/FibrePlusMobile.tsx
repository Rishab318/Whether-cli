"use client";
import React, { useRef, useState } from "react";
import { Button } from "reactstrap";
import Stepper from "@mui/material/Stepper";
import DOMPurify from "dompurify";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import { ApiResponse, PlanDetailsProps } from "@/Types/CommonComponent.type";
import FibreCoverage from "@/CommonComponent/Fibrecoverage";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import AboutYou from "@/CommonComponent/AboutYou";
import MobilePhoneNumber from "@/CommonComponent/MobilePhoneNumber";
import BillingAddress from "@/CommonComponent/BillingAddress";
import YourOrder from "@/CommonComponent/YourOrder";
import CustomerType from "@/Components/CustomerType/CustomerType";
import { useRouter } from "next/navigation";
import { API_ROUTES, PLAN_TYPES } from "@/Constant";
import PaymentInformation from "@/Components/PaymentInformation/PaymentInformation";
import { apiTrigger } from "@/ApiQuery/apiTrigger";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import {
  updateBuildingAddress,
  updateExistingUserData,
  updateShoppingCart,
  updateUserInfo,
} from "@/Redux/Reducers/SharedData/SharedDataSlice";
import LoginCard from "@/CommonComponent/LoginCard";
import DeliveryAddress from "@/CommonComponent/DeliveryAddress";

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
  const [addressSublabel, setAddressSublabel] = useState("");
  const [sublabel, setSublabel] = useState("");
  const [sublabel1, setSublabel1] = useState("");
  const [sublabel2, setSublabel2] = useState<any>();
  const [sublabel4, setSublabel4] = useState<any>();
  const [deliverySubLabel, setDeliverySubLabel] = useState<any>();
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [selectedAddress, setSelecteAddress] = useState<string>("");
  const [billingAddressSame, setBillingAddressSame] = useState(false);
  const [deliveryAddressSame, setDeliveryAddressSame] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isAutoRenew, setIsAutoRenew] = useState(true);
  const sharedData = useSelector((state: any) => state?.sharedData?.data);
  const dispatch = useDispatch();

  const handleNext = (data?: any, skipNextStep: boolean = false) => {
    setActiveStep((prevActiveStep) => {
      if (skipNextStep) {
        // Skip one step by adding 2
        return prevActiveStep + 2;
      }
      return prevActiveStep + 1;
    });

    setVisible(activeStep + (skipNextStep ? 2 : 1) < steps.length);
  };

  const handleChange = (index: React.SetStateAction<number>) => {
    setActiveStep(index);
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
    const referralCode = sharedData?.shoppingCart?.referralCode;
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

    const installationAddressforFibre = {
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
    const installationAddressforMobile = {
      geographicAddress: {
        ...(deliveryAddressSame
          ? {
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
            }
          : {
              addressType: "installation",
              addressCountry: sharedData?.country?.split(" (")[0] || "",
              addressStreetName: "",
              addressStreetNumber: "",
              addressName: sharedData?.addressline1 || "",
              addressPostcode: sharedData?.postalCode || "",
              addressAreaName: sharedData?.town || "",
              addressLocality: sharedData?.addressline2 || "",
            }),
      },
    };

    const territoryOwner = {
      territoryOwner: sharedData?.unitAddressCoverage?.territoryOwner,
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
          addressCountry: deliveryAddressSame
            ? data?.country?.split(" (")[0]
            : sharedData?.country?.split(" (")[0],
          addressStreetName: deliveryAddressSame
            ? `${sharedData.buildingAddress.street_type} ${sharedData.buildingAddress.street_name}`
            : "",
          addressStreetNumber: deliveryAddressSame
            ? sharedData.buildingAddress.number
            : "",
          addressName: deliveryAddressSame
            ? sharedData.floorAddress.floor
            : sharedData?.addressline1,
          addressPostcode: deliveryAddressSame
            ? sharedData.buildingAddress.postal_code
            : sharedData?.postalCode,
          addressAreaName: deliveryAddressSame
            ? sharedData.buildingAddress.town
            : sharedData?.town,
          addressLocality: deliveryAddressSame
            ? sharedData.buildingAddress.province
            : sharedData?.addressline2,
          addressSubBuildingName: deliveryAddressSame ? flatAddress : "",
        },
      ],
      shoppingCart: {
        type: "newSales",
        status: "open",
        cartItem: cartItems?.map((item: any, index: number) => ({
          ...(item?.planType === "Mobile" ? portingFormdata : null),
          ...(item?.planType === "Fibre" ? territoryOwner : null),
          ...(item?.planType === "Mobile"
            ? installationAddressforMobile
            : item?.planType === "Fibre"
            ? installationAddressforFibre
            : null),
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

    if (!deliveryAddressSame) {
      dispatch(
        updateBuildingAddress({
          buildingAddress: { summary: sharedData?.addressline1 || "" },
          floorAddress: {
            address_description: {
              summary: `${sharedData?.addressline2} ${sharedData?.postalCode} ${sharedData?.town}`,
            },
          },
        })
      );
    }
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

  const handleRecurringToggle = (value: boolean) => {
    setIsAutoRenew(value);
    localStorage.setItem("auto_renew_key", `${value}`);
  };
  const handleCompleteSale = async () => {
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
        isPublicRoute: false,
        customHeaders: { "user-session-id": currentSessionId },
        requestBody: {
          IS_MOBILE_RECURRING_ENABLED: reccurringKey,
        }, // Added body data
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

    const territoryOwner = {
      territoryOwner: sharedData?.unitAddressCoverage?.territoryOwner,
    };

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

    const fibreInstallationAddress = {
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
    const MobileInstallationAddress = {
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
          ...(item?.planType === "Mobile" ? portingFormdata : null),
          ...(item?.planType === "Fibre" ? territoryOwner : null),
          ...(item?.planType === "Mobile"
            ? { referralCode: referralCode }
            : null),
          ...(item?.planType === "Mobile"
            ? MobileInstallationAddress
            : fibreInstallationAddress),
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
        requestBody: requestBody,
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

  const handleFibreCard = (data: any) => {
    setAddressSublabel(` ${data?.street} ${data?.floor} `);
    setSelecteAddress(` ${data?.street} ${data?.floor} `);
  };

  const handleAboutData = (data: any) => {
    setSublabel2(data);
  };

  const handleBillingData = (data: string) => {
    setSublabel4(data);
  };
  const handleCardSelect = (index: number | null) => {
    // setSelectedCardIndex(index);
  };
  const handlePhoneData = (data: string) => {
    setSublabel1(data);
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

  const handleDeliveryData = (data: string) => {
    setDeliverySubLabel(data);
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
      data: <span>{addressSublabel}</span>,
    },
    {
      label: `Mobile plan: ${packageName?.split(",")[0]}`,
      description: (
        <MobilePhoneNumber
          onCardSelect={handlePhoneData}
          onSelect={handleCardSelect}
          handleNext={handleNext}
        />
      ),
      data: <span>{sublabel1}</span>,
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
      data: <span>{sublabel}</span>,
    },
    {
      label: t("ABOUTUS.personalInfoText"),
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
              <span>
                {sublabel2.name} {sublabel2.idNumber}
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
          : `${t("DELIVERYADDRESS.deliveryAddressText")} (to send your SIM)`,
      description:
        customerTypeCard === 1 ? (
          <DeliveryAddress
            handleDelivery={handleDeliveryData}
            billingAddressNext={(data) => {
              handleNext(data);
            }}
            singleAddressForm={true}
            visible={true}
            existingCustomer={customerTypeCard === 1 ? true : false}
          />
        ) : (
          <BillingAddress
            handleDelivery={handleDeliveryData}
            handleNext={handleNext}
            selectedAddress={selectedAddress}
            showDeliveryAddress={true}
            singleAddressForm={false}
            onCardSelect={(index) => {
              setDeliveryAddressSame(index === 0 ? true : false);
            }}
          />
        ),
      data: (
        <span>
          {deliverySubLabel ||
            selectedAddress?.trim().replace(/\s*,\s*$/, "") ||
            ""}
        </span>
      ),
    },
    {
      ...(customerTypeCard === 1
        ? {
            label: t("PAYMENTINFORMATION.paymentInfoText"),
            description: (
              <>
                <PaymentInformation
                  paymentUrl={paymentUrl}
                  onSuccess={handleCompleteSale}
                  onRecurringToggle={handleRecurringToggle}
                  //to remove payment iFrame screen in case of Existing customer
                  existingCustomer={customerTypeCard === 1 ? true : false}
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
          }
        : {
            label: t("billingAddress.billingAddressTitle"),
            description: (
              <BillingAddress
                handleDelivery={handleBillingData}
                selectedAddress={selectedAddress}
                handleDataSubmit={handleCustomerRegistration}
                showDeliveryAddress={true}
                singleAddressForm={false}
                onCardSelect={(index) => {
                  setBillingAddressSame(index === 0 ? true : false);
                }}
              />
            ),
            data: (
              <span>
                {sublabel4 ||
                  selectedAddress?.trim().replace(/\s*,\s*$/, "") ||
                  ""}
              </span>
            ),
          }),
    },
    {
      label: t("PAYMENTINFORMATION.paymentInfoText"),
      description: (
        <>
          <PaymentInformation
            paymentUrl={paymentUrl}
            onSuccess={handleCompleteSale}
            onRecurringToggle={handleRecurringToggle}
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
                      activeStep === index + 4 ||
                      activeStep === index + 5 ||
                      activeStep === index + 6) && (
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
                            activeStep !== 6 &&
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
            </Box>
            <div className="toast-container px-3 px-lg-5 ms-4">
              <Toast ref={toast} />
            </div>
          </div>
        </div>

        {/* {activeStep !== 0 && ( */}
        <div className="col-md-4 col-12">
          <div className="order-detail-card">
            <div>
              <YourOrder
                mobilePlan={true}
                fibrePlan={true}
                planName={packageName ? packageName : ""}
                planPrice={packagePrice ? packagePrice : ""}
              />
            </div>
          </div>
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default PlanDetails;
