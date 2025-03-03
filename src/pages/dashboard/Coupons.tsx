
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SearchIcon,
  PlusIcon,
  TicketIcon,
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  Percent,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Switch } from "@/components/ui/switch";

// نوع البيانات للكوبونات
interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
  usageLimit: number;
  usageCount: number;
}

// بيانات وهمية للكوبونات (سيتم استبدالها بالبيانات الحقيقية)
const dummyCoupons: Coupon[] = [
  {
    id: "1",
    code: "SUMMER25",
    discountType: "percentage",
    discountValue: 25,
    startDate: new Date(2023, 5, 1),
    endDate: new Date(2023, 7, 31),
    active: true,
    usageLimit: 100,
    usageCount: 42,
  },
  {
    id: "2",
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 11, 31),
    active: true,
    usageLimit: 0, // غير محدود
    usageCount: 87,
  },
  {
    id: "3",
    code: "SAVE50",
    discountType: "fixed",
    discountValue: 50,
    startDate: new Date(2023, 3, 15),
    endDate: new Date(2023, 4, 15),
    active: false,
    usageLimit: 200,
    usageCount: 142,
  },
  {
    id: "4",
    code: "FLASH30",
    discountType: "percentage",
    discountValue: 30,
    startDate: new Date(2023, 6, 10),
    endDate: new Date(2023, 6, 12),
    active: false,
    usageLimit: 50,
    usageCount: 50, // تم استخدام جميع الكوبونات
  },
];

const CouponEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted rounded-full p-3">
        <TicketIcon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-semibold">لم يتم العثور على كوبونات</h3>
      <p className="text-muted-foreground text-sm mt-1 max-w-sm">
        لم يتم العثور على كوبونات مطابقة لعملية البحث. قم بإنشاء كوبون جديد أو تجربة مصطلح بحث آخر.
      </p>
      <Button className="mt-4">
        <PlusIcon className="h-4 w-4 mr-1" />
        إنشاء كوبون جديد
      </Button>
    </div>
  );
};

const Coupons = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // تصفية الكوبونات حسب البحث
  const filteredCoupons = dummyCoupons.filter((coupon) => {
    return (
      searchQuery === "" ||
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleAddCoupon = () => {
    setIsDialogOpen(true);
  };

  const handleSaveCoupon = () => {
    toast.success("تم حفظ الكوبون بنجاح");
    setIsDialogOpen(false);
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}%`;
    } else {
      return `${coupon.discountValue} ريال`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">كوبونات الخصم</h1>
          <p className="text-muted-foreground mt-1">إدارة كوبونات الخصم لمتجرك</p>
        </div>
        <Button onClick={handleAddCoupon}>
          <PlusIcon className="mr-2 h-4 w-4" />
          إضافة كوبون
        </Button>
      </div>

      <div className="flex justify-between gap-4">
        <div className="relative w-full max-w-md">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث عن كوبون..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الكوبونات</CardTitle>
          <CardDescription>
            {filteredCoupons.length} كوبون - قم بإدارة وإنشاء كوبونات خصم للعملاء
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-24rem)] w-full">
            {filteredCoupons.length > 0 ? (
              <div className="space-y-0.5">
                {filteredCoupons.map((coupon) => (
                  <React.Fragment key={coupon.id}>
                    <div className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          coupon.active ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"
                        }`}>
                          <TicketIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{coupon.code}</p>
                            <Badge variant={coupon.active ? "default" : "secondary"}>
                              {coupon.active ? "نشط" : "غير نشط"}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground gap-3 mt-0.5">
                            <div className="flex items-center gap-1">
                              <Percent className="h-3.5 w-3.5" />
                              <span>{formatDiscount(coupon)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>
                                {format(coupon.startDate, "dd/MM/yyyy", { locale: ar })}
                                {" - "}
                                {format(coupon.endDate, "dd/MM/yyyy", { locale: ar })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {coupon.usageCount} / {coupon.usageLimit > 0 ? coupon.usageLimit : "∞"}
                        </span>
                        <Switch
                          checked={coupon.active}
                          onCheckedChange={() => {
                            toast.success(`تم ${coupon.active ? "إلغاء تنشيط" : "تنشيط"} الكوبون بنجاح`);
                          }}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              تعديل
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <Separator />
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <CouponEmptyState />
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة كوبون خصم جديد</DialogTitle>
            <DialogDescription>
              قم بإنشاء كوبون خصم جديد لعملائك
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">كود الكوبون</Label>
              <Input
                id="code"
                placeholder="مثال: SUMMER25"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="discountType">نوع الخصم</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discountValue">قيمة الخصم</Label>
                <Input
                  id="discountValue"
                  type="number"
                  placeholder="25"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">تاريخ البدء</Label>
                <Input
                  id="startDate"
                  type="date"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">تاريخ الانتهاء</Label>
                <Input
                  id="endDate"
                  type="date"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="usageLimit">الحد الأقصى للاستخدام</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  placeholder="100"
                />
                <p className="text-xs text-muted-foreground">اترك فارغًا لاستخدام غير محدود</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="active">حالة الكوبون</Label>
                <div className="flex items-center pt-2">
                  <Switch id="active" />
                  <Label htmlFor="active" className="mr-2">
                    نشط
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveCoupon}>
              إضافة الكوبون
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Coupons;
