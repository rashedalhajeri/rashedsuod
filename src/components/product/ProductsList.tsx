import React, { useState } from "react";
import { Product } from "@/utils/products/types";
import { Checkbox } from "@/components/ui/checkbox";

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

  const handleItemSelection = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
      onSelectionChange([...selectedItems, id]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== id));
      onSelectionChange(selectedItems.filter((item) => item !== id));
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
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
              <th className="p-3">السعر</th>
              <th className="p-3">الفئة</th>
              <th className="p-3">الحالة</th>
              <th className="p-3">تاريخ الإضافة</th>
              <th className="p-3">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  {searchTerm ? (
                    <div className="text-gray-500">لا توجد منتجات تطابق بحثك</div>
                  ) : (
                    <div className="text-gray-500">لا توجد منتجات متاحة</div>
                  )}
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr 
                  key={product.id} 
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-3 py-2">
                    <Checkbox
                      checked={selectedItems.includes(product.id)}
                      onCheckedChange={(checked) => {
                        handleItemSelection(product.id, Boolean(checked));
                      }}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => onActionClick(product)}
                    >
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-md ml-2"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-md ml-2 flex items-center justify-center">
                          <span className="text-xs text-gray-500">لا توجد صورة</span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{product.name}</div>
                        {product.description && (
                          <div className="text-xs text-gray-500 max-w-xs truncate">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {product.discount_price ? (
                      <div>
                        <span className="text-green-600">{product.discount_price} د.ك</span>
                        <span className="text-xs text-gray-500 line-through mr-1">
                          {product.price} د.ك
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-800">{product.price} د.ك</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {product.category?.name || "بدون فئة"}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.is_active ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500">
                    {new Date(product.created_at).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => onActionClick(product)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <span>⋮</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsList;
