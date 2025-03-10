
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search, CheckIcon, Loader2, Image as ImageIcon, X, ShoppingCart } from "lucide-react";
import { createCurrencyFormatter } from "@/hooks/use-currency-formatter";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  
  const selectedCount = Object.values(selectedProducts).filter(Boolean).length;
  const selectedProductsList = products.filter(product => selectedProducts[product.id]);

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

  const clearAllSelections = () => {
    Object.keys(selectedProducts).forEach(id => {
      onProductSelect(id, false);
    });
  };

  const addAllFilteredProducts = () => {
    filteredProducts.forEach(product => {
      if (!selectedProducts[product.id]) {
        onProductSelect(product.id, true);
      }
    });
  };

  return (
    <div className="space-y-2 mt-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">
          <span className="text-rose-500">*</span> اختر المنتجات
        </Label>
        <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
          {selectedCount} منتج محدد
        </Badge>
      </div>
      <p className="text-sm text-gray-500 mb-2">اختر المنتجات التي تريد عرضها في هذا القسم</p>
      
      <div className="border rounded-md">
        {/* Selected products preview */}
        {selectedCount > 0 && (
          <div className="p-2 border-b bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">المنتجات المحددة</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={clearAllSelections}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                إلغاء الكل
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedProductsList.slice(0, 8).map(product => (
                <Badge 
                  key={product.id} 
                  variant="secondary"
                  className="px-2 py-1 flex items-center gap-1 bg-white border"
                >
                  <span className="truncate max-w-[100px]">{product.name}</span>
                  <button 
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => onProductSelect(product.id, false)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedCount > 8 && (
                <Badge variant="outline">
                  +{selectedCount - 8}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-grow">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن منتج..."
                className="pr-9 text-right"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                className="whitespace-nowrap text-xs h-10 border-dashed"
                onClick={addAllFilteredProducts}
              >
                <ShoppingCart className="h-3.5 w-3.5 ml-1" />
                اختيار كل النتائج ({filteredProducts.length})
              </Button>
            )}
          </div>
          
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-6 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-sm text-gray-500">جاري تحميل المنتجات...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                <p className="mb-1">لا توجد منتجات مطابقة</p>
                <p className="text-xs">جرب كلمات بحث أخرى</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {filteredProducts.map(product => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "flex items-center space-x-2 space-x-reverse rtl p-2 hover:bg-gray-50 rounded-md cursor-pointer border",
                      selectedProducts[product.id] 
                        ? "bg-primary/5 border-primary/20" 
                        : "border-transparent"
                    )}
                    onClick={() => onProductSelect(product.id, !selectedProducts[product.id])}
                  >
                    <div className="flex-shrink-0 relative">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      {selectedProducts[product.id] && (
                        <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center">
                          <CheckIcon className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-grow mr-2">
                      <div className="font-medium text-sm line-clamp-1">{product.name}</div>
                      <div className="text-xs">
                        {product.discount_price ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-green-600 font-medium">{formatCurrency(product.discount_price)}</span>
                            <span className="text-gray-400 line-through">{formatCurrency(product.price)}</span>
                          </div>
                        ) : (
                          <span className="text-gray-700">{formatCurrency(product.price)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 h-5 w-5 rounded-md border border-gray-300 flex items-center justify-center">
                      {selectedProducts[product.id] && <CheckIcon className="h-3 w-3 text-primary" />}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-500 mt-3 text-center">
            {!isLoading && (
              selectedCount > 0 
                ? `تم اختيار ${selectedCount} من ${filteredProducts.length} منتج` 
                : `${filteredProducts.length} منتج متاح للاختيار`
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSelector;
