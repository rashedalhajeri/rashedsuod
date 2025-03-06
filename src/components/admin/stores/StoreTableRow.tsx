
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Store, X, Check } from "lucide-react";
import { 
  Dialog, 
  DialogTrigger 
} from "@/components/ui/dialog";
import StoreStatusBadge from "./StoreStatusBadge";
import StoreDetailsDialog from "./StoreDetailsDialog";

interface StoreTableRowProps {
  store: {
    id: string;
    store_name: string;
    domain_name: string;
    user_id: string;
    status: string;
    subscription_plan: string;
    created_at: string;
    suspension_reason?: string | null;
  };
  formattedDate: string;
  onSuspend: (id: string) => void;
  onActivate: (id: string) => void;
}

const StoreTableRow: React.FC<StoreTableRowProps> = ({
  store,
  formattedDate,
  onSuspend,
  onActivate
}) => {
  return (
    <TableRow key={store.id} className="group hover:bg-gray-50">
      <TableCell className="font-medium">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 ml-2">
            <Store className="h-4 w-4" />
          </div>
          <span>{store.store_name}</span>
        </div>
      </TableCell>
      <TableCell>{store.domain_name}.linok.me</TableCell>
      <TableCell>
        <div className="flex items-center">
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mr-2">
            {store.subscription_plan}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="h-3 w-3 mr-1" />
          {formattedDate}
        </div>
      </TableCell>
      <TableCell>
        <StoreStatusBadge status={store.status} />
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                التفاصيل
              </Button>
            </DialogTrigger>
            <StoreDetailsDialog 
              store={store}
              formattedDate={formattedDate}
              onSuspend={onSuspend}
              onActivate={onActivate}
            />
          </Dialog>
          
          {store.status === 'active' ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2 text-xs text-red-600 border-red-300 hover:bg-red-50"
              onClick={() => onSuspend(store.id)}
            >
              <X className="h-3 w-3 ml-1" />
              تعليق
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2 text-xs text-green-600 border-green-300 hover:bg-green-50"
              onClick={() => onActivate(store.id)}
            >
              <Check className="h-3 w-3 ml-1" />
              تفعيل
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default StoreTableRow;
