
import React from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useStoreData } from "@/hooks/use-store-data";

const SubscriptionPlans: React.FC = () => {
  const { data: storeData, isLoading } = useStoreData();
  const currentPlan = storeData?.subscription_plan || "free";
  const [selectedPlan, setSelectedPlan] = React.useState<"free" | "basic" | "premium">(
    currentPlan as "free" | "basic" | "premium"
  );
  
  const handleSelectPlan = (plan: "free" | "basic" | "premium") => {
    setSelectedPlan(plan);
  };
  
  const handleSubscribe = () => {
    if (selectedPlan === currentPlan) {
      toast.info(`أنت مشترك بالفعل في الباقة ${getPlanNameInArabic(selectedPlan)}`);
      return;
    }
    
    toast.success(`تم اختيار الباقة ${getPlanNameInArabic(selectedPlan)} بنجاح!`);
  };
  
  // Helper function to get plan name in Arabic
  const getPlanNameInArabic = (plan: string) => {
    switch (plan) {
      case "free":
        return "المجانية";
      case "basic":
        return "الأساسية";
      case "premium":
        return "الاحترافية";
      default:
        return "";
    }
  };
  
  if (isLoading) {
    return <div className="p-4 text-center">جاري تحميل بيانات الاشتراك...</div>;
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">اختر الباقة المناسبة لمتجرك</h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <div 
          className={`border rounded-xl p-6 transition-all ${
            selectedPlan === "free" 
              ? "border-primary-400 bg-primary-50/50 shadow-sm" 
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => handleSelectPlan("free")}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-bold">الباقة المجانية</h4>
              <p className="text-gray-500 text-sm mt-1">للمتاجر الجديدة</p>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary-400 bg-white">
              {selectedPlan === "free" && (
                <Check size={14} className="text-primary-500" />
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <span className="text-3xl font-bold">0</span>
            <span className="text-lg font-medium text-gray-700"> د.ك</span>
            <span className="text-gray-500 mr-1">/ شهر واحد</span>
          </div>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2">
              <Check size={18} className="text-primary-500" />
              <span className="text-gray-700">عدد محدود من المنتجات (10 منتجات)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={18} className="text-primary-500" />
              <span className="text-gray-700">الدفع عند الاستلام فقط</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={18} className="text-primary-500" />
              <span className="text-gray-700">تخصيص بسيط للمتجر</span>
            </li>
            <li className="flex items-center gap-2">
              <X size={18} className="text-gray-400" />
              <span className="text-gray-400">الدعم الفني</span>
            </li>
            <li className="flex items-center gap-2">
              <X size={18} className="text-gray-400" />
              <span className="text-gray-400">تحليلات المبيعات</span>
            </li>
            <li className="flex items-center gap-2">
              <X size={18} className="text-gray-400" />
              <span className="text-gray-400">ربط مع المنصات الاجتماعية</span>
            </li>
          </ul>
          
          <Button 
            variant={selectedPlan === "free" ? "default" : "outline"} 
            className="w-full"
            onClick={handleSubscribe}
          >
            {selectedPlan === "free" && currentPlan === "free" ? "الباقة الحالية" : "اختيار هذه الباقة"}
          </Button>
        </div>
        
        {/* Basic Plan */}
        <div 
          className={`border rounded-xl p-6 transition-all ${
            selectedPlan === "basic" 
              ? "border-primary-400 bg-primary-50/50 shadow-sm" 
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => handleSelectPlan("basic")}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-bold">الباقة الأساسية</h4>
              <p className="text-gray-500 text-sm mt-1">للمتاجر الصغيرة والناشئة</p>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary-400 bg-white">
              {selectedPlan === "basic" && (
                <Check size={14} className="text-primary-500" />
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <span className="text-3xl font-bold">90</span>
            <span className="text-lg font-medium text-gray-700"> د.ك</span>
            <span className="text-gray-500 mr-1">/ 6 أشهر</span>
          </div>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2">
              <Check size={18} className="text-primary-500" />
              <span className="text-gray-700">عدد منتجات محدود (50 منتج)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={18} className="text-primary-500" />
              <span className="text-gray-700">طرق دفع محدودة</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={18} className="text-primary-500" />
              <span className="text-gray-700">تخصيص بسيط للمتجر</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={18} className="text-primary-500" />
              <span className="text-gray-700">دعم فني عبر البريد الإلكتروني</span>
            </li>
            <li className="flex items-center gap-2">
              <X size={18} className="text-gray-400" />
              <span className="text-gray-400">تحليلات متقدمة للمبيعات</span>
            </li>
            <li className="flex items-center gap-2">
              <X size={18} className="text-gray-400" />
              <span className="text-gray-400">ربط مع المنصات الاجتماعية</span>
            </li>
          </ul>
          
          <Button 
            variant={selectedPlan === "basic" ? "default" : "outline"} 
            className="w-full"
            onClick={handleSubscribe}
          >
            {selectedPlan === "basic" && currentPlan === "basic" ? "الباقة الحالية" : "اختيار هذه الباقة"}
          </Button>
        </div>
        
        {/* Premium Plan */}
        <div 
          className={`border rounded-xl p-6 transition-all ${
            selectedPlan === "premium" 
              ? "border-primary-400 bg-primary-50/50 shadow-sm" 
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => handleSelectPlan("premium")}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-bold">الباقة الاحترافية</h4>
              <p className="text-gray-500 text-sm mt-1">للمتاجر المتوسطة والكبيرة</p>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary-400 bg-white">
              {selectedPlan === "premium" && (
                <Check size={14} className="text-primary-500" />
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <span className="text-3xl font-bold">150</span>
            <span className="text-lg font-medium text-gray-700"> د.ك</span>
            <span className="text-gray-500 mr-1">/ 6 أشهر</span>
          </div>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2">
              <Check size={18} className="text-primary-500" />
              <span className="text-gray-700">عدد غير محدود من المنتجات</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={18} className="text-primary-500" />
              <span className="text-gray-700">جميع طرق الدفع</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={18} className="text-primary-500" />
              <span className="text-gray-700">تخصيص كامل للمتجر</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={18} className="text-primary-500" />
              <span className="text-gray-700">دعم فني على مدار الساعة</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={18} className="text-primary-500" />
              <span className="text-gray-700">تحليلات متقدمة للمبيعات</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={18} className="text-primary-500" />
              <span className="text-gray-700">ربط مع المنصات الاجتماعية</span>
            </li>
          </ul>
          
          <Button 
            variant={selectedPlan === "premium" ? "default" : "outline"}
            className="w-full"
            onClick={handleSubscribe}
          >
            {selectedPlan === "premium" && currentPlan === "premium" ? "الباقة الحالية" : "ترقية إلى هذه الباقة"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
