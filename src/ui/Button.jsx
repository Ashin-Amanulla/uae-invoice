import { forwardRef } from "react";

const Button = forwardRef(
  (
    {
      className = "",
      variant = "primary",
      size = "default",
      type = "button",
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "btn-effect inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm",
      secondary:
        "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 shadow-sm",
      outline:
        "border border-blue-500 text-blue-600 hover:bg-blue-50 shadow-sm",
      ghost: "text-gray-700 hover:bg-gray-100",
      link: "underline-offset-4 hover:underline text-blue-600",
      destructive:
        "text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm",
    };

    const sizes = {
      default: "h-10 py-2 px-4 text-sm",
      sm: "h-8 px-3 text-xs",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        type={type}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
