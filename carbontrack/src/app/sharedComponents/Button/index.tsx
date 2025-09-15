import React from "react";

type ButtonVariant = "primary" | "secondary" | "create" | "save" | "default";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-[#2A4759] text-white p-2 font-bold hover:bg-[#F79B72] transition-colors duration-400 ease-in-out",
  secondary: "w-full p-3 bg-[#F79B72] text-white rounded-md font-bold text-[1.4rem] mt-2 hover:bg-[#F8B88F] transition disabled:opacity-60 drop-shadow-lg",
  create: "bg-[#2A4759] p-4 text-white font-bold text-[20px] hover:bg-[#F79B72] transition-colors duration-400 ease-in-out flex items-center gap-2",
  save: "bg-[#F79B72] text-white font-bold p-2 hover:bg-[#2A4759] transition-colors duration-400 ease-in-out",
  default: "bg-[#F79B72] text-white p-2",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonText: string;
  variant: ButtonVariant;
  onclickHandler?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  buttonText,
  variant,
  onclickHandler,
  icon,
  type = "button",
  disabled = false,
  className = "",
  ...props
}) => {
  const variantStyles = buttonVariants[variant] || buttonVariants.default;

  return (
    <button
      className={`${variantStyles} px-[12px] cursor-pointer rounded-md border-none ${className}`}
      onClick={onclickHandler}
      type={type}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {buttonText}
    </button>
  );
};

export default Button;