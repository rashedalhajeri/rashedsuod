
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SaveButton from "@/components/ui/save-button";
import OrderInfoForm from "./OrderInfoForm";
import ProductSearch from "./ProductSearch";
import OrderItems from "./OrderItems";
import CustomerInfoForm from "./CustomerInfoForm";

interface NewOrderFormProps {
  orderData: any;
  selectedItems: any[];
  productsData: any;
  searchQuery: string;
  saving: boolean;
  onSearchChange: (value: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onAddProduct: (productId: string, productName: string, price: number) => void;
  onQuantityChange: (index: number, newQuantity: number) => void;
  onRemoveItem: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const NewOrderForm: React.FC<NewOrderFormProps> = ({
  orderData,
  selectedItems,
  productsData,
  searchQuery,
  saving,
  onSearchChange,
  onInputChange,
  onSelectChange,
  onAddProduct,
  onQuantityChange,
  onRemoveItem,
  onSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6 mt-4">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>معلومات الطلب</CardTitle>
            <CardDescription>
              معلومات أساسية عن الطلب
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrderInfoForm
              orderNumber={orderData.order_number}
              status={orderData.status}
              paymentMethod={orderData.payment_method}
              totalAmount={orderData.total}
              onStatusChange={(value) => onSelectChange("status", value)}
              onPaymentMethodChange={(value) => onSelectChange("payment_method", value)}
            />
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
            <ProductSearch
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              products={productsData?.data}
              onAddProduct={onAddProduct}
            />
            
            <OrderItems
              selectedItems={selectedItems}
              totalAmount={orderData.total}
              onQuantityChange={onQuantityChange}
              onRemoveItem={onRemoveItem}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>معلومات العميل</CardTitle>
            <CardDescription>
              بيانات العميل وعنوان الشحن
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerInfoForm
              customerName={orderData.customer_name}
              customerEmail={orderData.customer_email}
              customerPhone={orderData.customer_phone}
              shippingAddress={orderData.shipping_address}
              notes={orderData.notes}
              onChange={onInputChange}
            />
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-2 rtl:space-x-reverse">
          <Button 
            variant="outline" 
            type="button"
            onClick={onCancel}
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
  );
};

export default NewOrderForm;
