// CardContainer.tsx
import React from "react";

const CardContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <div
      className={`card p-4 md:p-6 ${className} app-enter app-enter-show`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default CardContainer;
