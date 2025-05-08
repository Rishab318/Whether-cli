import { useTranslation } from "next-i18next";
import { useState } from "react";
import CheckedIcon from "../../../public/assets/svg/checkbox.svg";
import { BillingAddressProps } from "@/Types/CommonComponent.type";
import DeliveryAddress from "../DeliveryAddress";
import { Card } from "primereact/card";
import Image from "next/image";
import { CircleRegular } from "@fluentui/react-icons";

const BillingAddress: React.FC<BillingAddressProps> = ({
  handleDelivery,
  onCardSelect,
  handleNext,
  handleDataSubmit,
  selectedAddress,
  singleAddressForm,
  billingAddressNext,
  existingCustomer,
  buyNowEnable,
}) => {
  const { t } = useTranslation("common");

  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );

  const cardDataArray: any[] = [
    {
      title: t("billingAddress.same_address"),
    },
    {
      title: t("billingAddress.different_address"),
    },
  ];

  const handleCardClick = (index: number) => {
    const newIndex = selectedCardIndex === index ? null : index;
    setSelectedCardIndex(newIndex);
    onCardSelect && onCardSelect(newIndex);
  };

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    if (handleDelivery) {
      const address = `${values.addressline1} ${values.addressline2}, ${values.postalCode} ${values.town}`;
      handleDelivery(address);
    }
    if (values && handleNext) {
      handleNext();
    }
  };

  return (
    <div className="billing-container customerTypeContainer">
      {!existingCustomer && (
        <>
          <p className="option">{t("customerType.selectOption")}:</p>
          <div className="cards">
            {cardDataArray.map((item, index) => (
              <div className="billing-card" key={index}>
                <div className="card-container position-relative">
                  <div className="icon-container position-absolute m-1 end-0">
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
          {selectedCardIndex === 0 && (
            <p className="selectedAddress mt-2">{selectedAddress}</p>
          )}
        </>
      )}
      {selectedCardIndex === 1 && !existingCustomer && (
        <span>{t("billingAddress.billing_address_title")}</span>
      )}

      <DeliveryAddress
        singleAddressForm={singleAddressForm ?? true}
        showNextButton={true}
        billingAddressNext={billingAddressNext}
        // In case of existing customer we not showing the card screen there is form to show so the card index is 1
        selectedCardIndex={existingCustomer ? 1 : selectedCardIndex}
        handleDelivery={handleDelivery}
        handleDataSubmit={handleDataSubmit}
        visible={false}
        existingCustomer={existingCustomer || false}
        handleNext={
          selectedCardIndex !== null || existingCustomer ? handleNext : () => {}
        }
        buyNowEnable={buyNowEnable}
      />
    </div>
  );
};

export default BillingAddress;
