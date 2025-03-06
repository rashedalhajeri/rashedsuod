
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Store, Package, User, Calendar } from "lucide-react";

interface StoreDetailsDialogProps {
  store: {
    id: string;
    store_name: string;
    subscription_plan: string;
    user_id: string;
    created_at: string;
    status: string;
    suspension_reason?: string | null;
  };
  formattedDate: string;
  onSuspend: (id: string) => void;
  onActivate: (id: string) => void;
}

const StoreDetailsDialog: React.FC<StoreDetailsDialogProps> = ({
  store,
  formattedDate,
  onSuspend,
  onActivate
}) => {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>تفاصيل المتجر</DialogTitle>
        <DialogDescription>
          معلومات مفصلة عن المتجر
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <Store className="h-5 w-5 text-gray-500 ml-2" />
            <span className="text-sm font-semibold">اسم المتجر:</span>
            <span className="text-sm mr-1">{store.store_name}</span>
          </div>
          <div className="flex items-center">
            <Package className="h-5 w-5 text-gray-500 ml-2" />
            <span className="text-sm font-semibold">الاشتراك:</span>
            <span className="text-sm mr-1">{store.subscription_plan}</span>
          </div>
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-500 ml-2" />
            <span className="text-sm font-semibold">معرف المستخدم:</span>
            <span className="text-sm mr-1 truncate" style={{ maxWidth: "200px" }}>{store.user_id}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-500 ml-2" />
            <span className="text-sm font-semibold">تاريخ الإنشاء:</span>
            <span className="text-sm mr-1">{formattedDate}</span>
          </div>
          {store.status === 'suspended' && (
            <div className="p-3 bg-red-50 rounded-md border border-red-200 text-sm text-red-700">
              <div className="font-semibold mb-1">سبب التعليق:</div>
              <div>{store.suspension_reason || "غير محدد"}</div>
            </div>
          )}
        </div>
      </div>
      <DialogFooter>
        {store.status === 'active' ? (
          <Button
            variant="destructive"
            onClick={() => onSuspend(store.id)}
          >
            تعليق المتجر
          </Button>
        ) : (
          <Button
            onClick={() => onActivate(store.id)}
            className="bg-green-600 hover:bg-green-700"
          >
            إعادة تفعيل المتجر
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

export default StoreDetailsDialog;
