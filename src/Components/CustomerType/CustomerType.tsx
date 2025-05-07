import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { useTranslation } from "next-i18next";
import { Button } from "primereact/button";
import { CustomerTypeProps } from "@/Types/CommonComponent.type";
import { Card } from "primereact/card";
import { CheckmarkRegular } from "@fluentui/react-icons";
import { CircleRegular } from "@fluentui/react-icons";
import Image from "next/image";
import CheckedIcon from "../../../public/assets/svg/checkbox.svg";
import { clearData } from "@/Redux/Reducers/SharedData/SharedDataSlice";
import { useDispatch } from "react-redux";

interface FormValues {
  selectedCards: number[];
}

const CustomerType: React.FC<CustomerTypeProps> = ({
  customerCardSelect,
  handleNext,
  defaultCardIndex,
  userDetailRender,
}) => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );
  const handleClickNext = () => {
    // Do not work when Existing customer selected
    if (handleNext && selectedCardIndex !== null && selectedCardIndex !== 1) {
      dispatch(clearData());
      handleNext();
    }
  };

  // Re-run effect when defaultCardIndex changes
  useEffect(() => {
    setSelectedCardIndex(defaultCardIndex);
  }, [defaultCardIndex]);

  const handleCardClick = (index: number) => {
    const newIndex = selectedCardIndex === index ? null : index;
    setSelectedCardIndex(newIndex);
    customerCardSelect &&
      customerCardSelect(
        newIndex !== null ? cardDataArray[newIndex].title : "",
        newIndex !== null ? newIndex : null
      );
  };

  const cardDataArray = [
    { title: t("customerType.newCustomer") },
    { title: t("customerType.alreadyCustomer") },
  ];
  return (
    <div className="customerTypeContainer">
      <p className={`option ${userDetailRender && "d-none"}`}>
        {t("customerType.selectOption")}:
      </p>
      <div className="cards row">
        {cardDataArray.map((item, index) => (
          <div className="col-md-6 col-12" key={index}>
            <div className="card-container position-relative">
              <div className="icon-container position-absolute top-0 end-0 m-2">
                {selectedCardIndex === index ? (
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
                className={`${
                  selectedCardIndex == index ? "selected-card" : "p-card"
                }`}
                onClick={() => handleCardClick(index)}
              />
            </div>
          </div>
        ))}
      </div>
      <Button
        type="submit"
        disabled={selectedCardIndex === null}
        className={`next-button ${userDetailRender && "d-none"}`}
        onClick={handleClickNext}
      >
        {t("ABOUTUS.next")}
      </Button>
    </div>
  );
};

export default CustomerType;
