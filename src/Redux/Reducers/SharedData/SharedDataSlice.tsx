// src/Redux/Slices/sharedDataSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//import { RegistrationAddress } from "@/Types/CommonComponent.type";

interface SharedDataState {
  data: {
    buildingAddress: any;
    communicationAddress: any;
    floorAddress: any;
    unitAddressCoverage: any;
    userInfo: any;
    shoppingCart: any;
    portingDetails: any;
    existingCustomerData: any;

    // form fields data
    name: string;
    currentMobileNumber: string;
    mobileProvider: string;
    currentSIM: string;
    ICCIDNumber: string;
    ownerDetailSwitch: boolean;
    portingFirstName: string;
    portingLastName: string;
    portingIdType: string;
    portingIdNumber: string;
    portingNationality: string;
    selectedCard: number | null;
    gender: string;
    firstName: string;
    lastName: string;
    day: string;
    month: string;
    year: string;
    idType: string;
    idNumber: string;
    nationality: string;
    email: string;
    confirmEmail: string;
    contactNumber: string;
    confirmTerms: boolean;
    confirmCheck: boolean;
    country: string;
    postalCode: string;
    town: string;
    addressline1: string;
    addressline2: string;
    addressSwitch: boolean;
    billingCountry: string;
    billingPostalCode: string;
    billingTown: string;
    billingAddressline1: string;
    billingAddressline2: string;
    isRecurring: boolean;
  };
}

const initialState: SharedDataState = {
  data: {
    buildingAddress: {
      number: 0,
      postal_code: 0,
      province: "",
      province_id: 0,
      street_name: "",
      street_type: "",
      summary: "",
    },
    communicationAddress: {
      summary: "",
    },
    floorAddress: {
      block: "",
      door: "",
      letter: "",
      stair: "",
      floor: "",
      hand1: "",
      hand2: "",
      summary: "",
    },
    unitAddressCoverage: {
      territoryOwner: "",
    },
    userInfo: {
      firstName: "",
      email: "",
      idType: "",
      idNumber: "",
      accountNo: "",
    },
    shoppingCart: {
      cartType: "",
      referralCode: "",
      productsInfo: {},
    },
    portingDetails: {
      currentMobileNumber: "",
      mobileProvider: "",
      currentSIM: "",
      ICCIDNumber: "",
      ownerDetailSwitch: true,
      portingFirstName: "",
      portingLastName: "",
      portingIdType: "",
      portingIdNumber: "",
      portingNationality: "",
    },
    existingCustomerData: {},
    name: "",
    currentMobileNumber: "",
    mobileProvider: "",
    currentSIM: "",
    ICCIDNumber: "",
    ownerDetailSwitch: true,
    portingFirstName: "",
    portingLastName: "",
    portingIdType: "",
    portingIdNumber: "",
    portingNationality: "",
    selectedCard: null,
    gender: "",
    firstName: "",
    lastName: "",
    day: "",
    month: "",
    year: "",
    idType: "",
    idNumber: "",
    nationality: "",
    email: "",
    confirmEmail: "",
    contactNumber: "",
    confirmTerms: false,
    confirmCheck: false,
    country: "",
    postalCode: "",
    town: "",
    addressline1: "",
    addressline2: "",
    addressSwitch: true,
    billingCountry: "",
    billingPostalCode: "",
    billingTown: "",
    billingAddressline1: "",
    billingAddressline2: "",
    isRecurring: true,
  },
};

const SharedDataSlice = createSlice({
  name: "sharedData",
  initialState,
  reducers: {
    // Update address and territoryOwner
    updateBuildingAddress(
      state,
      action: PayloadAction<{
        buildingAddress?: any;
        floorAddress?: any;
        unitAddressCoverage?: any;
      }>
    ) {
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
    formPreservedData(state, action: PayloadAction<{}>) {
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
    updateMobileCommunicationAddress(
      state,
      action: PayloadAction<{
        communicationAddress?: any;
      }>
    ) {
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
    updateUserInfo(
      state,
      action: PayloadAction<{
        firstName?: string;
        email?: string;
        idType?: string;
        idNumber?: string;
        accountNo?: string;
      }>
    ) {
      state.data.userInfo = {
        ...state.data.userInfo,
        ...action.payload,
      };
    },
    updateShoppingCart(
      state,
      action: PayloadAction<{
        cartType?: string;
        referralCode?: string;
        productsInfo?: {};
      }>
    ) {
      state.data.shoppingCart = {
        ...state.data.shoppingCart,
        ...action.payload,
      };
    },
    updateExistingUserData(state, action: PayloadAction<{}>) {
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },

    //   state.data.planData = action.payload;
    // },
    // updatePlanDataCategory(state,action: string){
    //   state.data.planDataCategory = action.payload;
    // },
    clearData(state) {
      (state.data.userInfo = {
        firstName: "",
        email: "",
        idType: "",
        idNumber: "",
      }),
        (state.data.existingCustomerData = {});
      state.data = {
        //to preserve some of the states like shoppingCart
        ...state.data,
        // shoppingCart: {},
        // buildingAddress: {},
        // communicationAddress: {},
        // floorAddress: {},

        userInfo: {},
        portingDetails: {},
        existingCustomerData: {},
        name: "",
        gender: "",
        firstName: "",
        lastName: "",
        day: "",
        month: "",
        year: "",
        idType: "",
        idNumber: "",
        nationality: "",
        email: "",
        confirmEmail: "",
        contactNumber: "",
        confirmTerms: false,
        confirmCheck: false,
        country: "",
        postalCode: "",
        town: "",
        addressline1: "",
        addressline2: "",
        addressSwitch: true,
        billingCountry: "",
        billingPostalCode: "",
        billingTown: "",
        billingAddressline1: "",
        billingAddressline2: "",
        isRecurring: true,
      };
    },
  },
});

export const {
  updateBuildingAddress,
  updateMobileCommunicationAddress,
  clearData,
  updateUserInfo,
  updateShoppingCart,
  updateExistingUserData,
  formPreservedData,
} = SharedDataSlice.actions;
export default SharedDataSlice.reducer;
