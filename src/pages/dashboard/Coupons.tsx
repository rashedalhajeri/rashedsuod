
import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Plus, Search, Percent, Calendar, Filter, ArrowDownUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Coupons: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدارة الكوبونات</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>إضافة كوبون</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>إضافة كوبون جديد</DialogTitle>
                <DialogDescription>
                  أدخل تفاصيل الكوبون لتقديم خصومات لعملائك
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="coupon-code" className="col-span-4">
                    كود الكوبون
                  </Label>
                  <Input
                    id="coupon-code"
                    placeholder="مثال: SUMMER2023"
                    className="col-span-4"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discount-type" className="col-span-4">
                    نوع الخصم
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-4">
                      <SelectValue placeholder="اختر نوع الخصم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                      <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discount-value" className="col-span-4">
                    قيمة الخصم
                  </Label>
                  <Input
                    id="discount-value"
                    type="number"
                    placeholder="أدخل قيمة الخصم"
                    className="col-span-4"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiry-date" className="col-span-4">
                    تاريخ الانتهاء
                  </Label>
                  <Input
                    id="expiry-date"
                    type="date"
                    className="col-span-4"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>إلغاء</Button>
                <Button type="submit">إضافة الكوبون</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="البحث عن كوبون..." 
                className="pl-3 pr-10" 
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 flex-1">
              <Filter className="h-4 w-4" />
              <span>التصفية</span>
            </Button>
            <Button variant="outline" className="gap-2 flex-1">
              <ArrowDownUp className="h-4 w-4" />
              <span>الترتيب</span>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              <Tag className="h-4 w-4 inline-block ml-2" />
              قائمة الكوبونات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Tag className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">لا توجد كوبونات بعد</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                أضف كوبونات خصم لتشجيع العملاء على الشراء
              </p>
              <Button className="mt-4 gap-2" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                <span>إضافة أول كوبون</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Coupons;
