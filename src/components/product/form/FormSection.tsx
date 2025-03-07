
import React, { ReactNode } from "react";

interface FormSectionProps {
  children: ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ children, className = "" }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {children}
    </div>
  );
};

export default FormSection;
