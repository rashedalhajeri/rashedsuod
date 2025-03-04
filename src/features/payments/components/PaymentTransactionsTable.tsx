
import React, { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useStoreData, getCurrencyFormatter } from "@/hooks/use-store-data";
import { Check, X, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface Transaction {
  id: string;
  orderNumber: string;
  amount: number;
  status: "successful" | "failed" | "pending" | "refunded";
  method: string;
  date: string;
  customerName: string;
}

// بيانات افتراضية للمعاملات، يمكن استبدالها بالبيانات الفعلية من قاعدة البيانات
const demoTransactions: Transaction[] = [
  {
    id: "txn-1",
    orderNumber: "10045",
    amount: 450,
    status: "successful",
    method: "بطاقة ائتمان",
    date: "2023-07-15T08:30:00Z",
    customerName: "محمد أحمد"
  },
  {
    id: "txn-2",
    orderNumber: "10046",
    amount: 320.50,
    status: "pending",
    method: "تحويل بنكي",
    date: "2023-07-14T14:20:00Z",
    customerName: "سارة علي"
  },
  {
    id: "txn-3",
    orderNumber: "10044",
    amount: 145.75,
    status: "failed",
    method: "بطاقة ائتمان",
    date: "2023-07-14T11:15:00Z",
    customerName: "خالد محمد"
  },
  {
    id: "txn-4",
    orderNumber: "10043",
    amount: 560,
    status: "refunded",
    method: "بطاقة ائتمان",
    date: "2023-07-13T16:40:00Z",
    customerName: "أحمد سعيد"
  },
  {
    id: "txn-5",
    orderNumber: "10042",
    amount: 220.25,
    status: "successful",
    method: "نقد عند الاستلام",
    date: "2023-07-12T09:10:00Z",
    customerName: "نورة عبدالله"
  }
];

const PaymentTransactionsTable: React.FC = () => {
  const { data: storeData } = useStoreData();
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'SAR');
  const [transactions] = useState<Transaction[]>(demoTransactions);
  
  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case "successful":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 transition-colors">
            <Check className="h-3 w-3 mr-1" />
            <span>ناجحة</span>
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 transition-colors">
            <Clock className="h-3 w-3 mr-1" />
            <span>معلقة</span>
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 transition-colors">
            <X className="h-3 w-3 mr-1" />
            <span>فاشلة</span>
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 transition-colors">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>مستردة</span>
          </Badge>
        );
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: ar 
      });
    } catch (err) {
      return dateString;
    }
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>آخر المعاملات المالية</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">رقم الطلب</TableHead>
              <TableHead className="text-center">العميل</TableHead>
              <TableHead className="text-center">المبلغ</TableHead>
              <TableHead className="text-center">طريقة الدفع</TableHead>
              <TableHead className="text-center">الحالة</TableHead>
              <TableHead className="text-center">التاريخ</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className={cn(
                "hover:bg-gray-50 transition-colors",
                transaction.status === "failed" && "bg-red-50",
                transaction.status === "pending" && "bg-amber-50",
              )}>
                <TableCell className="text-center font-medium">{transaction.orderNumber}</TableCell>
                <TableCell className="text-center">{transaction.customerName}</TableCell>
                <TableCell className="text-center font-medium">{formatCurrency(transaction.amount)}</TableCell>
                <TableCell className="text-center">{transaction.method}</TableCell>
                <TableCell className="text-center">{getStatusBadge(transaction.status)}</TableCell>
                <TableCell className="text-center">{formatDate(transaction.date)}</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-primary-600">
                    التفاصيل
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaymentTransactionsTable;
