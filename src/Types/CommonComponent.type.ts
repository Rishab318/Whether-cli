import { ReactElement } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { Control, FieldValues } from "react-hook-form";

export interface SvgType {
  iconId: string;
  className?: string;
  style?: {
    height: string;
    width: string;
    fill: string;
    marginRight: string;
  };
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  mainTitle: string;
  parent: string;
  title: string;
}

export interface RatioImageProp {
  className?: string;
  src: string;
  alt: string;
  style?: { height: number };
}

export interface TableHeadType {
  class?: string;
  name: string;
}

export interface TableHeaderProp {
  headeData: TableHeadType[];
}
export interface PlanDetailsProps {
  handleNext?: any;
  index?: number;
  label?: string;
  description?: string | React.FC<CustomerTypeProps>; // Union type for description
  data?: React.ReactElement;
  packageName?: string;
  packagePrice?: string;
  setSpinnerLoading: (data: boolean) => void;
}

export interface CustomerTypeProps {
  handleNext?: () => void;
  index?: number;
  cardDataArray?: { title: string }[];
  selectedCards?: number[];
  handleCardClick?: (cardIndex: number) => void;
  customerCardSelect?: (
    title: string | null,
    cardindex?: number | null | undefined
  ) => void;
  defaultCardIndex: number | null;
  userDetailRender?: boolean;
}
//..............OSP Components...............
export interface FibreCoverageProps {
  handleNext?: () => void;
  index?: number;
  cardDataArray?: { title: string }[];
  selectedCards?: number[];
  handleCardClick?: (cardIndex: number) => void;
  FibreCoverageCard?: (title: string) => void;
  handleAddress?: (data: any) => void;
  setSpinnerLoading: (data: boolean) => void;
}
export interface ButtonProps {
  btnName?: string;
  endIcon?: string;
  startIcon?: string;
  className?: string;
  onClick?: () => void;
  disable?: boolean;
  startImg?: string;
  endImg?: string | undefined;
}

export interface InputProps {
  label?: string;
  name: string;
  value?: any;
  placeholder?: string;
  onChange?: any;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  className?: any;
}
export interface DropdownOption {
  name: string;
  code: string;
}
export interface DropdownMenuProps {
  options?: DropdownOption[];
  name?: string;
  placeholder?: string;
  onChange?: (e: any) => void;
  value?: any;
  label?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

type HandleEmailData = {
  name: string;
  idNumber: string;
  idType: string;
  email: string;
};

export interface AboutYouProps {
  handleNext?: (data?: any) => void;
  index?: number;
  handleAboutData: (data: any) => void;
  existingCustomer?: boolean;
  planType?: any;
  setSpinnerLoading: (data: boolean) => void;
}

export interface RadioButtonProps {
  options: any;
}

export interface DeliveryAddressProps {
  handleNext?: (data?: any) => void;
  handleDataSubmit?: (data?: any) => void;
  handleDelivery?: (address: string) => void;
  singleAddressForm: boolean;
  showNextButton?: boolean;
  billingAddressNext?: (data?: any) => void;
  selectedCardIndex?: number | null;
  visible: boolean;
  existingCustomer: boolean;
  buyNowEnable?: boolean;
}
export interface BillingAddressProps {
  handleNext?: (data?: any) => void;
  handleDataSubmit?: (data?: any) => void;
  billingAddressNext?: (dara?: any) => void;
  index?: number;
  handleBilling?: (address: string) => void;
  onCardSelect?: (index: number | null) => void;
  handleDelivery?: (address: string) => void;
  singleAddressForm?: boolean;
  showDeliveryAddress?: boolean;
  selectedAddress?: string;
  existingCustomer?: boolean;
  buyNowEnable?: boolean;
}
export interface PageTopHeaderType {
  title: string;
  subtitle?: ReactElement | string;
  image: any;
  optionalTitle?: string;
}

export interface MobilePhoneNumberProps {
  handleNext?: (data?: any) => void;
  index?: number;
  onCardSelect?: (data: string, value?: string) => void;
  onSimConfirm?: (simConfirm: string) => void;
  onSelect?: (index: number | null) => void;
  onChange?: (data: string | undefined) => void;
}
export interface TextProps {
  title: string;
  className: any;
}

export interface PlansCardProps {
  headerData: string;
  titleData: string;
  titleDataType: string;
  subTitleDataType: string;
  subTitleIntegerValue: string;
  subTitleDecimalValue: string;
  footerBtnName: string;
  planBtnName: string;
  cardBodyData: string;
  onClick: () => void;
  route: string;
}

export interface OrderPlacedStep {
  label: string;
  content: (handleNext: () => void) => React.ReactNode;
  description?: any;
}
export interface PhoneInputProps {
  placeholder: string;
  label?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  name: string;
  value: string;
  onChange: any;
}
export interface CheckboxOption {
  name: string;
  label: React.ReactNode;
  error: any;
}

export interface ApiResponseResult {
  productName: string;
  productDescription: string;
  taxCategory: string;
  planType: string;
  priceDetails: {
    monthly: {
      normalPrice: { PriceBeforeTax: number; tax: number; totalPrice: number };
      alterationPrice: {
        PriceBeforeTax: number;
        tax: number;
        totalPrice: number;
      };
    };
    oneTime: {
      normalPrice: { PriceBeforeTax: number; tax: number; totalPrice: number };
      alterationPrice: {
        PriceBeforeTax: number;
        tax: number;
        totalPrice: number;
      };
    };
    oneTimeUp: {
      normalPrice: { PriceBeforeTax: number; tax: number; totalPrice: number };
      alterationPrice: {
        PriceBeforeTax: number;
        tax: number;
        totalPrice: number;
      };
    };
  };
  characteristics: [
    {
      characteristicName: string;
      characteristicType: string;
      characteristicValue: string;
    }
  ];
}

export interface ApiResponse {
  accountId: string;
  results: ApiResponseResult[];
}
