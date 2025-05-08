import CustomButton from "@/CommonComponent/CustomButton";
import { Card } from "reactstrap";
import React, { FC, useEffect, useRef, useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast"; // Import Toast component
import "../../../public/assets/scss/pages/_purchase-plan.scss";
import spinloader from "../../../public/assets/svg/spinloader.gif";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { apiTrigger } from "@/ApiQuery/apiTrigger";
import { API_ROUTES } from "@/Constant";
import Image from "next/image";

const PurchasePlanComponent = (props: any) => {
  const { handleNext } = props;
  const { userInfo, shoppingCart, existingCustomerData } = useSelector(
    (state: any) => state?.sharedData?.data
  );
  const [frontFile, setFrontFile] = useState<any>(null);
  const [backFile, setBackFile] = useState<any>(null);
  const toast = useRef<any>(null);
  const [frontPreviewUrl, setFrontPreviewUrl] = useState<any>(null);
  const [backPreviewUrl, setBackPreviewUrl] = useState<any>(null);
  const [spinnerLoading, setSpinnerLoading] = useState<boolean>(false);
  const { t } = useTranslation("common");

  // Once sale is fully completed invoke clear function to remove data from redux and local storage
  const onUpload = () => {
    toast?.current?.show({
      severity: "info",
      summary: "Success",
      detail: t("purchasePlan.fileUploaded"),
    });
  };

  const onSelectFront = (event: any) => {
    const file = event.files[0];
    if (file) {
      // Create temporary preview URL
      setFrontFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFrontPreviewUrl(previewUrl);

      // Important: Clean up to prevent memory leaks
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const onSelectBack = (event: any) => {
    const file = event.files[0];
    if (file) {
      setBackFile(file);
      const previewUrl = URL.createObjectURL(file);
      setBackPreviewUrl(previewUrl);

      // Important: Clean up to prevent memory leaks
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const sendDocument = async () => {
    if (!frontFile || (userInfo?.idType !== "Passport" && !backFile)) {
      toast?.current?.show({
        severity: "error",
        summary: "Error",
        detail: t("ORDERPLACEDSTEPPER.fileUploadRequired"),
        life: 5000,
      });
      return;
    }

    try {
      setSpinnerLoading(true);
      const currentSessionId =
        (localStorage?.getItem("user_session_id") as string) ||
        existingCustomerData?.userSessionId;
      // Create FormData object
      const formData = new FormData();
      formData.append("file", frontFile);
      if (userInfo?.idType !== "Passport" && backFile) {
        formData.append("file1", backFile);
      }

      // Add account number from new customer and existingCustomerData
      formData.append(
        "account_no",
        userInfo?.accountNo ||
          existingCustomerData?.accounts?.accountExternalId ||
          ""
      );

      //this request is created to upload document
      const response = (await apiTrigger({
        useApiGuestClient: false,
        route: API_ROUTES.POST_UPLOAD_DOCUMENT,
        customHeaders: { "user-session-id": currentSessionId },
        isMockEnabled: false,
        isPublicRoute: false,
        isMultipart: true,
        requestBody: formData, // Added body data
      })) as any;

      if (response) {
        toast?.current?.show({
          severity: "success",
          summary: "Success",
          detail: t("ORDERPLACEDSTEPPER.documentUploaded"),
          life: 5000,
        });
        handleNext();
        setSpinnerLoading(false);
        localStorage.clear();
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
      setSpinnerLoading(false);
    } finally {
      setSpinnerLoading(false);
    }
  };

  const renderFrontBackCard = () => {
    return (
      <div className="outside-card">
        <Card title="" subTitle="" className="outer-card">
          <div className="inside-card">
            {frontPreviewUrl ? (
              <img src={frontPreviewUrl} alt="Preview" />
            ) : (
              <p className="text-muted"></p>
            )}
          </div>
          <FileUpload
            mode="basic"
            name="file"
            url="/api/upload"
            accept="image/png,image/jpeg,image/jpg,application/pdf"
            maxFileSize={1000000}
            onSelect={onSelectFront}
            onUpload={onUpload}
            auto={false}
            chooseLabel={t("purchasePlan.attachPhotoFront")}
            className=""
          />
        </Card>
        <Card title="" subTitle="" className="outer-card">
          <div className="inside-card">
            {backPreviewUrl ? (
              <img src={backPreviewUrl} alt="Preview" />
            ) : (
              <p className="text-muted"></p>
            )}
          </div>
          <FileUpload
            mode="basic"
            name="file1"
            url="/api/upload"
            accept="image/png,image/jpeg,image/jpg,application/pdf"
            maxFileSize={10000000}
            onSelect={onSelectBack}
            onUpload={onUpload}
            auto={false}
            chooseLabel={t("purchasePlan.attachPhotoBack")}
            className=""
          />
        </Card>
      </div>
    );
  };

  const renderBaseCardOnly = () => {
    return (
      <div className="outside-card">
        <Card title="" subTitle="" className="outer-card full">
          <div className="inside-card">
            {frontPreviewUrl ? (
              <img src={frontPreviewUrl} alt="Preview" />
            ) : (
              <p className="text-muted"></p>
            )}
          </div>
          <FileUpload
            mode="basic"
            name="file"
            url="/api/upload"
            accept="image/*"
            maxFileSize={10000000}
            onSelect={onSelectFront}
            onUpload={onUpload}
            auto={false}
            chooseLabel={t("purchasePlan.attachPhotoFrontOnly")}
            className=""
          />
        </Card>
      </div>
    );
  };

  return (
    <>
      <div className="main-purchase">
        <Card className="main-card">
          {/* Note: This (fibre, bundle) should change based on the selection and type from upcoming sprint changes */}
          {shoppingCart &&
            (shoppingCart.cartType === "fibre" ||
              shoppingCart.cartType === "bundle") && (
              <>
                <h5>{t("purchasePlan.signContractHeader")}</h5>
                <p className="mb-4 pb-2">
                  {t("purchasePlan.signContractDescription")}
                </p>
              </>
            )}
          <h5>{t("purchasePlan.confirmIdentity")}</h5>
          {userInfo && (
            <>
              <p className="mb-1">
                {t("purchasePlan.confirmIdentityDescription")}
              </p>
              <p className="mb-0">
                {t("purchasePlan.confirmIdentityDescription1")}
              </p>
              <div className="nie-number mb-0">
                {userInfo?.idType} {userInfo?.idNumber}
              </div>
            </>
          )}
          {userInfo && userInfo?.idType === "Passport"
            ? renderBaseCardOnly()
            : renderFrontBackCard()}

          <div className="links">
            {/* this button is used to upload documents selected */}
            <CustomButton
              onClick={sendDocument}
              className="send-button"
              aria-label="Toggle navigation"
              btnName={t("purchasePlan.sendDocument")}
            ></CustomButton>
            <p className="faded-text">
              <span>{t("purchasePlan.sendToEmail")} &nbsp;</span>
              <a href={`mailto:${t("purchasePlan.deliveryEmail")}`}>
                {t("purchasePlan.deliveryEmail")}
              </a>
            </p>
          </div>
          <div className="toast-container">
            <Toast ref={toast} />
          </div>
        </Card>
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

export default PurchasePlanComponent;
