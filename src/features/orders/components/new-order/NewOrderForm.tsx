
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CustomerInfoForm from "./CustomerInfoForm";
import PaymentMethodSelect from "./PaymentMethodSelect";
import ProductSearch from "./ProductSearch";
import OrderItemsList from "./OrderItemsList";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface OrderData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  notes: string;
  payment_method: string;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface NewOrderFormProps {
  orderData: OrderData;
  selectedItems: OrderItem[];
  productsData: Product[] | undefined;
  searchQuery: string;
  saving: boolean;
  onSearchChange: (value: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onAddProduct: (productId: string, productName: string, price: number) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
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
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-medium mb-2">منتجات الطلب</h3>
            <ProductSearch
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              products={productsData}
              onAddProduct={onAddProduct}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">تفاصيل الطلب</h3>
            <OrderItemsList
              items={selectedItems}
              onRemoveItem={onRemoveItem}
              onQuantityChange={onQuantityChange}
            />
          </div>
        </div>
        
        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-medium mb-2">معلومات العميل</h3>
            <CustomerInfoForm
              customerName={orderData.customer_name}
              customerEmail={orderData.customer_email}
              customerPhone={orderData.customer_phone}
              shippingAddress={orderData.shipping_address}
              notes={orderData.notes}
              onChange={onInputChange}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">طريقة الدفع</h3>
            <PaymentMethodSelect
              value={orderData.payment_method}
              onChange={(value) => onSelectChange('payment_method', value)}
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex justify-end space-x-2 space-x-reverse">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={saving}
        >
          إلغاء
        </Button>
        <Button 
          type="submit" 
          disabled={saving || selectedItems.length === 0 || !orderData.customer_name || !orderData.shipping_address}
        >
          {saving ? (
            <>
              <LoadingSpinner className="mr-2" />
              جاري الحفظ...
            </>
          ) : (
            "إنشاء الطلب"
          )}
        </Button>
      </div>
    </form>
  );
};

export default NewOrderForm;
