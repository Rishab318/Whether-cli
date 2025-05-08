import { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import React, { FC } from "react";
import Button from "@mui/material/Button";
import Image from "next/image";

// Extending ButtonProps to allow additional custom props (like `type`)
interface CustomButtonProps extends MuiButtonProps {
  btnName: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  startImg?: string;
  endImg?: string;
  disable?: boolean;
}

const CustomButton: FC<CustomButtonProps> = ({
  btnName,
  startIcon,
  endIcon,
  className,
  onClick,
  disable,
  startImg,
  endImg,
  type = "button", // Default to "button" if no type is provided
  ...rest // Spread other props (like `color`, `variant`, etc.)
}) => {
  return (
    <Button
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      disabled={disable}
      className={className}
      type={type} // Use `type` here, which is now part of the props
      {...rest} // Pass through any other props (like `color`, `variant`, etc.)
    >
      {startImg && <Image src={startImg} alt="start icon" />}
      {btnName}
      {endImg && <Image src={endImg} alt="end icon" />}
    </Button>
  );
};

export default CustomButton;
