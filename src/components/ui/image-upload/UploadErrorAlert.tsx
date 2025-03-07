
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface UploadErrorAlertProps {
  errorMessage: string;
  onRetry: () => void;
  isRetrying: boolean;
}

const UploadErrorAlert: React.FC<UploadErrorAlertProps> = ({
  errorMessage,
  onRetry,
  isRetrying
}) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTitle>خطأ في رفع الصور</AlertTitle>
      <AlertDescription className="flex flex-col space-y-2">
        <p>{errorMessage}</p>
        <Button 
          variant="outline" 
          size="sm"
          className="self-start mt-2 gap-2"
          onClick={onRetry}
          disabled={isRetrying}
        >
          <RotateCcw className="h-4 w-4" />
          إعادة المحاولة
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default UploadErrorAlert;
