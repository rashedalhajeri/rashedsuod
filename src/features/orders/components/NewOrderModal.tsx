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
import { useQuery } from "@tanstack/react-query";
import { getProductsWithPagination } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NewOrderModalProps {
  storeId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({
  storeId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  
  const generateOrderNumber = () => {
    const randomNumber = Math.floor(Math.random() * 9999) + 1;
    return `ORD-${randomNumber.toString().padStart(4, '0')}`;
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

  const { data: productsData } = useQuery({
    queryKey: ["products", storeId, searchQuery],
    queryFn: () => getProductsWithPagination(storeId, 0, 100, searchQuery),
    enabled: !!storeId && isOpen
  });

  useEffect(() => {
    if (isOpen) {
      setOrderData(prev => ({
        ...prev,
        order_number: generateOrderNumber(),
        total: 0
      }));
      setSelectedItems([]);
      setSearchQuery("");
    }
  }, [isOpen, storeId]);

  useEffect(() => {
    const newTotal = selectedItems.reduce((sum, item) => sum + item.total_price, 0);
    setOrderData(prev => ({
      ...prev,
      total: newTotal
    }));
  }, [selectedItems]);

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

  const handleAddProduct = (productId: string, productName: string, price: number) => {
    const existingItemIndex = selectedItems.findIndex(item => item.product_id === productId);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].total_price = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].unit_price;
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems(prev => [
        ...prev,
        {
          product_id: productId,
          product_name: productName,
          quantity: 1,
          unit_price: price,
          total_price: price
        }
      ]);
    }
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = [...selectedItems];
    updatedItems[index].quantity = newQuantity;
    updatedItems[index].total_price = newQuantity * updatedItems[index].unit_price;
    setSelectedItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
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

    if (selectedItems.length === 0) {
      toast({
        title: "لا توجد منتجات",
        description: "يرجى إضافة منتج واحد على الأقل للطلب",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSaving(true);
      
      const completeOrderData: Omit<Order, "id" | "created_at" | "updated_at"> = {
        ...orderData,
        store_id: storeId
      };
      
      const orderItems = selectedItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));
      
      const result = await createOrder(storeId, completeOrderData, orderItems);
      
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
                    <Label htmlFor="total">إجمالي المبلغ (تلقائي)</Label>
                    <Input
                      id="total"
                      name="total"
                      value={orderData.total.toFixed(2)}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إضافة المنتجات</CardTitle>
                <CardDescription>
                  اختر المنتجات التي تريد إضافتها للطلب
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product_search">البحث عن منتج</Label>
                  <Input
                    id="product_search"
                    placeholder="اكتب اسم المنتج للبحث..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-2">
                    {productsData?.data && productsData.data.length > 0 ? (
                      productsData.data.map((product) => (
                        <div 
                          key={product.id}
                          className="flex justify-between items-center p-2 hover:bg-accent rounded-md cursor-pointer"
                          onClick={() => handleAddProduct(product.id, product.name, product.price)}
                        >
                          <div>
                            <span className="font-medium">{product.name}</span>
                            <span className="text-sm text-muted-foreground block">{product.price.toFixed(2)}</span>
                          </div>
                          <Badge>إضافة</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-2 text-muted-foreground">
                        {searchQuery ? "لا توجد منتجات مطابقة" : "لا توجد منتجات متاحة"}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label>المنتجات المحددة</Label>
                  {selectedItems.length > 0 ? (
                    <Table className="mt-2">
                      <TableHeader>
                        <TableRow>
                          <TableHead>المنتج</TableHead>
                          <TableHead>السعر</TableHead>
                          <TableHead>الكمية</TableHead>
                          <TableHead>المجموع</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.product_name}</TableCell>
                            <TableCell>{item.unit_price.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleQuantityChange(index, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span>{item.quantity}</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleQuantityChange(index, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>{item.total_price.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-bold">المجموع الكلي:</TableCell>
                          <TableCell className="font-bold">{orderData.total.toFixed(2)}</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4 border rounded-md mt-2 text-muted-foreground">
                      لم تقم بإضافة أي منتجات بعد
                    </div>
                  )}
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

