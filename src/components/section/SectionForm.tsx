
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, BanknoteIcon, ShoppingBag, Sparkles, Percent, Tag, LayoutGrid, CheckIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createCurrencyFormatter } from "@/hooks/use-currency-formatter";

interface SectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  newSection: string;
  setNewSection: (name: string) => void;
  newSectionType: string;
  setNewSectionType: (type: string) => void;
  newCategoryId: string | null;
  setNewCategoryId: (id: string | null) => void;
  newProductIds: string[] | null;
  setNewProductIds: (ids: string[] | null) => void;
  newDisplayStyle: 'grid' | 'list';
  setNewDisplayStyle: (style: 'grid' | 'list') => void;
  handleAddSection: () => void;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  image_url?: string;
  price: number;
  discount_price?: number | null;
}

const SectionForm: React.FC<SectionFormProps> = ({
  isOpen,
  onClose,
  newSection,
  setNewSection,
  newSectionType,
  setNewSectionType,
  newCategoryId,
  setNewCategoryId,
  newProductIds,
  setNewProductIds,
  newDisplayStyle,
  setNewDisplayStyle,
  handleAddSection
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({});
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  
  const formatCurrency = createCurrencyFormatter("KWD");

  // Define section types
  const sectionTypes = [
    {
      id: 'best_selling',
      name: 'الأكثر مبيعاً',
      icon: <BanknoteIcon className="h-5 w-5 text-emerald-500" />,
      description: 'يعرض المنتجات الأكثر مبيعاً في متجرك',
      color: 'emerald'
    },
    {
      id: 'new_arrivals',
      name: 'وصل حديثاً',
      icon: <ShoppingBag className="h-5 w-5 text-blue-500" />,
      description: 'يعرض أحدث المنتجات التي تمت إضافتها',
      color: 'blue'
    },
    {
      id: 'featured',
      name: 'منتجات مميزة',
      icon: <Sparkles className="h-5 w-5 text-amber-500" />,
      description: 'يعرض المنتجات المميزة في متجرك',
      color: 'amber'
    },
    {
      id: 'on_sale',
      name: 'تخفيضات',
      icon: <Percent className="h-5 w-5 text-rose-500" />,
      description: 'يعرض المنتجات التي عليها خصومات',
      color: 'rose'
    },
    {
      id: 'category',
      name: 'فئة محددة',
      icon: <Tag className="h-5 w-5 text-purple-500" />,
      description: 'يعرض منتجات من فئة محددة',
      color: 'purple'
    },
    {
      id: 'custom',
      name: 'منتجات مخصصة',
      icon: <LayoutGrid className="h-5 w-5 text-indigo-500" />,
      description: 'يعرض منتجات مخصصة تختارها أنت',
      color: 'indigo'
    }
  ];

  // Fetch categories and products when the dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchProducts();
    }
  }, [isOpen]);

  // Filter products based on search query
  useEffect(() => {
    if (productSearchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const query = productSearchQuery.toLowerCase();
      setFilteredProducts(
        products.filter(product => 
          product.name.toLowerCase().includes(query)
        )
      );
    }
  }, [productSearchQuery, products]);

  // Filter categories based on search query
  useEffect(() => {
    if (categorySearchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const query = categorySearchQuery.toLowerCase();
      setFilteredCategories(
        categories.filter(category => 
          category.name.toLowerCase().includes(query)
        )
      );
    }
  }, [categorySearchQuery, categories]);

  // Fetch categories from the database
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
      setFilteredCategories(data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products from the database
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, image_url, price, discount_price')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
      setFilteredProducts(data || []);
      
      // Initialize selected products from newProductIds
      if (newProductIds) {
        const selectedMap: Record<string, boolean> = {};
        newProductIds.forEach(id => {
          selectedMap[id] = true;
        });
        setSelectedProducts(selectedMap);
      } else {
        setSelectedProducts({});
      }
      
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle product selection
  const handleProductSelect = (productId: string, isSelected: boolean) => {
    const updatedSelection = { ...selectedProducts, [productId]: isSelected };
    setSelectedProducts(updatedSelection);
    
    // Update newProductIds based on selection
    const selectedIds = Object.keys(updatedSelection).filter(id => updatedSelection[id]);
    setNewProductIds(selectedIds.length > 0 ? selectedIds : null);
  };

  const handleSubmit = () => {
    handleAddSection();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">إضافة قسم جديد</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 overflow-y-auto py-4 pr-2 pl-6">
          <div className="space-y-2">
            <Label htmlFor="section-name">اسم القسم</Label>
            <Input
              id="section-name"
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              placeholder="أدخل اسم القسم الجديد..."
              className="text-right"
            />
          </div>
          
          <div className="space-y-3">
            <Label>نوع القسم</Label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
              {sectionTypes.map(type => (
                <div 
                  key={type.id}
                  onClick={() => setNewSectionType(type.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all border",
                    newSectionType === type.id
                      ? `border-${type.color}-500 bg-${type.color}-50`
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className={`p-2 rounded-full bg-${type.color}-100 flex-shrink-0`}>
                    {type.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">{type.name}</div>
                    <div className="text-xs text-gray-500">{type.description}</div>
                  </div>
                  {newSectionType === type.id && (
                    <CheckIcon className="h-5 w-5 text-primary flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {newSectionType === 'category' && (
            <div className="space-y-2">
              <Label htmlFor="category-select">اختر الفئة</Label>
              <div className="border rounded-md p-2">
                <div className="mb-2">
                  <div className="relative">
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="ابحث عن فئة..."
                      className="pr-9 text-right"
                      value={categorySearchQuery}
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="max-h-[200px] overflow-y-auto space-y-1 mt-2">
                  {isLoading ? (
                    <div className="p-4 text-center text-sm text-gray-500">جاري التحميل...</div>
                  ) : filteredCategories.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">لا توجد فئات مطابقة</div>
                  ) : (
                    filteredCategories.map(category => (
                      <div
                        key={category.id}
                        onClick={() => setNewCategoryId(category.id)}
                        className={cn(
                          "p-2 rounded-md cursor-pointer hover:bg-gray-100 flex items-center justify-between",
                          newCategoryId === category.id ? "bg-primary/10" : ""
                        )}
                      >
                        <span>{category.name}</span>
                        {newCategoryId === category.id && (
                          <CheckIcon className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {newSectionType === 'custom' && (
            <div className="space-y-2">
              <Label>اختر المنتجات</Label>
              <div className="border rounded-md p-2">
                <div className="mb-2">
                  <div className="relative">
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="ابحث عن منتج..."
                      className="pr-9 text-right"
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-sm text-gray-500">جاري التحميل...</div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">لا توجد منتجات مطابقة</div>
                  ) : (
                    <div className="space-y-2">
                      {filteredProducts.map(product => (
                        <div key={product.id} className="flex items-center space-x-2 space-x-reverse rtl p-2 hover:bg-gray-50 rounded-md">
                          <input 
                            type="checkbox" 
                            id={`product-${product.id}`} 
                            className="rounded" 
                            checked={!!selectedProducts[product.id]}
                            onChange={(e) => handleProductSelect(product.id, e.target.checked)}
                          />
                          <Label htmlFor={`product-${product.id}`} className="flex items-center gap-2 cursor-pointer flex-1">
                            {product.image_url && (
                              <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="w-10 h-10 object-cover rounded-md" 
                              />
                            )}
                            <div className="flex-grow">
                              <div className="font-medium">{product.name}</div>
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
              </div>
              <div className="text-sm text-right text-gray-500">
                تم اختيار {Object.values(selectedProducts).filter(Boolean).length} منتج
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!newSection.trim() || (newSectionType === 'category' && !newCategoryId) || (newSectionType === 'custom' && (!newProductIds || newProductIds.length === 0))}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة القسم</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SectionForm;
