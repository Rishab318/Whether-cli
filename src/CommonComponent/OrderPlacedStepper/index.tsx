import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import { OrderPlacedStep } from "@/Types/CommonComponent.type";
import { useTranslation } from "next-i18next";
import PurchasePlanComponent from "@/Components/PurchasePlanComponent/PurchasePlanComponent";
import { StepContent } from "@mui/material";
import SimDelivery from "@/CommonComponent/SimDelivery";
import { Card } from "reactstrap";
import { useSelector } from "react-redux";

const OrderPlacedStepper = () => {
  const { t } = useTranslation("common");
  const [activeStep, setActiveStep] = React.useState(1);
  const stepRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const { shoppingCart } = useSelector((state: any) => state?.sharedData?.data);

  // React.useEffect(() => {
  //   scrollToSection(activeStep, -440); // enable if onload scroll focus to attachment card section
  // }, []);

  // get step 2 title based on some condition
  const getSimStepTitle = () => {
    if (activeStep >= 2) {
      return t("ORDERPLACEDSTEPPER.pendingTasks");
    } else {
      let title = t("ORDERPLACEDSTEPPER.SimDelivery");
      title =
        shoppingCart.cartType === "fibre"
          ? t("ORDERPLACEDSTEPPER.installation")
          : title;
      title =
        shoppingCart.cartType === "bundle"
          ? t("ORDERPLACEDSTEPPER.installationAndSimDelivery")
          : title;
      return title;
    }
  };

  const getSimStepTitleOnCard = () => {
    if (shoppingCart.cartType === "bundle") {
      return t("ORDERPLACEDSTEPPER.installationAndSimDelivery");
    } else if (shoppingCart.cartType === "fibre") {
      return t("ORDERPLACEDSTEPPER.installation");
    } else {
      return t("ORDERPLACEDSTEPPER.SimDelivery");
    }
  };

  const steps: OrderPlacedStep[] = [
    {
      label: t("ORDERPLACEDSTEPPER.orderPlaced"),
      content: () => <Card className="main-card"></Card>,
      description:
        activeStep > 0 ? <span className="custom-border"></span> : "", // don't remove it
    },
    {
      label:
        activeStep > 1
          ? t("ORDERPLACEDSTEPPER.documentUploaded")
          : t("ORDERPLACEDSTEPPER.pendingTasks"),
      content: () => <PurchasePlanComponent handleNext={handleNext} />,
      description: "",
    },
    {
      label: getSimStepTitle(),
      content: () => (
        <Card className="main-card">
          <SimDelivery
            label={
              activeStep === 2 ? getSimStepTitleOnCard() : getSimStepTitle()
            }
          />
        </Card>
      ),
      description: activeStep === 2 ? "" : <SimDelivery />,
      // SimDelivery using in both keys because we showing before and the SimDelivery selection
    },
    {
      label: t("ORDERPLACEDSTEPPER.enjoyTheService"),
      content: () => <></>,
      description: "",
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => {
      let nextStep = Math.min(prevActiveStep + 1, steps.length - 1);
      if (nextStep < 2) {
        scrollToSection(nextStep, -235);
      }
      return nextStep;
    });
  };

  // Scroll to specific section till SimDelivery
  const scrollToSection = (nextStep: number, padding: number) => {
    setTimeout(() => {
      const stepElement = stepRefs.current[nextStep];
      if (stepElement) {
        const yOffset = padding; // Top padding
        const y =
          stepElement.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 1000); // Small delay to allow state update and above animate stop before 500ms
  };

  const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {},
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#eb5078",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: " #eb5078",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#b3b3b3",
      borderTopWidth: 8,
      borderRadius: 1,
      ...theme.applyStyles("dark", {
        borderColor: theme.palette.grey[800],
      }),
    },
  }));

  return (
    <div className="order-placed-stepper-container">
      <Box>
        <Stepper
          orientation="vertical"
          activeStep={activeStep}
          alternativeLabel
          connector={<QontoConnector />}
        >
          {steps.map((data, index) => (
            <Step
              key={data.label}
              completed={index < activeStep}
              className={`${index === activeStep ? "step-in-progress" : ""} ${
                index < activeStep ? "step-completed" : ""
              } ${steps.length - 1 === index ? "step-last" : ""} ${
                "step-" + index
              }`}
            >
              <StepLabel>
                {data.label}
                <div>{data.description}</div>
              </StepLabel>
              {(index === activeStep || index === activeStep + 1) && (
                <StepContent>
                  <div
                    className="stepper-content"
                    ref={(el: any) => (stepRefs.current[index] = el)}
                  >
                    {steps[index]?.content(handleNext)}
                  </div>
                </StepContent>
              )}
            </Step>
          ))}
        </Stepper>
      </Box>
    </div>
  );
};

export default OrderPlacedStepper;
