
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { normalizeStoreDomain } from "@/utils/url-helpers";

interface StorePreviewProps {
  storeName: string;
  storeDomain: string;
  logoUrl: string | null;
}

const StorePreview: React.FC<StorePreviewProps> = ({
  storeName,
  storeDomain,
  logoUrl
}) => {
  // Generate the store URL from the domain
  const cleanDomain = normalizeStoreDomain(storeDomain);
  const storeUrl = cleanDomain ? `/store/${cleanDomain}` : '';
  const fullStoreUrl = `${window.location.origin}${storeUrl}`;
  
  // Get app domain from environment variables
  const appDomain = import.meta.env.VITE_APP_DOMAIN || window.location.origin;
  
  // Format displayed URL for cleaner presentation
  const displayUrl = cleanDomain ? `${cleanDomain}.linok.me` : 'متجرك';
  
  const handleOpenStore = () => {
    if (storeUrl) {
      window.open(storeUrl, "_blank");
    }
  };
  
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <div className="bg-gradient-to-r from-primary/30 to-transparent p-4 border-b">
        <h3 className="text-lg font-semibold">معاينة المتجر</h3>
        <p className="text-sm text-muted-foreground">
          هكذا سيظهر متجرك للعملاء
        </p>
      </div>
      
      <CardContent className="p-0">
        <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
          {/* Store Logo */}
          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={storeName} 
                className="w-full h-full object-contain" 
              />
            ) : (
              <div className="text-4xl font-bold text-gray-300">
                {storeName ? storeName.charAt(0).toUpperCase() : "S"}
              </div>
            )}
          </div>
          
          {/* Store Info */}
          <div className="flex-1 text-center md:text-right">
            <h2 className="text-xl font-bold mb-2">{storeName || "اسم المتجر"}</h2>
            <div className="text-sm text-muted-foreground mb-4">
              <span className="font-medium">{displayUrl}</span>
            </div>
            
            <Button 
              onClick={handleOpenStore}
              variant="default"
              className="gap-2"
              disabled={!cleanDomain}
            >
              <ExternalLink size={16} />
              زيارة المتجر
            </Button>
          </div>
        </div>
        
        {/* Store URL Card */}
        <div className="bg-muted p-4 rounded-b-lg">
          <p className="text-xs text-muted-foreground mb-2">
            رابط المتجر الخاص بك:
          </p>
          <div className="flex items-center gap-2 bg-background rounded border p-2">
            <div className="text-sm text-primary font-mono truncate flex-1 overflow-hidden">
              {fullStoreUrl}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(fullStoreUrl);
                // يمكن إضافة إشعار بالنسخ هنا
              }}
              className="h-7 text-xs"
            >
              نسخ
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorePreview;
