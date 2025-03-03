
import React from "react";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface UnderDevelopmentPageProps {
  message?: string;
}

const UnderDevelopmentPage: React.FC<UnderDevelopmentPageProps> = ({ 
  message = "هذه الصفحة قيد التطوير"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
        <Construction className="h-8 w-8 text-yellow-600" />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">قيد التطوير</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        {message}. سيتم إطلاق هذه الميزة قريبًا.
      </p>
      
      <Button asChild>
        <Link to="/dashboard">العودة للوحة التحكم</Link>
      </Button>
    </div>
  );
};

export default UnderDevelopmentPage;
