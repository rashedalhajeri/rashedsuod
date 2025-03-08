
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  products: Product[] | undefined;
  onAddProduct: (productId: string, productName: string, price: number) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  searchQuery,
  onSearchChange,
  products,
  onAddProduct
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product_search">البحث عن منتج</Label>
        <Input
          id="product_search"
          placeholder="اكتب اسم المنتج للبحث..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
        <div className="grid grid-cols-1 gap-2">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div 
                key={product.id}
                className="flex justify-between items-center p-2 hover:bg-accent rounded-md cursor-pointer"
                onClick={() => onAddProduct(product.id, product.name, product.price)}
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
    </div>
  );
};

export default ProductSearch;
