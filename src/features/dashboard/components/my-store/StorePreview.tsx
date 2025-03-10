import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { BellRing, Eye, ExternalLink, Layout, PencilRuler, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import PromoBanner from "@/components/store/banner/PromoBanner";
import { getBaseDomain, normalizeStoreDomain } from "@/utils/url-helpers";

interface StorePreviewProps {
  storeName: string;
  storeDomain: string;
  logoUrl: string | null;
}

const StorePreview: React.FC<StorePreviewProps> = ({ storeName, storeDomain, logoUrl }) => {
  const normalizedDomain = normalizeStoreDomain(storeDomain);
  
  const handleStoreOpen = () => {
    const fullUrl = `${getBaseDomain()}/store/${normalizedDomain}`;
    window.open(fullUrl, '_blank');
  };
  
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5 text-primary" />
            معاينة المتجر
          </CardTitle>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-xs flex items-center gap-1"
            onClick={() => window.open(`/store/${storeDomain}`, '_blank')}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            فتح في نافذة جديدة
          </Button>
        </div>
        <CardDescription>
          هذه معاينة لكيفية ظهور متجرك للعملاء
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-b">
          <div className="bg-white/50 flex items-center justify-between p-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {logoUrl && (
                <div className="w-8 h-8 rounded-md overflow-hidden bg-white shadow-sm flex items-center justify-center">
                  <img src={logoUrl} alt="شعار المتجر" className="w-full h-full object-contain" />
                </div>
              )}
              <span className="font-semibold">{storeName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                متصل
              </span>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs flex items-center gap-1 h-7"
                onClick={handleStoreOpen}
              >
                <Eye className="h-3 w-3" />
                زيارة المتجر
              </Button>
            </div>
          </div>
          
          <div className="p-0">
            <PromoBanner storeDomain={normalizedDomain} />
            
            <div className="text-center py-10 bg-gray-50 mt-2 mx-2 mb-2 rounded-md border border-dashed border-gray-200">
              <Store className="w-10 h-10 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium mb-1">معاينة منتجات المتجر</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mt-2 px-4">
                هنا سيتم عرض منتجات متجرك بتنسيق جذاب. قم بإضافة منتجات من خلال قسم المنتجات.
              </p>
              <Button 
                variant="link" 
                size="sm" 
                className="mt-3"
                asChild
              >
                <a href="/dashboard/products">
                  إضافة منتجات
                  <PencilRuler className="h-3.5 w-3.5 mr-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-primary/5 to-primary/10 py-3 flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground">
          <BellRing className="h-3.5 w-3.5 mr-1.5" />
          يمكنك معاينة التغييرات فوراً بعد تطبيقها
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs flex items-center gap-1 border-primary/20 bg-white"
          onClick={handleStoreOpen}
        >
          <Eye className="h-3.5 w-3.5" />
          معاينة كاملة
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StorePreview;
