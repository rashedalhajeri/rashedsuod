
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface UnderDevelopmentPageProps {
  message: string;
}

const UnderDevelopmentPage: React.FC<UnderDevelopmentPageProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">قيد التطوير</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">
              نحن نعمل على تطوير هذه الميزة وستكون متاحة قريبًا.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnderDevelopmentPage;
