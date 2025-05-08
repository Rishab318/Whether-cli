import React, { FC } from "react";
import { ErrorMessage, FieldProps } from "formik";
import { Dropdown } from "primereact/dropdown";
import { Disabled } from "@/Constant";
import { useFormikContext } from "formik";
interface DropdownMenuProps extends FieldProps {
  options: { name: string; code: string }[];
  placeholder: string;
  value?: string;
  label: string;
  errorFieldName?: string;
  onSelectValue: (value: any) => void;
  disabled?: boolean;
  className?: string;
}

const DropdownMenu: FC<DropdownMenuProps> = ({
  field,
  value,
  form, // We no longer need to pass this explicitly
  options,
  placeholder,
  label,
  errorFieldName,
  onSelectValue,
  disabled,
  className,
}) => {
  const { setFieldValue, setFieldTouched, touched } = useFormikContext(); // Access form context

  const handleChange = (e: any) => {
    setFieldValue(field.name, e.value.code); // Set the selected value
    onSelectValue && onSelectValue(e?.value?.code); // Call onSelectValue handler
  };

  return (
    <div className="drop-down-container">
      <label htmlFor={field.name} className="inputLabel">
        {label}
      </label>
      <Dropdown
        {...field}
        id={field?.name}
        value={options?.find((opt) => opt.code === field.value)} // Set dropdown value based on formik value
        onChange={handleChange}
        onBlur={() => setFieldTouched(field.name, true)} // Mark field as touched on blur
        options={options}
        optionLabel="name"
        placeholder={placeholder}
        disabled={disabled}
        panelClassName={className}
      />
      {errorFieldName && (
        <ErrorMessage name={errorFieldName} component="div" className="error" />
      )}
    </div>
  );
};

export default DropdownMenu;
