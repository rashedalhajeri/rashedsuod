import React, { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useStoreData, getCurrencyFormatter } from "@/hooks/use-store-data";
import { Check, X, AlertCircle, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { fetchPayments, fetchPaymentDetails, Payment } from "@/services/payments";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface PaymentTransactionsTableProps {
  filters: {
    status: string;
    paymentMethod: string;
    searchQuery: string;
    startDate?: string;
    endDate?: string;
  };
}

const PaymentTransactionsTable: React.FC<PaymentTransactionsTableProps> = ({ filters }) => {
  const { data: storeData } = useStoreData();
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'KWD');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['payments', storeData?.id, filters, page, pageSize],
    queryFn: () => fetchPayments(storeData?.id || '', {
      status: filters.status === "all" ? undefined : filters.status as any,
      paymentMethod: filters.paymentMethod === "all" ? undefined : filters.paymentMethod,
      searchQuery: filters.searchQuery,
      startDate: filters.startDate,
      endDate: filters.endDate,
      page,
      pageSize
    }),
    enabled: !!storeData?.id,
  });
  
  const { data: paymentDetails } = useQuery({
    queryKey: ['paymentDetails', selectedPayment?.id],
    queryFn: () => fetchPaymentDetails(selectedPayment?.id || ''),
    enabled: !!selectedPayment?.id,
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
  
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (err) {
      return dateString;
    }
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  const handlePaymentClick = (payment: Payment) => {
    setSelectedPayment(payment);
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
                  <TableCell className="text-center font-medium">
                    {payment.order_id ? payment.order_id.slice(-5) : '-'}
                  </TableCell>
                  <TableCell className="text-center">{payment.customer_name}</TableCell>
                  <TableCell className="text-center font-medium">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell className="text-center">{payment.payment_method}</TableCell>
                  <TableCell className="text-center">{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-center">{formatDate(payment.created_at)}</TableCell>
                  <TableCell className="text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-primary-600"
                          onClick={() => handlePaymentClick(payment)}
                        >
                          <Eye className="h-4 w-4 ml-1" />
                          <span>التفاصيل</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md" dir="rtl">
                        <DialogHeader>
                          <DialogTitle>تفاصيل المعاملة</DialogTitle>
                          <DialogDescription>
                            معلومات كاملة عن عملية الدفع ومعالجتها
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">المبلغ</p>
                              <p className="text-lg font-bold">{formatCurrency(selectedPayment?.amount || 0)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">الحالة</p>
                              <div className="mt-1">{selectedPayment && getStatusBadge(selectedPayment.status)}</div>
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <p className="text-sm text-gray-500 mb-2">معلومات العميل</p>
                            <div className="grid grid-cols-1 gap-2">
                              <div className="flex justify-between">
                                <span className="text-sm">الاسم:</span>
                                <span className="text-sm font-medium">{selectedPayment?.customer_name}</span>
                              </div>
                              {selectedPayment?.customer_email && (
                                <div className="flex justify-between">
                                  <span className="text-sm">البريد الإلكتروني:</span>
                                  <span className="text-sm font-medium">{selectedPayment.customer_email}</span>
                                </div>
                              )}
                              {selectedPayment?.customer_phone && (
                                <div className="flex justify-between">
                                  <span className="text-sm">الهاتف:</span>
                                  <span className="text-sm font-medium">{selectedPayment.customer_phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <p className="text-sm text-gray-500 mb-2">بيانات المعاملة</p>
                            <div className="grid grid-cols-1 gap-2">
                              <div className="flex justify-between">
                                <span className="text-sm">طريقة الدفع:</span>
                                <span className="text-sm font-medium">{selectedPayment?.payment_method}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">رقم المعاملة:</span>
                                <span className="text-sm font-medium">{selectedPayment?.transaction_id || 'غير متوفر'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">تاريخ المعاملة:</span>
                                <span className="text-sm font-medium">{selectedPayment && formatDateTime(selectedPayment.created_at)}</span>
                              </div>
                              {selectedPayment?.updated_at !== selectedPayment?.created_at && (
                                <div className="flex justify-between">
                                  <span className="text-sm">آخر تحديث:</span>
                                  <span className="text-sm font-medium">{selectedPayment && formatDateTime(selectedPayment.updated_at)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="sm:justify-start">
                          <Button type="button" variant="secondary">
                            طباعة الإيصال
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
            pageCount={totalPages}
            currentPage={page + 1}
            onPageChange={handlePageChange}
            siblingCount={1}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentTransactionsTable;
