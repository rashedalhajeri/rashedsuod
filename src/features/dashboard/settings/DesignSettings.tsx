
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PaintBucket, ExternalLink } from "lucide-react";
import StoreThemes from "@/features/dashboard/components/StoreThemes";
import { Button } from "@/components/ui/button";
import { getStoreUrl } from "@/utils/url-utils";

interface DesignSettingsProps {
  storeData: any;
}

const DesignSettings: React.FC<DesignSettingsProps> = ({ storeData }) => {
  // Generate the store URL using the utility function
  const storeUrl = getStoreUrl(storeData);
    
  // Handle store navigation in the same tab
  const navigateToStore = () => {
    if (storeUrl) {
      window.location.href = storeUrl;
    }
  };
  
  return (
    <div className="space-y-4">
      <Card className="border-primary/10 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PaintBucket className="h-5 w-5 text-primary" />
            <span>تصميم المتجر</span>
          </CardTitle>
          <CardDescription>قم بتخصيص مظهر متجرك وثيم التصميم الذي يناسب علامتك التجارية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={navigateToStore}
            >
              <ExternalLink className="h-4 w-4" />
              <span>معاينة وتحرير المتجر مباشرة</span>
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              يمكنك الآن معاينة متجرك وتحرير التصميم بشكل مباشر
            </p>
          </div>
          <StoreThemes storeId={storeData?.id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignSettings;
