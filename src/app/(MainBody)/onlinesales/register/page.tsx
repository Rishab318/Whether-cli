"use client";

import React, { useEffect, useState } from "react";
import PlanDetails from "./PlanDetails";
import PageTopHeader from "@/CommonComponent/PageTopHeader";
import Sunglasses from "../../../../../public/assets/svg/Sunglasses.svg";
import FibrePlusMobile from "../FibrePlusMobile";
import FibreStepper from "../FibreStepper";
import { API_ROUTES } from "@/Constant";
import { apiTrigger } from "@/ApiQuery/apiTrigger";
import { Button, Card } from "reactstrap";
import Image from "next/image";
import spinloader from "../../../../../public/assets/svg/spinloader.gif";
import { updateShoppingCart } from "@/Redux/Reducers/SharedData/SharedDataSlice";
import { useDispatch } from "react-redux";
import { SessionData } from "@/Types/Session.type";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { ApiResponse } from "@/Types/CommonComponent.type";
import { PLAN_TYPES } from "@/Constant";
import { useRouter } from "next/navigation";
interface PlanData {
  id: number;
  packageName: string;
  packagePrice: string;
  planType: "mobile" | "fibre";
}

const Plan = () => {
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [cartItemData, setCartItemData] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(false);
  const [spinnerLoading, setSpinnerLoading] = useState<boolean>(false);
  const [selectedPlanTypes, setSelectedPlanTypes] = useState<any>({});
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const redirect_url = process.env.NEXT_PUBLIC_REDIRECT_PAGE_NOT_FOUND || "";
  const cardDataArray = [
    { title: "PKGSMALL", value: "PKGSMALL" },
    { title: "PKGMEDIUM", value: "PKGMEDIU" },
    { title: "PKGLARGE", value: "PKGLARGE" },
    { title: "PKGNATIO", value: "PKGNATIO" },
    { title: "PKG1GB", value: "PKG1GB" },
    { title: "PKG600MB", value: "PKG600MB" },
  ];
  const fetchSessionData = async () => {
    try {
      const response = await fetch("/api/session");
      if (response?.ok) {
        const data = await response?.json();
        setSessionData(data);
        let referralCode = data?.referralCode || "";
        let languageCode = data?.languageCode;
        i18n.changeLanguage(languageCode);
        dispatch(
          updateShoppingCart({
            referralCode: referralCode,
          })
        );
        let updatedPackageName = [data?.packageCode];
        // if will be called in case of bundle
        if (data?.packageCode.includes(",")) {
          updatedPackageName = data?.packageCode.split(",");
        }
        if (updatedPackageName) {
          handleProceed(updatedPackageName);
        }
      }
    } catch (error) {
      console.error("Failed to fetch session data:", error);
    }
  };

  useEffect(() => {
    setSpinnerLoading(true);
    fetchSessionData();
    setSpinnerLoading(false);
  }, []);
  const getSelectedPlanDetails = async (selectedPackages: string[]) => {
    try {
      setSpinnerLoading(true);
      // Create the new request body format with productOfferingIds array
      const requestBody = {
        productOfferingIds: selectedPackages,
      };

      const response = (await apiTrigger({
        route: API_ROUTES.GET_PRODUCT_INFO,
        useApiGuestClient: false,
        requestBody: requestBody,
        isPublicRoute: false,
      })) as ApiResponse;

      // Process the new response format
      if (response && response.results && Array.isArray(response.results)) {
        setSpinnerLoading(false);
        // Store plan types for future reference
        const planTypeMap: Record<string, string> = {};
        dispatch(
          updateShoppingCart({
            productsInfo: response,
          })
        );

        response.results.forEach((product) => {
          planTypeMap[product.productName] = product.planType.toLowerCase();
        });

        // Update the state with plan types
        setSelectedPlanTypes(planTypeMap);

        return response.results.map((product) => {
          // Convert planType to 'mobile' or 'fibre' format
          const planType =
            product.planType.toLowerCase() === PLAN_TYPES.MOBILE_TYPE
              ? PLAN_TYPES.MOBILE_TYPE
              : PLAN_TYPES.FIBRE_TYPE;

          // Calculate price based on the new structure
          const priceDetails = product.priceDetails;
          let price = "0";

          if (priceDetails.monthly.alterationPrice.totalPrice > 0) {
            price = priceDetails.monthly.alterationPrice.totalPrice.toString();
          } else if (priceDetails.oneTimeUp.alterationPrice.totalPrice > 0) {
            price =
              priceDetails.oneTimeUp.alterationPrice.totalPrice.toString();
          }

          return {
            id: Date.now() + Math.random(),
            packageName:
              product.characteristics.find(
                (item: { characteristicName: string }) =>
                  item.characteristicName === "displayName"
              )?.characteristicValue || "",
            packagePrice: price,
            planType: planType as "mobile" | "fibre",
          };
        });
      }

      setSpinnerLoading(false);
      return [];
    } catch (error) {
      setSpinnerLoading(false);
      router.push(redirect_url);
      return [];
    }
  };

  const canSelectCard = (index: number) => {
    if (selectedCards.length === 0) return true;
    if (selectedCards.length === 1) {
      // First, check if we already have plan type information from a previous API call
      const selectedCardValue = cardDataArray[selectedCards[0]].value;
      const newCardValue = cardDataArray[index].value;

      if (
        selectedPlanTypes[selectedCardValue] &&
        selectedPlanTypes[newCardValue]
      ) {
        // If we have type information for both cards, check if they're different
        return (
          selectedPlanTypes[selectedCardValue] !==
          selectedPlanTypes[newCardValue]
        );
      }

      // If we don't have type information, allow selection and we'll validate after API call
      return true;
    }
    return false;
  };

  const handleCardClick = (index: number) => {
    setSelectedCards((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else if (canSelectCard(index)) {
        return [...prev, index];
      }
      return prev;
    });
  };

  const handleProceed = async (updatedPackageName: any | undefined) => {
    setLoading(true);
    setSpinnerLoading(true);
    setCartItemData([]); // Clear existing data

    try {
      let selectedPackages = [];
      if (selectedCards.length > 0) {
        // Get the package values from selected cards
        selectedPackages = selectedCards.map(
          (index) => cardDataArray[index].value
        );
      } else {
        selectedPackages = updatedPackageName;
      }

      // Make a single API call with all selected plans
      const planData = await getSelectedPlanDetails(selectedPackages);

      // If we got more than one plan, validate that they're different types
      if (planData.length > 1) {
        const typeSet = new Set(planData.map((plan) => plan.planType));

        // If all plans are the same type, we should only keep one
        if (typeSet.size === 1) {
          // Keep only the first plan
          setCartItemData([planData[0]]);
          setSpinnerLoading(false);
        } else {
          setCartItemData(planData);
          setSpinnerLoading(false);
        }
      } else {
        setCartItemData(planData);
        setSpinnerLoading(false);
      }
    } catch (error) {
      setSpinnerLoading(false);
    } finally {
      setLoading(false);
      setSpinnerLoading(false);
    }
  };

  const renderComponent = () => {
    if (!cartItemData.length) return null;

    // For two selected cards (mobile + fibre), render FibrePlusMobile
    if (cartItemData.length === 2) {
      const mobileItem = cartItemData.find(
        (item) => item.planType === PLAN_TYPES.MOBILE_TYPE
      );
      const fibreItem = cartItemData.find(
        (item) => item.planType === PLAN_TYPES.FIBRE_TYPE
      );
      if (mobileItem && fibreItem) {
        dispatch(
          updateShoppingCart({
            cartType: PLAN_TYPES.BUNDLE_TYPE,
          })
        );
        return (
          <FibrePlusMobile
            packageName={`${mobileItem.packageName}, ${fibreItem.packageName}`}
            packagePrice={`${mobileItem.packagePrice}, ${fibreItem.packagePrice}`}
            setSpinnerLoading={(data) => setSpinnerLoading(data)}
          />
        );
      }
    }

    // For single card selection
    return cartItemData.map((item) => {
      dispatch(
        updateShoppingCart({
          cartType: item.planType,
        })
      );
      switch (item.planType) {
        case PLAN_TYPES.MOBILE_TYPE:
          return (
            <PlanDetails
              key={item.id}
              packageName={item.packageName}
              packagePrice={item.packagePrice}
              setSpinnerLoading={(data) => setSpinnerLoading(data)}
            />
          );
        case PLAN_TYPES.FIBRE_TYPE:
          return (
            <FibreStepper
              key={item.id}
              packageName={item.packageName}
              packagePrice={item.packagePrice}
              setSpinnerLoading={(data) => setSpinnerLoading(data)}
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <>
      <div className="top-header">
        <div className="main-banner">
          <PageTopHeader title={t("HEADER.order")} image={Sunglasses} />
        </div>
      </div>
      <div className="container">
        <div className="content-wrapper">
          <div className="plan-detail-mobile-header">
            {/* <PageTopHeader
              title="Brand new Lobster in 2 min"
              image={Sunglasses}
            /> */}
          </div>
          {sessionData && Object.keys(sessionData).length === 0 && (
            <div className="row justify-content-center">
              <div className="col-12 col-md-10 text-center">
                <div
                  className={
                    cartItemData.length > 0 ? "d-none" : "card-box  mt-5"
                  }
                >
                  {cardDataArray.map((item, index) => (
                    <Card
                      key={index}
                      className={`plan-cards w-auto ${
                        selectedCards.includes(index) ? "selected-card" : ""
                      } ${
                        !canSelectCard(index) && !selectedCards.includes(index)
                          ? "disabled"
                          : ""
                      }`}
                      onClick={() => handleCardClick(index)}
                    >
                      <h1>{item.title}</h1>
                      <p>
                        {selectedPlanTypes[item.value]?.toUpperCase() || ""}
                      </p>
                    </Card>
                  ))}
                  {selectedCards.length > 0 && (
                    <Button
                      variant="contained"
                      className="buy-btn w-auto my-auto text-small fs-6 fs-md-2 fw-normal fw-md-bolder"
                      onClick={handleProceed}
                      disabled={loading}
                    >
                      {loading
                        ? "Loading..."
                        : `select ${selectedCards.length} ${
                            selectedCards.length === 1 ? "Plan" : "Plans"
                          }`}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          <div>{renderComponent()}</div>
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

export default Plan;
