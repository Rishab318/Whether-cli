import React, { useCallback, useState } from "react";
import { ApiResponse, FibreCoverageProps } from "@/Types/CommonComponent.type";
import { useTranslation } from "next-i18next";
import Input from "../InputText";
import { Button } from "reactstrap";
import { fibreCoverageFormValidation } from "@/utils/FormSchema";
import FocusError from "../FocusError";
import { Formik, Form, Field, FieldProps } from "formik";
import { API_ROUTES, PLAN_TYPES } from "@/Constant";
import { apiTrigger } from "@/ApiQuery/apiTrigger";
import Checkbox from "../Checkbox/Checkbox";
import DropdownMenu from "../InputDropdown";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import {
  updateBuildingAddress,
  updateShoppingCart,
} from "@/Redux/Reducers/SharedData/SharedDataSlice";
import { useDispatch, useSelector } from "react-redux";
import PreserveForm from "../PreserveForm";
import Image from "next/image";
import spinloader from "../../../public/assets/svg/spinloader.gif";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/Constant/apiRoutes/routes";
import debounce from "lodash/debounce";
interface BuildingOption {
  name: string;
  code: string;
}
interface FloorOption {
  name: string;
  code: string;
}

const FibreCoverage: React.FC<FibreCoverageProps> = ({
  handleNext,
  index,
  handleAddress,
  setSpinnerLoading,
}) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [addressValue, setAddressValue] = useState();
  const [postCode, setPostCode] = useState();
  const [numValue, setNumValue] = useState();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [floorVisible, setFloorVisible] = useState(false);
  const [buildingDropdown, setBuildingDropdown] = useState<BuildingOption[]>(
    []
  );
  const [addressNotFound, setAddressNotFound] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [floorDropdown, setFloorDropdown] = useState<FloorOption[]>([]);
  const [town, setTown] = useState("");
  const [building, setBuilding] = useState("");
  const toast = useRef<Toast>(null);
  const [selectedFloorValue, setSelectedFloorValue] = useState();
  const [selectedBuildingData, setSelectedBuildingData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const {
    formState: { errors },
  } = useForm({});
  const dispatch = useDispatch();
  const sharedData = useSelector((state: any) => state?.sharedData?.data);
  const handleStreet = async (
    address: any,
    postCode: any,
    number: any,
    setDropdownVisible: any,
    confirmCheck: boolean
  ) => {
    if (number && confirmCheck) {
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Validation Error",
          detail: t("fibreCoverage.confirmCheck"),
          life: 5000,
        });
      }
      return;
    }
    if (!number && !confirmCheck) {
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Validation Error",
          detail: t("fibreCoverage.numConfirmCheck"),
          life: 5000,
        });
      }
      return;
    }
    try {
      setSpinnerLoading(true);
      setDropdownVisible(false);
      const res = await apiTrigger({
        route: API_ROUTES.SEARCH_STREET,
        useApiGuestClient: false,
        queryParams: {
          search: `${postCode}, ${address}, ${number}`,
        },
        isPublicRoute: false,
      });

      if (res && Array.isArray(res) && res.length > 0) {
        setDropdownVisible(true);
      }
      if (res && Array.isArray(res) && res.length > 0) {
        const data = res.map((item) => ({
          name: item.address.summary,
          code: item.id,
        }));
        data.push({
          name: `${t("CONSTANT.buildingName")}`,
          code: "custom_not_shown",
        });
        setBuildingDropdown(data);
      }
    } catch (error) {
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: t("fibreCoverage.searchAddress1"),
          life: 5000,
        });
      }
    } finally {
      setSpinnerLoading(false);
    }
  };
  const fetchFloorRecords = async (floorID: any) => {
    setFloorDropdown([]);
    if (floorID !== "custom_not_shown") {
      const id = parseInt(floorID);
      setIsLoading(true);
      if (toast.current) {
        toast.current.clear();
      }
      const res = (await apiTrigger({
        route: API_ROUTES.GET_BUILDINGS,
        useApiGuestClient: false,
        pathParams: {
          id: id,
        },
      })) as any;

      if (res && Array.isArray(res.units) && res.units.length > 0) {
        setSelectedBuildingData(res); // setting sellected building data
        const data = res.units.map((item: any) => ({
          name: item.address_description.summary || "No summary",
          code: item.id,
        }));
        data.push({
          name: `${t("CONSTANT.floorName")}`,
          code: "floor_not_shown", // You can use any unique identifier here
        });
        setFloorVisible(true);
        setFloorDropdown(data);
        setAddressNotFound(false);
      } else {
        setFloorDropdown([]);
        setFloorVisible(false);
        setAddressNotFound(true);
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: t("fibreCoverage.notFind"),
            life: 5000,
          });
        }
      }

      setIsLoading(false);
    }
  };
  const fetchFloorCoverage = async (unitID: any) => {
    try {
      setIsLoading(true);
      if (toast.current) {
        toast.current.clear();
      }
      const res = (await apiTrigger({
        route: API_ROUTES.GET_UNITS,
        useApiGuestClient: false,
        requestBody: {
          unitID: unitID,
        },
      })) as any;
      if (res && Array.isArray(res.coverage) && res.coverage.length > 0) {
        const territoryOwner = res.coverage?.[0].territory_owner;
        dispatch(
          updateBuildingAddress({
            unitAddressCoverage: { territoryOwner: territoryOwner },
          })
        );
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: t("fibreCoverage.success"),
          life: 5000,
        });
        setIsLoading(false);
      } else {
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: t("fibreCoverage.notFind"),
            life: 5000,
          });
        }
        setAddressNotFound(true);
        setIsLoading(false);
      }
    } catch (error: any) {
      const errorMessage = error?.split("] ")[1] || "";
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errorMessage || t("fibreCoverage.notFind"),
          life: 5000,
        });
      }
    }
  };

  const handleBuildingDropdown = (value: any) => {
    setBuilding(value);
    setFloorVisible(false);
    fetchFloorRecords(value);
  };
  const getSelectedPlanDetails = async () => {
    const postalCode = sharedData?.postCode;

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
        postalCode: postalCode,
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

  const handleSubmit = (values: any) => {
    let buildingData;
    let floorData;
    if (values.street) {
      const selectedOption = buildingDropdown.find(
        (option: any) => option.code === values.street
      );
      buildingData = selectedOption?.name;
    }
    if (values.floor) {
      const selectedOption = floorDropdown.find(
        (option: any) => option.code === values.floor
      );
      floorData = selectedOption?.name;
      const selectedFloor = selectedBuildingData?.units.find(
        (_e: any) => _e.id === values.floor
      );
      dispatch(
        updateBuildingAddress({
          buildingAddress: selectedBuildingData?.address,
          floorAddress: selectedFloor?.address_description,
        })
      );
    }

    if (handleAddress) {
      const address = {
        street: buildingData,
        floor: floorData,
      };

      handleAddress(address);
    }
    getSelectedPlanDetails();
    if (values && handleNext) {
      handleNext();
    }
  };
  const debouncedPostalCodeSearch = useCallback(
    debounce(async (postCode: string, setFieldValue: any) => {
      try {
        if (postCode && postCode.length <= 5) {
          // Only trigger when postal code has valid length
          setIsSearchLoading(true);

          const res: any = await apiTrigger({
            route: API_ROUTES.GET_POSTAL_CODE,
            useApiGuestClient: false,
            queryParams: {
              postal_code: postCode,
            },
            isPublicRoute: false,
          });

          if (res && res.length > 0) {
            setTown(res[0].muncipality_name);
            setFieldValue("town", res[0].muncipality_name);
          }
        }
      } catch (error: any) {
        const errorMessage = error?.split("] ")[1];
        // Clear town field on error
        setTown("");
        setFieldValue("town", "");

        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: errorMessage || "",
            life: 5000,
          });
        }
      } finally {
        setIsSearchLoading(false);
      }
    }, 800),
    [] // Empty dependency array keeps this stable across renders
  );

  // Use the stable debounced function
  const handlePostalCode = (
    postCode: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    debouncedPostalCodeSearch(postCode, setFieldValue);
  };

  // Rest of your component remains the same...

  const handlePostCode = (values: any) => {
    setPostCode(values);
  };

  const handleAddressValue = (values: any) => {
    setAddressValue(values);
  };

  const handleNumber = (values: any) => {
    setNumValue(values);
  };
  const savedFormData = useSelector((state: any) => state?.sharedData?.data);
  const initialValues = {
    postCode: "",
    address: "",
    num: "",
    confirmCheck: false,
    town: town,
    street: savedFormData || "",
    floor: savedFormData || "",
  };

  return (
    <div className="FibreCoverageContainer">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={fibreCoverageFormValidation}
      >
        {({ setFieldValue, values }) => (
          <>
            <div className="text">
              <span>{t("fibreCoverage.instruction")}</span>
              <p>{t("fibreCoverage.tip")}</p>
            </div>
            <div className="row">
              <div className="col-12 street-inputs">
                <Form>
                  <div className="row">
                    <div className="col-lg-5 col-6">
                      <Field
                        name="postCode"
                        label={t("fibreCoverage.postCode")}
                        placeholder="01438"
                        component={Input}
                        value={values.postCode}
                        type="text"
                        maxLength={5}
                        errorFieldName="postCode"
                        onChange={(e: any) => {
                          const inputValue =
                            typeof e === "string" ? e : e?.target?.value || "";

                          // Only allow numeric characters
                          const numericValue = inputValue.replace(
                            /[^0-9]/g,
                            ""
                          );

                          // Limit to 5 digits
                          const limitedValue = numericValue.slice(0, 5);

                          setFieldValue("postCode", limitedValue);
                          handlePostCode(limitedValue);
                          handlePostalCode(limitedValue, setFieldValue);
                        }}
                      />
                    </div>
                    <div className="col-md-4 col-6 town">
                      <Field
                        name="town"
                        label={t("fibreCoverage.town")}
                        placeholder="l’Alfàs del Pi"
                        component={Input}
                        value={values.town}
                        errorFieldName="town"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-8 mb-md-0 mt-md-3 mt-2 ">
                      <Field
                        name="address"
                        label={t("fibreCoverage.address")}
                        placeholder="Carrer de la Pau"
                        component={Input}
                        value={values.address}
                        errorFieldName="address"
                        className="address-input"
                        onChange={handleAddressValue}
                        disabled={town === "" || !town}
                      />
                    </div>
                    <div className="col-md-2 col-6 mt-md-3 mt-2">
                      <Field
                        name="num"
                        label={t("fibreCoverage.num")}
                        placeholder="12"
                        component={Input}
                        value={values.num}
                        errorFieldName="num"
                        className="num"
                        onChange={handleNumber}
                        disabled={town === "" || !town}
                      />
                    </div>
                    <div className="col-md-2 col-6 checkBox">
                      <Field name="confirmCheck">
                        {({ field }: FieldProps) => (
                          <Checkbox
                            {...field}
                            checked={field?.value}
                            onChange={(e) =>
                              setFieldValue("confirmCheck", e?.checked)
                            }
                            disabled={town === "" || !town}
                          />
                        )}
                      </Field>
                      <label className="checkBoxLabel">No Number</label>
                    </div>
                    <div className="col-12 mt-md-3 mt-2">
                      <Button
                        onClick={() => {
                          setFloorVisible(false);
                          setDropdownVisible(false);
                          handleStreet(
                            addressValue,
                            postCode,
                            numValue,
                            setDropdownVisible,
                            values.confirmCheck
                          );
                        }}
                        // added condition for postcode as well so that the postcode is also required before api fires
                        type="button"
                        disabled={!addressValue || !postCode || isSearchLoading}
                        variant="contained"
                        className="search-btn"
                      >
                        {isSearchLoading ? (
                          <Image
                            src={spinloader}
                            alt="Loading"
                            width={20}
                            height={20}
                          />
                        ) : (
                          t("fibreCoverage.searchAddress")
                        )}
                      </Button>
                    </div>
                    {dropdownVisible && (
                      <div className="col-lg-12">
                        <Field
                          name="street"
                          label={t("fibreCoverage.street")}
                          placeholder={t("fibreCoverage.selectAddress")}
                          options={buildingDropdown}
                          onSelectValue={(e: any) => handleBuildingDropdown(e)}
                          component={DropdownMenu}
                          errorFieldName="day"
                          className="streetDropdown"
                        />
                        {isLoading && (
                          <div className="spinner-container">
                            <Image src={spinloader} alt="Loading..." />
                          </div>
                        )}
                      </div>
                    )}
                    {floorVisible && (
                      <div className="col-lg-12">
                        <Field
                          name="floor"
                          label={t("fibreCoverage.floor")}
                          placeholder={t("fibreCoverage.select")}
                          options={floorDropdown}
                          onSelectValue={(e: any) => {
                            // Handle floor selection here
                            setSelectedFloorValue(e);

                            if (toast.current) {
                              toast.current.clear();
                            }
                            if (e && e === "floor_not_shown") {
                              setAddressNotFound(true);
                            }
                            if (e && e !== "floor_not_shown") {
                              setAddressNotFound(false);
                              fetchFloorCoverage(e);
                            }
                          }}
                          component={DropdownMenu}
                          errorFieldName="floor"
                          className="floor-dropdown"
                        />
                      </div>
                    )}
                  </div>
                  <div className="col-12 mt-3 mt-md-0">
                    <div className="toast-container">
                      <Toast ref={toast} />
                    </div>
                  </div>

                  <div className="fibre-btn mt-md-0 mt-3">
                    {selectedFloorValue !== "floor_not_shown" && (
                      <Button
                        className="next-btn"
                        type="submit"
                        variant="contained"
                        //added condition to the next button
                        style={{
                          display:
                            buildingDropdown.length > 0 &&
                            floorDropdown.length > 0 &&
                            selectedFloorValue !== undefined
                              ? "block"
                              : "none",
                        }}
                      >
                        {t("fibreCoverage.next")}
                      </Button>
                    )}
                    <div
                      style={{
                        display:
                          buildingDropdown?.length > 0 &&
                          (addressNotFound || floorDropdown?.length === 0) &&
                          dropdownVisible &&
                          building
                            ? "block"
                            : "none",
                      }}
                    >
                      <p className="callme-text">
                        {t("fibreCoverage.callmeText")}
                      </p>
                      <Button
                        type="button"
                        variant="contained"
                        className="call-btn"
                        onClick={() => {
                          setSpinnerLoading(true);
                          router.push(ROUTES.userDetails);
                          setSpinnerLoading(false);
                        }}
                      >
                        {t("fibreCoverage.callmeBack")}
                      </Button>
                    </div>
                  </div>
                  {/* OSP-183 :Automatically scrolls and focuses to the first form field withan error upon form submission. */}
                  <FocusError />
                  {/* OSP-209 :Preserve form data in case if user get back to previous step before form submission. */}
                  <PreserveForm />
                </Form>
              </div>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};

export default FibreCoverage;
