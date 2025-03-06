
import React from "react";
import { Store, ArrowUpDown } from "lucide-react";
import { useFormatter } from "@/hooks/use-formatter";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import StoreTableRow from "./StoreTableRow";

interface StoreData {
  id: string;
  store_name: string;
  domain_name: string;
  user_id: string;
  status: string;
  subscription_plan: string;
  subscription_end_date: string | null;
  created_at: string;
  suspension_reason?: string | null;
}

interface StoresTableProps {
  stores: StoreData[];
  isLoading: boolean;
  onSuspend: (id: string) => void;
  onActivate: (id: string) => void;
}

const StoresTable: React.FC<StoresTableProps> = ({
  stores,
  isLoading,
  onSuspend,
  onActivate
}) => {
  const formatter = useFormatter();
  
  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!stores || stores.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <Store className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد متاجر</h3>
        <p className="text-gray-500">لم يتم العثور على متاجر مطابقة للفلتر المحدد.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <div className="flex items-center">
                اسم المتجر
                <ArrowUpDown className="h-3 w-3 text-gray-400 mr-1" />
              </div>
            </TableHead>
            <TableHead>النطاق</TableHead>
            <TableHead>خطة الاشتراك</TableHead>
            <TableHead>تاريخ الإنشاء</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="text-left">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.map((store) => (
            <StoreTableRow
              key={store.id}
              store={store}
              formattedDate={formatter.date(new Date(store.created_at))}
              onSuspend={onSuspend}
              onActivate={onActivate}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StoresTable;
