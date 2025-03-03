
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  message?: string;
  retry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = "حدث خطأ أثناء تحميل البيانات", 
  retry 
}) => {
  return (
    <div className="w-full py-12 flex justify-center">
      <Card className="w-full max-w-md border border-red-100">
        <CardContent className="pt-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">عذراً، حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          
          {retry && (
            <Button 
              onClick={retry}
              className="bg-primary-500 hover:bg-primary-600"
            >
              إعادة المحاولة
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorState;
