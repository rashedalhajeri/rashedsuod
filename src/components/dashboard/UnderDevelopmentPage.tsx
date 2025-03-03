
import React from "react";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface UnderDevelopmentPageProps {
  message?: string;
  returnPath?: string;
  returnLabel?: string;
}

const UnderDevelopmentPage: React.FC<UnderDevelopmentPageProps> = ({ 
  message = "هذه الصفحة قيد التطوير",
  returnPath = "/dashboard",
  returnLabel = "العودة للوحة التحكم"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6"
      >
        <Construction className="h-8 w-8 text-yellow-600" />
      </motion.div>
      
      <h1 className="text-2xl font-bold mb-2">قيد التطوير</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        {message}. سيتم إطلاق هذه الميزة قريبًا.
      </p>
      
      <Button asChild>
        <Link to={returnPath}>{returnLabel}</Link>
      </Button>
    </div>
  );
};

export default UnderDevelopmentPage;
