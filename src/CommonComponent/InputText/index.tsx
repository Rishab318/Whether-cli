import { ErrorMessage, FieldProps } from "formik";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Password } from "primereact/password";
import { useState } from "react";
interface PopoverContentType {
  title: string;
  items: object;
}
const Input: React.FC<
  FieldProps & {
    label: string;
    errorFieldName: string;
    placeholder?: string;
    inputIcon?: string;
    disabled?: boolean;
    password?: boolean;
    value: any;
    onChange?: (data: string | undefined) => void;
    popoverContent?: PopoverContentType;
    maxLength?: number;
    type?: string;
  }
> = ({
  field,
  label,
  errorFieldName,
  placeholder,
  inputIcon,
  disabled,
  password,
  value,
  maxLength,
  type,
  onChange,
  // popoverContent = {
  //   title: "ID Number Validation Guide",
  //   items: {
  //     NIF: "B1234567C",
  //     NIE: "X1234567A",
  //     DNI: "B1234567C",
  //     Passport: "1234567890QW",
  //     EU: "B1234567C",
  //   },
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [postCode, setPostCode] = useState("");
  const handleClose = () => {
    setIsPopoverOpen(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e);
    if (onChange) {
      onChange(e.target.value || undefined);
    }
  };

  return password ? (
    <div
      className={`input-container ${
        field?.name === "ICCIDNumber" ? "mb-md-2 mb-1" : ""
      }`}
    >
      <div className="d-flex">
        <label htmlFor={field?.name} className="inputLabel">
          {label}
        </label>
      </div>

      <Password
        {...field}
        id={field?.name}
        className="input-text"
        placeholder={placeholder}
        disabled={disabled || false}
        onChange={handleChange}
        value={value}
        toggleMask
      />
      <ErrorMessage name={errorFieldName} component="div" className="error" />
    </div>
  ) : inputIcon ? (
    <div className="input-container">
      <label htmlFor={field?.name} className="inputLabel">
        {label}
      </label>

      <IconField>
        <InputText
          {...field}
          id={field?.name}
          className="input-text"
          placeholder={placeholder}
          disabled={disabled || false}
          onChange={handleChange}
          value={value}
          maxLength={maxLength}
          type={type}
        />
        <InputIcon className={inputIcon} />
      </IconField>
      <ErrorMessage name={errorFieldName} component="div" className="error" />
    </div>
  ) : (
    <div
      className={`input-container ${
        field?.name === "ICCIDNumber" ? "mb-md-2 mb-1" : ""
      }`}
    >
      <div className="d-flex">
        <label htmlFor={field?.name} className="inputLabel">
          {label}
        </label>
      </div>

      <InputText
        {...field}
        id={field?.name}
        className="input-text"
        placeholder={placeholder}
        disabled={disabled || false}
        onChange={handleChange}
        value={value}
        maxLength={maxLength}
        type={type}
      />
      <ErrorMessage name={errorFieldName} component="div" className="error" />
    </div>
  );
};

export default Input;
