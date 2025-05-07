import { useTranslation } from "react-i18next";
import * as yup from "yup";

const trimExtraSpaces = (value: string) => {
  return value ? value.replace(/\s\s+/g, " ").trim() : value;
};
const namePattern =
  /^[abcdefghijklmnopqrstuvwxyzáâãäåæçèéêëìíîïðñòóôõöøùúûüýß '-.&]+$/i;
export const aboutYouValidation = (existingCustomer: boolean) => {
  const { t } = useTranslation("common");
  return yup.object({
    ...(!existingCustomer && {
      gender: yup.string().required(t("Error.gender")),
      firstName: yup
        .string()
        .required(t("Error.firstNameRequired"))
        .matches(namePattern, t("Error.firstNameValidate")),

      lastName: yup
        .string()
        .required(t("Error.lastNameRequired"))
        .matches(namePattern, t("Error.lastNameValidate")),
      day: yup.string().required(t("Error.dayRequired")),

      month: yup.string().required(t("Error.monthRequired")),
      year: yup
        .string()
        .required(t("Error.yearRequired"))
        .test(
          "is-valid-age",
          "You must be at least 18 years old",
          function (_, context) {
            const { day, month, year } = context.parent;

            if (!day || !month || !year) {
              return true; // Ensure all parts of the date are filled
            }

            // Convert strings to numbers
            const dayNum = parseInt(day, 10);
            const monthNum = parseInt(month, 10) - 1; // Months are 0-based
            const yearNum = parseInt(year, 10);

            const birthDate = new Date(yearNum, monthNum, dayNum);
            const today = new Date();

            if (isNaN(birthDate.getTime())) {
              return false; // Invalid date
            }

            const age = today.getFullYear() - birthDate.getFullYear();
            const isBirthdayPassed =
              today.getMonth() > birthDate.getMonth() ||
              (today.getMonth() === birthDate.getMonth() &&
                today.getDate() >= birthDate.getDate());

            return isBirthdayPassed ? age >= 18 : age > 18;
          }
        ),

      idType: yup
        .string()
        .required(t("Error.idTypeRequired"))
        .oneOf(["DNI", "NIE", "NIF", "Passport", "EU"], "Invalid ID type"),
      idNumber: yup.string().when("idType", (idType, schema) => {
        const idTypeValue = Array.isArray(idType) ? idType[0] : idType;
        switch (idTypeValue) {
          case "DNI":
            return schema.required(t("Error.dni")).matches(/^[0-9]{8}[A-Z]$/, {
              message: "Please enter a valid DNI in the format 12345678A",
            });

          case "NIE":
            return schema
              .required(t("Error.nie"))
              .matches(/^[XYZxyz][0-9]{7}[A-Za-z]$/, {
                message: "Please enter a valid NIE in the format X1234567A",
              });

          case "NIF":
            return schema
              .required(t("Error.nif"))
              .matches(/^[A-Za-z][0-9]{7}[A-Za-z]$/, {
                message: "Please enter a valid NIF in the format X1234567A",
              });
          case "Passport":
            return schema
              .required(t("Error.passport"))
              .matches(/^(?!^0+$)[a-zA-Z0-9]{3,12}$/, {
                message:
                  "Please enter a valid Passport number (3-12 characters)",
              });

          case "EU":
            return schema
              .required(t("Error.eu"))
              .matches(/^(?!^0+$)[a-zA-Z0-9]{3,12}$/, {
                message: "Please enter a valid EU ID (3-12 characters)",
              });

          default:
            return schema.required(t("Error.idNumberRequired"));
        }
      }),
      nationality: yup.string().required(t("Error.nationalityRequired")),

      email: yup
        .string()
        .email(t("Error.emailInvalid"))
        .required(t("Error.emailRequired")),
      ...(!existingCustomer && {
        confirmEmail: yup
          .string()
          .oneOf([yup.ref("email"), undefined], t("Error.confirmEmailMismatch"))
          .required(t("Error.confirmEmailRequired")),
      }),
      contactNumber: yup
        .string()
        .required(t("Error.contactNumberRequired"))
        .min(9, t("Error.contactNumberInvalid")),
    }),

    confirmTerms: yup.boolean().oneOf([true], t("Error.termsRequired")),
    confirmCheck: yup.boolean().notRequired(),
  });
};

export const fibreCoverageFormValidation = () => {
  return yup.object({
    postCode: yup
      .string()
      .required("Please enter your postcode")
      .matches(/^\d{5}$/, "Please enter a valid postcode with 5 digits"),
    address: yup.string().required("Please enter your address"),
    num: yup
      .string()
      .test(
        "num-required-if-confirmCheck-false",
        "This field is required if No Number is not checked.",
        function (value) {
          const { confirmCheck } = this.parent;
          if (!confirmCheck && !value) {
            return false;
          }
          return true;
        }
      ),
    confirmCheck: yup.boolean(),
  });
};
export const addressFormValidation = (
  singleAddressForm: any,
  selectedCardIndex: any,
  addressSwitch: boolean,
  existingCustomer: boolean
) => {
  const billingAddressFormSchema = {
    billingCountry: yup.string().required("Please enter your country"),
    billingPostalCode: yup
      .string()
      .required("Please enter your postcode")
      .matches(/^\d{5}$/, "Please enter a valid postcode with 5 digits"),
    billingTown: yup.string().required("Please enter your town"),
    billingAddressline1: yup.string().required("Please enter your address"),
    billingAddressline2: yup.string().optional(),
  };
  const deliveryAddressFormValidation = {
    country: yup.string().required("Please enter your country"),
    postalCode: yup
      .string()
      .required("Please enter your postcode")
      .matches(/^\d{5}$/, "Please enter a valid postcode with 5 digits"),
    town: yup.string().required("Please enter your town"),
    addressline1: yup.string().required("Please enter your address"),
    addressline2: yup.string().optional(),
  };
  return yup.object({
    ...(selectedCardIndex !== 0 &&
      !existingCustomer &&
      deliveryAddressFormValidation),
    ...(singleAddressForm && {
      addressSwitch: yup.boolean().default(true),
    }),
    ...(singleAddressForm && !addressSwitch ? billingAddressFormSchema : null),
  });
};
export const mobileNumberFormValidation = (values: any) => {
  // Start with the base schema that's always present
  const baseSchema = {
    currentMobileNumber: yup
      .string()
      .required("Please enter your current mobile number"),
    mobileProvider: yup
      .string()
      .required("Please enter your current mobile provider"),
    currentSIM: yup
      .string()
      .required("Please tell us if your current SIM is ‘pay as you go’"),
    ownerDetailSwitch: yup.boolean().default(true),
  };
  const iccidNumber = {
    ICCIDNumber: yup
      .string()
      .required("Please enter the ICCID")
      .matches(
        /^(8934)\d{9,15}$/,
        "Please enter a valid ICCID starting with 8934 followed by 13 or 19 digits"
      ),
  };
  const differentOwner = {
    portingFirstName: yup.string().required("Please enter your first name"),
    portingLastName: yup.string().required("Please enter your last name"),
    portingIdType: yup.string().required("Please enter your ID Type"),
    portingIdNumber: yup.string().required("Please enter your ID Number"),
    portingNationality: yup.string().required("Please enter your nationality"),
  };
  // Return just schema based on the conditions
  return yup.object({
    ...baseSchema,
    ...(values?.currentSIM === "Yes, it’s ‘pay-as-you-go’"
      ? iccidNumber
      : null),
    ...(values?.ownerDetailSwitch === false ? differentOwner : null),
  });
};
export const validationSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Please enter your email"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Please enter your password")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Password must contain at least one special character"
    )
    .required("Please enter your password"),
});
export const callMeBackSchema = yup.object({
  firstName: yup
    .string()
    .required("Please enter your First name")
    .matches(namePattern, "Please enter your first name with only letters"),

  lastName: yup
    .string()
    .required("Please enter your Last name")
    .matches(namePattern, "Please enter your last name with only letters"),

  contactNumber: yup
    .string()
    .required("Please enter your contact number")
    .min(12, "Phone number must be at least 9 digits"),
  contactEmail: yup.string().required("Please enter your contact email"),
});
