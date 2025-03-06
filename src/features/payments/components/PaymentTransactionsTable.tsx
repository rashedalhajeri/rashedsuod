
import React, { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useStoreData, getCurrencyFormatter } from "@/hooks/use-store-data";
import { Check, X, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { fetchPayments, Payment } from "@/services/payment-service";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";

interface PaymentTransactionsTableProps {
  filters: {
    status: string;
    paymentMethod: string;
    searchQuery: string;
  };
}

const PaymentTransactionsTable: React.FC<PaymentTransactionsTableProps> = ({ filters }) => {
  const { data: storeData } = useStoreData();
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'KWD');
  const [page, setPage] = useState(0);
  const pageSize = 5;
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['payments', storeData?.id, filters, page],
    queryFn: () => fetchPayments(storeData?.id || '', {
      status: filters.status === "all" ? undefined : filters.status as any,
      paymentMethod: filters.paymentMethod === "all" ? undefined : filters.paymentMethod,
      searchQuery: filters.searchQuery,
      page,
      pageSize
    }),
    enabled: !!storeData?.id,
  });
  
  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case "successful":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 transition-colors">
            <Check className="h-3 w-3 ml-1" />
            <span>ناجحة</span>
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 transition-colors">
            <Clock className="h-3 w-3 ml-1" />
            <span>معلقة</span>
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 transition-colors">
            <X className="h-3 w-3 ml-1" />
            <span>فاشلة</span>
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 transition-colors">
            <AlertCircle className="h-3 w-3 ml-1" />
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
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" dir="rtl">
        <div className="overflow-x-auto">
          <Table>
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
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-14 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 mx-auto rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16 mx-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
  
  if (error) {
    console.error("Error loading payments:", error);
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center" dir="rtl">
        <p className="text-red-500">حدث خطأ أثناء تحميل المدفوعات</p>
      </div>
    );
  }
  
  const payments = data?.payments || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" dir="rtl">
      <div className="overflow-x-auto">
        <Table>
          {payments.length === 0 ? (
            <TableCaption>لا توجد مدفوعات متطابقة مع معايير البحث</TableCaption>
          ) : (
            <TableCaption>عرض {payments.length} من أصل {totalCount} مدفوعة</TableCaption>
          )}
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
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  لا توجد مدفوعات متطابقة مع معايير البحث
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id} className={cn(
                  "hover:bg-gray-50 transition-colors",
                  payment.status === "failed" && "bg-red-50",
                  payment.status === "pending" && "bg-amber-50",
                )}>
                  <TableCell className="text-center font-medium">{payment.order_id.slice(-5)}</TableCell>
                  <TableCell className="text-center">{payment.customer_name}</TableCell>
                  <TableCell className="text-center font-medium">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell className="text-center">{payment.payment_method}</TableCell>
                  <TableCell className="text-center">{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-center">{formatDate(payment.created_at)}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-primary-600">
                      التفاصيل
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="py-4 px-6 border-t border-gray-200">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalCount}
            pageSize={pageSize}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentTransactionsTable;
