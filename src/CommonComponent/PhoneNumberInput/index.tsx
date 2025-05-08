import React, { useEffect, useRef } from "react";
import { ErrorMessage, FieldProps } from "formik";
import { AVAILABLE_COUNTRY, DEFAULT_COUNTRY } from "@/Constant";
interface PhoneInputProps {
  label?: string;
  placeholder?: string;
  name: string;
  error?: string;
  errorFieldName: string;
}

const PhoneNumberInput: React.FC<
  PhoneInputProps & FieldProps & { disabled?: boolean }
> = ({
  field,
  form,
  label,
  placeholder,
  error,
  errorFieldName,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const itiRef = useRef<any>(null);

  useEffect(() => {
    const initializeIti = async () => {
      if (inputRef.current && typeof window !== "undefined") {
        // Dynamic import to avoid SSR issues
        const intlTelInput = (await import("intl-tel-input")).default;

        // Destroy existing instance if it exists
        if (itiRef.current) {
          itiRef.current.destroy();
        }

        itiRef.current = intlTelInput(inputRef.current, {
          initialCountry: DEFAULT_COUNTRY,
          separateDialCode: true,
          preferredCountries: AVAILABLE_COUNTRY,
          allowDropdown: !disabled,
        });

        // Set initial value if exists
        if (field.value) {
          itiRef.current.setNumber(field.value);
        }
      }
    };

    initializeIti();

    return () => {
      if (itiRef.current) {
        itiRef.current.destroy();
        itiRef.current = null;
      }
    };
  }, [disabled]);

  const handleInputChange = (e: any) => {
    e.target.value = e.target.value.replace(/[^\d]/g, "");
    if (itiRef.current) {
      const phoneNumber = e.target.value;

      form.setFieldValue(field.name, phoneNumber);
      if (field?.onChange) {
        field.onChange(e);
      }
    }
  };

  // Handle blur event for Formik validation
  const handleBlur = () => {
    form.setFieldTouched(field.name, true);
  };
  const toggleDropdown = async () => {
    if (inputRef.current && typeof window !== "undefined") {
      // Dynamic import to avoid SSR issues
      const intlTelInput = (await import("intl-tel-input")).default;

      // Destroy existing instance if it exists
      if (itiRef.current) {
        itiRef.current.destroy();
      }

      itiRef.current = intlTelInput(inputRef.current, {
        initialCountry: "es",
        separateDialCode: true,
        preferredCountries: ["es", "us", "fr"],
        allowDropdown: !disabled,
      });

      // Set initial value if exists
      if (field.value) {
        itiRef.current.setNumber(field.value);
      }
    }
  };
  return (
    <div className="phoneInput">
      {label && <label className="inputLabel">{label}</label>}
      <div className={`tel-input-container ${error ? "has-error" : ""}`}>
        <input
          ref={inputRef}
          type="tel"
          id={field?.name}
          name={field.name}
          placeholder={placeholder}
          className={`form-control ${error ? "is-invalid" : ""}`}
          maxLength={20}
          disabled={disabled}
          onInput={handleInputChange}
          onBlur={handleBlur}
          pattern="[0-9]*"
          inputMode="numeric"
        />
      </div>
      {errorFieldName && (
        <ErrorMessage name={errorFieldName} component="div" className="error" />
      )}
    </div>
  );
};

export default PhoneNumberInput;
