import { CheckboxProps, Checkbox as CustomCheckbox } from "primereact/checkbox";
import React from "react";

interface CustomCheckboxProps extends CheckboxProps {}

const Checkbox: React.FC<CustomCheckboxProps> = ({
  onBlur,
  name,
  disabled,
  ...props
}) => {
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur && name) {
      // Create a synthetic event compatible with Formik
      const syntheticEvent = {
        ...event,
        target: { ...event?.target, name }, // Ensure the `name` property is included
        persist: () => {}, // Provide a no-op persist function
      };
      onBlur(syntheticEvent as React.FocusEvent<HTMLInputElement>);
    }
  };

  return (
    <CustomCheckbox
      {...props}
      name={name}
      onBlur={handleBlur}
      disabled={disabled}
    />
  );
};

export default Checkbox;
