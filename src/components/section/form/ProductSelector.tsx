
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { createCurrencyFormatter } from "@/hooks/use-currency-formatter";

interface Product {
  id: string;
  name: string;
  image_url?: string;
  price: number;
  discount_price?: number | null;
}

interface ProductSelectorProps {
  products: Product[];
  selectedProducts: Record<string, boolean>;
  onProductSelect: (productId: string, isSelected: boolean) => void;
  isLoading: boolean;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProducts,
  onProductSelect,
  isLoading
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const formatCurrency = createCurrencyFormatter("KWD");

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredProducts(
        products.filter(product => 
          product.name.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, products]);

  return (
    <div className="space-y-2 mt-4">
      <Label>اختر المنتجات</Label>
      <div className="border rounded-md p-2">
        <div className="mb-2">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ابحث عن منتج..."
              className="pr-9 text-right"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">جاري التحميل...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">لا توجد منتجات مطابقة</div>
          ) : (
            <div className="grid grid-cols-1 gap-1">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="flex items-center space-x-2 space-x-reverse rtl p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                  onClick={() => onProductSelect(product.id, !selectedProducts[product.id])}
                >
                  <input 
                    type="checkbox" 
                    id={`product-${product.id}`} 
                    className="rounded" 
                    checked={!!selectedProducts[product.id]}
                    onChange={(e) => e.stopPropagation()}
                  />
                  <Label htmlFor={`product-${product.id}`} className="flex items-center gap-2 cursor-pointer flex-1">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-10 h-10 object-cover rounded-md" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    )}
                    <div className="flex-grow">
                      <div className="font-medium truncate">{product.name}</div>
                      <div className="text-xs">
                        {product.discount_price ? (
                          <span className="text-green-600">{formatCurrency(product.discount_price)}</span>
                        ) : (
                          <span>{formatCurrency(product.price)}</span>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="text-sm text-right text-gray-500 mt-2">
          تم اختيار {Object.values(selectedProducts).filter(Boolean).length} منتج
        </div>
      </div>
    </div>
  );
};

export default ProductSelector;
