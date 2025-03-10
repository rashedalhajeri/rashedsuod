
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink } from "lucide-react";

interface StorePreviewButtonProps {
  storeUrl?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showExternalIcon?: boolean;
}

const StorePreviewButton: React.FC<StorePreviewButtonProps> = ({ 
  storeUrl, 
  className, 
  variant = "default", 
  size = "sm",
  showExternalIcon = false 
}) => {
  const handleClick = () => {
    if (!storeUrl) return;
    
    // تحويل اسم النطاق إلى أحرف صغيرة لضمان التوافق
    const lowerCaseUrl = storeUrl.toLowerCase();
    
    // التحقق مما إذا كان الرابط يبدأ بـ http أو / لتحديد ما إذا كان مطلقًا أو نسبيًا
    let fullUrl = lowerCaseUrl;
    if (!lowerCaseUrl.startsWith('http') && !lowerCaseUrl.startsWith('/')) {
      fullUrl = `/${lowerCaseUrl}`;
    }
    
    // فتح في علامة تبويب جديدة
    window.open(fullUrl, '_blank');
  };

  return (
    <Button 
      size={size} 
      className={`flex items-center gap-1.5 ${className || ''}`}
      variant={variant}
      onClick={handleClick}
    >
      {showExternalIcon ? (
        <ExternalLink className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
      معاينة المتجر
    </Button>
  );
};

export default StorePreviewButton;
