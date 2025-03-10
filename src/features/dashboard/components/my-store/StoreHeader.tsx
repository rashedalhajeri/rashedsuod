
import React from "react";
import StorePreviewButton from "@/features/dashboard/components/StorePreviewButton";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  ShoppingBag, 
  Edit, 
  Layers 
} from "lucide-react";

interface StoreHeaderProps {
  storePreviewUrl?: string;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ storePreviewUrl }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">متجري</h1>
        <p className="text-muted-foreground">
          إدارة متجرك الإلكتروني وتخصيصه
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <StorePreviewButton 
          storeUrl={storePreviewUrl}
          variant="outline" 
          showExternalIcon={true}
        />
        
        <Button 
          variant="outline" 
          size="sm"
          className="gap-1.5"
          onClick={() => window.location.href = '/dashboard/settings?tab=store'}
        >
          <Settings className="h-4 w-4" />
          الإعدادات
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="gap-1.5"
          onClick={() => window.location.href = '/dashboard/products'}
        >
          <ShoppingBag className="h-4 w-4" />
          المنتجات
        </Button>
      </div>
    </div>
  );
};

export default StoreHeader;
