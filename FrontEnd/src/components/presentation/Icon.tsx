import React from "react";
import type { LucideIcon } from "lucide-react";

export const Icon: React.FC<{ icon: LucideIcon; className?: string }> = ({
  icon: IconComp,
  className = "",
}) => {
  return <IconComp className={className} />;
};
