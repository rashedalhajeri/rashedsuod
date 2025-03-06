
import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <React.Fragment key={step}>
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              currentStep === step
                ? "border-primary bg-primary text-white"
                : currentStep > step
                ? "border-green-500 bg-green-500 text-white"
                : "border-gray-300 text-gray-500"
            }`}
          >
            {currentStep > step ? <Check className="h-5 w-5" /> : step}
          </div>
          {step < totalSteps && (
            <div 
              className={`h-1 w-16 ${
                currentStep > step ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
