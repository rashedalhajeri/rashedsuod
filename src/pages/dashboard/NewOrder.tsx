import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createOrder } from "@/services/order-service";
import useStoreData from "@/hooks/use-store-data";
import SaveButton from "@/components/ui/save-button";
import { ArrowLeft } from "lucide-react";

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: storeData } = useStoreData();
  const [saving, setSaving] = useState(false);
  
  const [orderData, setOrderData] = useState({
    order_number: `ORD-${Date.now().toString().slice(-6)}`,
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    payment_method: "cash",
    status: "processing",
    total: 0,
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: name === "total" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storeData?.id) {
      toast({
        title: "خطأ",
        description: "لم يتم العثور على بيانات المتجر",
        variant: "destructive"
      });
      return;
    }
    
    if (!orderData.customer_name || !orderData.shipping_address) {
      toast({
        title: "حقول مطلوبة",
        description: "يرجى إدخال اسم العميل وعنوان الشحن",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSaving(true);
      // Pass the storeData.id directly instead of using a separate orderData.store_id
      const result = await createOrder(storeData.id, orderData);
      
      if (result) {
        toast({
          title: "تم بنجاح",
          description: "تم إنشاء الطلب بنجاح",
        });
        navigate("/dashboard/orders");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء الطلب",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">إضافة طلب جديد</h1>
            <p className="text-muted-foreground">
              أدخل تفاصيل الطلب الجديد
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard/orders")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة للطلبات
          </Button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>معلومات الطلب</CardTitle>
                <CardDescription>
                  ادخل المعلومات الأساسية للطلب
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order_number">رقم الطلب</Label>
                    <Input
                      id="order_number"
                      name="order_number"
                      value={orderData.order_number}
                      onChange={handleInputChange}
                      placeholder="رقم الطلب"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">حالة الطلب</Label>
                    <Select
                      value={orderData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر حالة الطلب" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="processing">قيد المعالجة</SelectItem>
                        <SelectItem value="shipped">تم الشحن</SelectItem>
                        <SelectItem value="delivered">تم التوصيل</SelectItem>
                        <SelectItem value="cancelled">ملغي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_method">طريقة الدفع</Label>
                  <Select
                    value={orderData.payment_method}
                    onValueChange={(value) => handleSelectChange("payment_method", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر طريقة الدفع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">الدفع عند الاستلام</SelectItem>
                      <SelectItem value="credit_card">بطاقة ائتمان</SelectItem>
                      <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                      <SelectItem value="online_payment">دفع إلكتروني</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total">إجمالي المبلغ</Label>
                  <Input
                    id="total"
                    name="total"
                    type="number"
                    min="0"
                    step="0.01"
                    value={orderData.total}
                    onChange={handleInputChange}
                    placeholder="إجمالي المبلغ"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معلومات العميل</CardTitle>
                <CardDescription>
                  ادخل بيانات العميل وعنوان الشحن
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">اسم العميل <span className="text-red-500">*</span></Label>
                  <Input
                    id="customer_name"
                    name="customer_name"
                    value={orderData.customer_name}
                    onChange={handleInputChange}
                    placeholder="اسم العميل"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_email">البريد الإلكتروني</Label>
                    <Input
                      id="customer_email"
                      name="customer_email"
                      type="email"
                      value={orderData.customer_email}
                      onChange={handleInputChange}
                      placeholder="البريد الإلكتروني"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customer_phone">رقم الهاتف</Label>
                    <Input
                      id="customer_phone"
                      name="customer_phone"
                      value={orderData.customer_phone}
                      onChange={handleInputChange}
                      placeholder="رقم الهاتف"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping_address">عنوان الشحن <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="shipping_address"
                    name="shipping_address"
                    value={orderData.shipping_address}
                    onChange={handleInputChange}
                    placeholder="عنوان الشحن"
                    required
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={orderData.notes}
                    onChange={handleInputChange}
                    placeholder="ملاحظات إضافية"
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <SaveButton isSaving={saving} type="submit" />
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default NewOrder;
