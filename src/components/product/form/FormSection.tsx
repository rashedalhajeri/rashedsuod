
import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormSectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  titleIcon?: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ 
  children, 
  title, 
  description, 
  className = "",
  titleIcon
}) => {
  if (title) {
    return (
      <Card className={`shadow-sm ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            {titleIcon}
            {title}
          </CardTitle>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className={`space-y-6 ${className}`}>
      {children}
    </div>
  );
};

export default FormSection;
