import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "danger";
};

const variantClass = {
  primary: "btn btn-primary",
  ghost: "btn btn-ghost",
  outline: "btn btn-ghost border",
  danger: "btn bg-red-600 text-white hover:bg-red-700 shadow-md",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={`${variantClass[variant]} ${className} transition-transform duration-200 ease-out`}
    >
      {children}
    </button>
  );
}
