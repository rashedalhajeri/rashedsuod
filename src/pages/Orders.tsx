
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Filter, ShoppingBag } from "lucide-react";
import { OrderFilters } from "@/components/order/OrderFilters";
import { OrderStats } from "@/components/order/OrderStats";
import OrderList from "@/components/order/OrderList";
import OrderDetails from "@/components/order/OrderDetails";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase, getCurrentUser, getStoreData } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Orders = () => {
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [storeCurrency, setStoreCurrency] = useState("KWD");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        // Get current user
        const user = await getCurrentUser();
        if (!user) {
          toast.error("يرجى تسجيل الدخول للوصول إلى هذه الصفحة");
          return;
        }

        // Get store data
        const { data, error } = await getStoreData(user.id);
        if (error) {
          console.error("Error fetching store data:", error);
          toast.error("حدث خطأ أثناء جلب بيانات المتجر");
          return;
        }

        if (data) {
          setStoreCurrency(data.currency);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("حدث خطأ غير متوقع");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  const handleOrderClick = (orderId: string) => {
    setSelectedOrder(orderId);
    setOpen(true);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>الطلبات</title>
        <meta name="description" content="إدارة طلبات العملاء وتتبع الشحنات" />
      </Helmet>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">الطلبات</h1>
            <p className="text-gray-600">إدارة طلبات العملاء وتتبع الشحنات</p>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="hover:scale-105 transition-transform duration-300 bg-white border-gray-200">
                <Filter className="mr-2 h-4 w-4" />
                فلترة
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px]">
              <div className="flex flex-col space-y-6">
                <h3 className="text-lg font-medium">فلترة الطلبات</h3>
                <Separator />
                <OrderFilters onApplyFilters={(filters) => console.log(filters)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <OrderStats />
        <Separator className="my-6" />
        
        <Card className="bg-white border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <OrderList 
              searchQuery="" 
              statusFilter="" 
              dateRangeFilter="" 
              onOpenDetails={handleOrderClick}
              currency={storeCurrency}
            />
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[90%]">
            {selectedOrder && (
              <OrderDetails orderId={selectedOrder} onClose={handleCloseOrderDetails} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
