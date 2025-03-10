
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, ShoppingCart, Upload } from "lucide-react";

const StoreTips: React.FC = () => {
  return (
    <Card className="shadow-md border-none overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-yellow-100/80 to-transparent">
        <CardTitle className="text-lg">نصائح لتحسين متجرك</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-sm">إضافة منتجات للمتجر</p>
            <p className="text-xs text-muted-foreground mt-1">
              أضف منتجاتك مع صور عالية الجودة ووصف دقيق لزيادة فرص البيع.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="font-medium text-sm">إعداد وسائل الدفع</p>
            <p className="text-xs text-muted-foreground mt-1">
              لم تقم بإعداد وسائل الدفع بعد. قم بذلك من إعدادات المتجر لاستقبال الطلبات.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Upload className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-sm">رفع شعار للمتجر</p>
            <p className="text-xs text-muted-foreground mt-1">
              رفع شعار للمتجر يساعد في بناء هوية تجارية قوية ويزيد من ثقة العملاء.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <ShoppingCart className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-sm">اختبار عملية الشراء</p>
            <p className="text-xs text-muted-foreground mt-1">
              قم بتجربة عملية الشراء بنفسك للتأكد من سهولتها وخلوها من المشاكل.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreTips;
