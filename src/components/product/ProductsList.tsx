
import React, { useState } from "react";
import { Product } from "@/utils/products/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useIsMobile, useIsTablet } from "@/hooks/use-media-query";
import { Calendar, DollarSign, Box, ArrowUpDown, Activity } from "lucide-react";

interface ProductsListProps {
  products: Product[];
  onEdit: (id: string) => void;
  onSelectionChange: (items: string[]) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
  onDelete?: (id: string) => Promise<void>;
  onActivate?: (id: string, isActive: boolean) => Promise<void>;
  onRefresh?: () => void;
  onActionClick: (product: Product) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  onEdit,
  onSelectionChange,
  searchTerm,
  onSearch,
  onDelete,
  onActivate,
  onRefresh,
  onActionClick
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const handleItemSelection = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
      onSelectionChange([...selectedItems, id]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== id));
      onSelectionChange(selectedItems.filter((item) => item !== id));
    }
  };

  // رسالة عند عدم وجود منتجات
  const renderEmptyState = () => (
    <tr>
      <td colSpan={isMobile ? 3 : isTablet ? 5 : 7} className="text-center p-8">
        <div className="flex flex-col items-center justify-center gap-2">
          <Box className="h-12 w-12 text-gray-300" />
          {searchTerm ? (
            <div className="text-gray-500 font-medium">لا توجد منتجات تطابق بحثك</div>
          ) : (
            <div className="text-gray-500 font-medium">لا توجد منتجات متاحة</div>
          )}
        </div>
      </td>
    </tr>
  );

  // رأس الجدول المتجاوب
  const renderTableHeader = () => (
    <thead className="text-xs text-gray-700 bg-gray-100">
      <tr>
        <th className="p-3">
          <Checkbox
            checked={selectedItems.length === products.length && products.length > 0}
            onCheckedChange={(checked) => {
              if (checked) {
                const allIds = products.map((product) => product.id);
                setSelectedItems(allIds);
                onSelectionChange(allIds);
              } else {
                setSelectedItems([]);
                onSelectionChange([]);
              }
            }}
          />
        </th>
        <th className="p-3">المنتج</th>
        {!isMobile && <th className="p-3"><span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> السعر</span></th>}
        {!isMobile && !isTablet && <th className="p-3"><span className="flex items-center gap-1"><Box className="h-3.5 w-3.5" /> الفئة</span></th>}
        {!isMobile && <th className="p-3"><span className="flex items-center gap-1"><Activity className="h-3.5 w-3.5" /> الحالة</span></th>}
        {!isMobile && !isTablet && <th className="p-3"><span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> تاريخ الإضافة</span></th>}
        <th className="p-3">الإجراءات</th>
      </tr>
    </thead>
  );

  // تصميم متجاوب لكل منتج
  const renderProductRows = () => (
    products.map((product) => (
      <tr 
        key={product.id} 
        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ${
          selectedItems.includes(product.id) ? "bg-blue-50" : ""
        }`}
      >
        <td className="px-3 py-2.5 align-middle">
          <Checkbox
            checked={selectedItems.includes(product.id)}
            onCheckedChange={(checked) => {
              handleItemSelection(product.id, Boolean(checked));
            }}
          />
        </td>
        <td className="px-3 py-2.5 align-middle">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => onActionClick(product)}
          >
            {product.image_url ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 ml-3 flex-shrink-0 bg-white">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded-lg ml-3 flex items-center justify-center flex-shrink-0">
                <Box className="h-5 w-5 text-gray-400" />
              </div>
            )}
            <div className="min-w-0">
              <div className="font-medium text-gray-900 truncate">{product.name}</div>
              {product.description && (
                <div className="text-xs text-gray-500 truncate max-w-[180px] sm:max-w-[250px] md:max-w-xs">
                  {product.description}
                </div>
              )}
              {/* موبايل فقط: عرض معلومات إضافية */}
              {isMobile && (
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 font-normal">
                    {product.price} د.ك
                  </Badge>
                  <Badge variant="outline" 
                    className={`text-xs font-normal ${
                      product.is_active 
                        ? "bg-green-50 text-green-700 border-green-100" 
                        : "bg-gray-50 text-gray-700 border-gray-100"
                    }`}
                  >
                    {product.is_active ? "نشط" : "غير نشط"}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </td>
        {!isMobile && (
          <td className="px-3 py-2.5 align-middle">
            {product.discount_price ? (
              <div>
                <span className="text-green-600 font-medium">{product.discount_price} د.ك</span>
                <span className="text-xs text-gray-500 line-through mr-1.5">
                  {product.price} د.ك
                </span>
              </div>
            ) : (
              <span className="text-gray-800">{product.price} د.ك</span>
            )}
          </td>
        )}
        {!isMobile && !isTablet && (
          <td className="px-3 py-2.5 align-middle">
            {product.category?.name ? (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 font-normal">
                {product.category.name}
              </Badge>
            ) : (
              <span className="text-gray-500 text-sm">بدون فئة</span>
            )}
          </td>
        )}
        {!isMobile && (
          <td className="px-3 py-2.5 align-middle">
            <Badge
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                product.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {product.is_active ? "نشط" : "غير نشط"}
            </Badge>
          </td>
        )}
        {!isMobile && !isTablet && (
          <td className="px-3 py-2.5 align-middle text-xs text-gray-500">
            {new Date(product.created_at).toLocaleDateString("ar-EG")}
          </td>
        )}
        <td className="px-3 py-2.5 align-middle">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onActionClick(product);
            }}
            className="text-gray-500 hover:text-gray-800 p-1"
            aria-label="خيارات المنتج"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="12" cy="5" r="1"/>
              <circle cx="12" cy="19" r="1"/>
            </svg>
          </button>
        </td>
      </tr>
    ))
  );

  return (
    <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          {renderTableHeader()}
          <tbody>
            {products.length === 0 ? (
              renderEmptyState()
            ) : (
              renderProductRows()
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsList;
