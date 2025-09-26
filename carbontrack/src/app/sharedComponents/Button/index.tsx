import React from "react";

interface ButtonProps{
    buttonText: string,
    variant: string,
    onclickHandler?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    icon?: React.ReactNode,
    type?: "button" | "submit" ;
}
const Button = ({buttonText, variant, onclickHandler, icon, type="button"}: ButtonProps)=>{
    const buttonVariants=()=>{
        switch(variant){
            case "primary":
                return 'bg-[#2A4759] text-white p-2 w-70 h-15 font-bold hover:bg-[#F79B72] transition-colors duration-400 ease-in-out'
            case "secondary":
                return 'w-full p-3 bg-[#F79B72] text-white rounded-md font-bold text-[1.4rem] mt-2 hover:bg-[#f8b88f] transition disabled:opacity-60 drop-shadow-lg '
            case "create":
                return 'bg-[#2A4759]  p-4 w-50 h-17 text-white  font-bold text-[20px] hover:bg-[#F79B72] transition-colors duration-400 ease-in-out '
            case "update":
                return 'bg-[#2A4759]  p-2 w-40 h-15 text-white  font-bold text-[20px] hover:bg-[#F79B72] transition-colors duration-400 ease-in-out '    
            case "save":
                return 'bg-[#F79B72] text-white font-bold  p-2 w-50 h-15 hover:bg-[#2A4759] transition-colors duration-400 ease-in-out';
            default:
                return'bg-[#F79B72] text-white p-2 w-45 h-15 font-bold'
        }
    }
    const variantStyles = buttonVariants();
    return(
        <button
            className={`${variantStyles} px-[12px] cursor-pointer rounded-md border-none`}
            onClick={onclickHandler}
            type={type}
        >
            {icon && <span>{icon}</span>}
            {buttonText}
        </button>
    );
};
export default Button;

