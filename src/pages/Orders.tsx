import { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
import { OrderFilters } from "@/components/order/OrderFilters";
import { OrderStats } from "@/components/order/OrderStats";
import { OrderList } from "@/components/order/OrderList";
import OrderDetails from "@/components/order/OrderDetails";

const Orders = () => {
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const handleOrderClick = (orderId: string) => {
    setSelectedOrder(orderId);
    setOpen(true);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
    setOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>الطلبات</title>
        <meta name="description" content="إدارة طلبات العملاء وتتبع الشحنات" />
      </Helmet>
      <div className="container mx-auto py-10">
        <div className="mb-4 flex items-center justify-between">
          <CardHeader className="flex flex-col space-y-1.5">
            <CardTitle className="text-2xl font-bold">الطلبات</CardTitle>
            <CardDescription>إدارة طلبات العملاء وتتبع الشحنات</CardDescription>
          </CardHeader>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
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
        <OrderList onOrderClick={handleOrderClick} />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[90%]">
            {selectedOrder && (
              <OrderDetails orderId={selectedOrder} onClose={handleCloseOrderDetails} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Orders;
