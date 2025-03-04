import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createOrder } from "@/services/order-service";
import SaveButton from "@/components/ui/save-button";
import { Order, OrderStatus } from "@/types/orders";

interface NewOrderModalProps {
  storeId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({
  storeId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // إنشاء رقم طلب فريد بتنسيق ORD-{STORE_PREFIX}-{RANDOM_NUMBER}
  const generateOrderNumber = () => {
    const storePrefix = storeId.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const timestamp = Date.now().toString().slice(-4);
    return `ORD-${storePrefix}-${random}${timestamp}`;
  };
  
  const [orderData, setOrderData] = useState({
    order_number: generateOrderNumber(),
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    payment_method: "cash",
    status: "processing" as OrderStatus,
    total: 0,
    notes: ""
  });

  // إعادة إنشاء رقم الطلب عند فتح النافذة المنبثقة
  useEffect(() => {
    if (isOpen) {
      setOrderData(prev => ({
        ...prev,
        order_number: generateOrderNumber()
      }));
    }
  }, [isOpen, storeId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: name === "total" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "status") {
      setOrderData(prev => ({
        ...prev,
        [name]: value as OrderStatus
      }));
    } else {
      setOrderData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storeId) {
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
      
      // إنشاء كائن الطلب الكامل بما في ذلك معرف المتجر
      const completeOrderData: Omit<Order, "id" | "created_at" | "updated_at"> = {
        ...orderData,
        store_id: storeId
      };
      
      const result = await createOrder(storeId, completeOrderData);
      
      if (result) {
        toast({
          title: "تم بنجاح",
          description: "تم إنشاء الطلب بنجاح",
        });
        onSuccess();
        onClose();
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">إضافة طلب جديد</DialogTitle>
          <DialogDescription>
            أدخل تفاصيل الطلب الجديد
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>معلومات الطلب</CardTitle>
                <CardDescription>
                  معلومات أساسية عن الطلب
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order_number">رقم الطلب (تلقائي)</Label>
                    <Input
                      id="order_number"
                      name="order_number"
                      value={orderData.order_number}
                      readOnly
                      className="bg-muted"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معلومات العميل</CardTitle>
                <CardDescription>
                  بيانات العميل وعنوان الشحن
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
            </Card>
            
            <div className="flex justify-end space-x-2 rtl:space-x-reverse">
              <Button 
                variant="outline" 
                type="button"
                onClick={onClose}
              >
                إلغاء
              </Button>
              <SaveButton 
                isSaving={saving}
                type="submit"
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewOrderModal;
