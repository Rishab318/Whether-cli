import React, { FC } from "react";
import { RadioButton } from "primereact/radiobutton";
import { FieldProps } from "formik";
import { ErrorMessage } from "formik";
interface RadioButtonOption {
  value: string;
  label: string;
  errorFieldName: string;
}

interface RadioButtonProps {
  options: RadioButtonOption[];
  errorFieldName: string;
}

const RadioOption: FC<
  RadioButtonProps & FieldProps & { disabled: boolean }
> = ({ field, form, options, disabled, errorFieldName }) => {
  return (
    <div className="d-flex-column">
      <div className="radio-container d-flex align-center mb-3">
        {options.map((option) => (
          <div className="check" key={option.value}>
            <RadioButton
              inputId={option.value}
              name={field.name}
              value={option.value}
              onChange={(e) => form.setFieldValue(field.name, e.value)}
              checked={field.value === option.value}
              disabled={disabled}
            />
            <label htmlFor={option.value} className="checkBoxLabel">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      <div className="error">
        <ErrorMessage name={errorFieldName} component="div" className="error" />
      </div>
    </div>
  );
};

export default RadioOption;
