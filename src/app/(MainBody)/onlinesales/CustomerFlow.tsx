"use client";

import AboutYou from "@/CommonComponent/AboutYou";
import DeliveryAddress from "@/CommonComponent/DeliveryAddress";
import MobilePhoneNumber from "@/CommonComponent/MobilePhoneNumber";
import PageTopHeader from "@/CommonComponent/PageTopHeader";
import YourOrder from "@/CommonComponent/YourOrder";
import CustomerType from "@/Components/CustomerType/CustomerType";
import { PlanDetailsProps } from "@/Types/CommonComponent.type";
import { Box } from "@mui/material";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "reactstrap";
import simIcon from "../../../../public/assets/images/newsim.png";
import "../../../../public/assets/scss/pages/_plan-details.scss";
import headerIcon from "../../../../public/assets/svg/topHeader.svg";
import { Dialog, DialogBody, DialogSurface } from "@fluentui/react-components";
import { Card } from "primereact/card";
import Login from "@/CommonComponent/LoginCard";
import { updateUserInfo } from "@/Redux/Reducers/SharedData/SharedDataSlice";
import { useDispatch } from "react-redux";

const PlanDetails: React.FC<PlanDetailsProps> = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [customerOption, setCustomerOption] = useState<string>("");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = React.useState(0);
  const [visible, setVisible] = React.useState("");
  const [stepValues, setStepValues] = useState<Record<number, string>>({});
  const [sublabel, setSublabel] = useState("");
  const [sublabel1, setSublabel1] = useState("");
  const [sublabel2, setSublabel2] = useState<any>();
  const [sublabel3, setSublabel3] = useState<any>();
  const [cardIndex, setCardindex] = useState<number | null | undefined>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );
  const [simConfirm, setSimConfirm] = useState<string>("");
  const [sublabel4, setSublabel4] = useState<any>();
  const [disabledSteps, setDisabledSteps] = useState<number[]>([]);
  const dispatch = useDispatch();

  const handleNext = () => {
    setCompletedSteps((prev) => [...prev, activeStep]);
    setDisabledSteps((prev) => [...prev, activeStep]);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setVisible("visible");
  };

  const handleChange = (index: React.SetStateAction<number>) => {
    setActiveStep(index);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleCustomerCard = (
    data: string | null,
    index: number | null | undefined
  ) => {
    setSublabel(data || "");
    setCardindex(index);
  };

  const handlePhoneData = (data: string) => {
    setSublabel1(data);
  };
  const handleSimConfirm = (simConfirm: string) => {
    setSimConfirm(simConfirm);
  };
  const handleCardSelect = (index: number | null) => {
    setSelectedCardIndex(index);
  };
  const handleAboutData = (data: any) => {
    setSublabel2(data);
  };

  const handleDeliveryData = (data: string) => {
    setSublabel3(data);
  };

  useEffect(() => {
    if (cardIndex === 1) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [cardIndex]);

  const steps = [
    {
      label: t("customerType.lobsterCustomer"),
      description: (
        <CustomerType
          customerCardSelect={handleCustomerCard}
          handleNext={handleNext}
          defaultCardIndex={null}
        />
      ),
      data: <span>{sublabel}</span>,
    },
    {
      label: t("MOBILENUMBER.mobileNumberText"),
      description: (
        <MobilePhoneNumber
          onCardSelect={handlePhoneData}
          onSimConfirm={handleSimConfirm}
          onSelect={handleCardSelect}
          handleNext={handleNext}
        />
      ),
      data: <span>{sublabel1}</span>,
    },
    {
      label: t("ABOUTUS.aboutYouText"),
      description: (
        <AboutYou handleNext={handleNext} handleAboutData={handleAboutData} />
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
      label: t("DELIVERYADDRESS.deliveryAddressText"),
      description: (
        <DeliveryAddress
          handleDelivery={handleDeliveryData}
          handleNext={handleNext}
          isDeliveryAddress={true}
          control={undefined}
          singleAddressFormistingCustomer={false}
        />
      ),
      data: <span>{sublabel3}</span>,
    },
    {
      label: t("PAYMENTINFORMATION.paymentInfoText"),
      description: (
        <Button
          className="buy-btn"
          type="submit"
          variant="contained"
          onClick={() => {
            dispatch(
              updateUserInfo({
                firstName: sublabel2?.firstName,
                email: sublabel2?.email,
                idType: sublabel2?.idType,
                idNumber: sublabel2?.idNumber,
              })
            );
            router.push("/pages/purchase_plan");
          }}
        >
          {t("customerType.buyNow")}
        </Button>
      ),
      data: <></>,
    },
  ];

  return (
    <div className="planDetailContainer ">
      <div className="row justify-content-between">
        <div className="col-lg-7">
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
                              {activeStep !== index &&
                                customerOption &&
                                index === 0 && (
                                  <div className="selected-card-text">
                                    <p>{customerOption}</p>
                                  </div>
                                )}
                              {activeStep !== index && stepValues[index] && (
                                <div className="selected-card-text">
                                  <p>{stepValues[index]}</p>
                                </div>
                              )}
                            </div>
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
            </Box>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="order-detail-card">
            <YourOrder
              mobilePlan={true}
              fibrePlan={true}
              planName={""}
              planPrice={""}
            />
          </div>
        </div>
      </div>

      <Login open={isVisible} />
    </div>
  );
};

export default PlanDetails;
