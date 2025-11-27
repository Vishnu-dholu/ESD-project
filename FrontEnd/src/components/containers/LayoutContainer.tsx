import React from "react";

const LayoutContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>;

export default LayoutContainer;
