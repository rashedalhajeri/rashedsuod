
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Palette } from "lucide-react";

const StoreTips: React.FC = () => {
  return (
    <Card className="overflow-hidden shadow-sm border-none">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-3">
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          نصائح لتحسين المتجر
        </CardTitle>
        <CardDescription>
          إليك بعض النصائح التي تساعدك على تحسين مظهر وأداء متجرك
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 border rounded-md bg-amber-50/50">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h3 className="font-medium text-amber-900">قم بإضافة شعار متجرك</h3>
              <p className="text-sm text-amber-700 mt-1">
                يساعد شعار المتجر المميز على تعزيز هوية علامتك التجارية وجعلها أكثر احترافية وسهلة التذكر للعملاء.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 border rounded-md bg-emerald-50/50">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h3 className="font-medium text-emerald-900">أضف بنرات ترويجية جذابة</h3>
              <p className="text-sm text-emerald-700 mt-1">
                البنرات الترويجية تساعد في عرض العروض والمنتجات الجديدة وجذب انتباه العملاء لزيادة المبيعات.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 border rounded-md bg-blue-50/50">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h3 className="font-medium text-blue-900">أبرز مميزات متجرك</h3>
              <p className="text-sm text-blue-700 mt-1">
                عرض مميزات متجرك مثل الشحن السريع أو الدفع الآمن يزيد من ثقة العملاء ويحسن تجربة الشراء.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreTips;
