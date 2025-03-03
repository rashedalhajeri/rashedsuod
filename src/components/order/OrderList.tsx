
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EyeIcon, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Estatus a mostrar para las órdenes
const orderStatusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'معلق', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'تم الشحن', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'تم التوصيل', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800' },
  completed: { label: 'مكتمل', color: 'bg-green-100 text-green-800' }
};

// Mock data for orders
const mockOrders = [
  {
    id: 'ord-001',
    orderNumber: '1001',
    customerName: 'أحمد محمد',
    date: '2023-07-15',
    status: 'delivered',
    total: 450.75,
    items: 3,
    paymentMethod: 'بطاقة ائتمان'
  },
  {
    id: 'ord-002',
    orderNumber: '1002',
    customerName: 'فاطمة علي',
    date: '2023-07-16',
    status: 'processing',
    total: 290.50,
    items: 2,
    paymentMethod: 'الدفع عند الاستلام'
  },
  {
    id: 'ord-003',
    orderNumber: '1003',
    customerName: 'محمد خالد',
    date: '2023-07-16',
    status: 'pending',
    total: 175.00,
    items: 1,
    paymentMethod: 'بطاقة ائتمان'
  },
  {
    id: 'ord-004',
    orderNumber: '1004',
    customerName: 'نورة أحمد',
    date: '2023-07-17',
    status: 'shipped',
    total: 650.25,
    items: 4,
    paymentMethod: 'الدفع عند الاستلام'
  },
  {
    id: 'ord-005',
    orderNumber: '1005',
    customerName: 'خالد عبدالله',
    date: '2023-07-18',
    status: 'cancelled',
    total: 320.00,
    items: 2,
    paymentMethod: 'بطاقة ائتمان'
  }
];

interface OrderListProps {
  searchQuery?: string;
  statusFilter?: string;
  dateRangeFilter?: string;
  onOpenDetails?: (orderId: string) => void;
  currency?: string;
}

const OrderList: React.FC<OrderListProps> = ({
  searchQuery = '',
  statusFilter = 'all',
  dateRangeFilter = '',
  onOpenDetails,
  currency = 'SAR'
}) => {
  // Filter the orders based on search query and status filter
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = searchQuery 
      ? order.orderNumber.includes(searchQuery) || 
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesStatus = statusFilter !== 'all' 
      ? order.status === statusFilter 
      : true;
    
    // Future: implement date range filtering
    
    return matchesSearch && matchesStatus;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  
  const handleOpenDetails = (orderId: string) => {
    if (onOpenDetails) {
      onOpenDetails(orderId);
    }
  };
  
  // Update order status
  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    console.log(`Update order ${orderId} status to ${newStatus}`);
    // Here would be a call to update the order status in the database
  };
  
  if (filteredOrders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">لا توجد طلبات مطابقة للبحث</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">رقم الطلب</TableHead>
            <TableHead className="text-right">العميل</TableHead>
            <TableHead className="text-right">التاريخ</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="text-right">المبلغ</TableHead>
            <TableHead className="text-right">عدد المنتجات</TableHead>
            <TableHead className="text-right">طريقة الدفع</TableHead>
            <TableHead className="text-center">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.orderNumber}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{formatDate(order.date)}</TableCell>
              <TableCell>
                <Badge className={cn("font-normal", orderStatusMap[order.status].color)}>
                  {orderStatusMap[order.status].label}
                </Badge>
              </TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
              <TableCell>{order.items}</TableCell>
              <TableCell>{order.paymentMethod}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleOpenDetails(order.id)}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'processing')}>
                        تغيير الحالة: قيد التنفيذ
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'shipped')}>
                        تغيير الحالة: تم الشحن
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'delivered')}>
                        تغيير الحالة: تم التوصيل
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'cancelled')}>
                        تغيير الحالة: ملغي
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderList;
