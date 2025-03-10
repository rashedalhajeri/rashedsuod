
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Grid, List, BanknoteIcon, ShoppingBag, Sparkles, Percent, Tag, LayoutGrid } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({});

  // Fetch categories and products when the dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchProducts();
    }
  }, [isOpen]);

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
        .select('id, name, image_url')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
      
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

  // Get section icon based on type
  const getSectionTypeIcon = (type: string) => {
    switch (type) {
      case 'best_selling': return <BanknoteIcon className="h-5 w-5 text-emerald-500" />;
      case 'new_arrivals': return <ShoppingBag className="h-5 w-5 text-blue-500" />;
      case 'featured': return <Sparkles className="h-5 w-5 text-amber-500" />;
      case 'on_sale': return <Percent className="h-5 w-5 text-rose-500" />;
      case 'category': return <Tag className="h-5 w-5 text-purple-500" />;
      case 'custom': return <LayoutGrid className="h-5 w-5 text-indigo-500" />;
      default: return <LayoutGrid className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle>إضافة قسم جديد</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
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
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNewSectionType('best_selling')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                  newSectionType === 'best_selling'
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30"
                )}
              >
                <div className="p-2 rounded-full bg-emerald-100">
                  <BanknoteIcon className="h-5 w-5 text-emerald-500" />
                </div>
                <span className="text-sm font-medium">الأكثر مبيعاً</span>
              </button>
              
              <button
                type="button"
                onClick={() => setNewSectionType('new_arrivals')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                  newSectionType === 'new_arrivals'
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/30"
                )}
              >
                <div className="p-2 rounded-full bg-blue-100">
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-sm font-medium">وصل حديثاً</span>
              </button>
              
              <button
                type="button"
                onClick={() => setNewSectionType('featured')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                  newSectionType === 'featured'
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-200 hover:border-amber-200 hover:bg-amber-50/30"
                )}
              >
                <div className="p-2 rounded-full bg-amber-100">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                </div>
                <span className="text-sm font-medium">منتجات مميزة</span>
              </button>
              
              <button
                type="button"
                onClick={() => setNewSectionType('on_sale')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                  newSectionType === 'on_sale'
                    ? "border-rose-500 bg-rose-50"
                    : "border-gray-200 hover:border-rose-200 hover:bg-rose-50/30"
                )}
              >
                <div className="p-2 rounded-full bg-rose-100">
                  <Percent className="h-5 w-5 text-rose-500" />
                </div>
                <span className="text-sm font-medium">تخفيضات</span>
              </button>
              
              <button
                type="button"
                onClick={() => setNewSectionType('category')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                  newSectionType === 'category'
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/30"
                )}
              >
                <div className="p-2 rounded-full bg-purple-100">
                  <Tag className="h-5 w-5 text-purple-500" />
                </div>
                <span className="text-sm font-medium">فئة محددة</span>
              </button>
              
              <button
                type="button"
                onClick={() => setNewSectionType('custom')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                  newSectionType === 'custom'
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30"
                )}
              >
                <div className="p-2 rounded-full bg-indigo-100">
                  <LayoutGrid className="h-5 w-5 text-indigo-500" />
                </div>
                <span className="text-sm font-medium">منتجات مخصصة</span>
              </button>
            </div>
          </div>

          {newSectionType === 'category' && (
            <div className="space-y-2">
              <Label htmlFor="category-select">اختر الفئة</Label>
              <Select 
                value={newCategoryId || ""}
                onValueChange={(value) => setNewCategoryId(value || null)}
              >
                <SelectTrigger id="category-select" className="text-right">
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {newSectionType === 'custom' && (
            <div className="space-y-2">
              <Label>اختر المنتجات</Label>
              <div className="border p-2 rounded-md h-64 overflow-y-auto bg-white">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="text-sm text-gray-500">جاري التحميل...</span>
                  </div>
                ) : products.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="text-sm text-gray-500">لا توجد منتجات متاحة</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {products.map(product => (
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
                              className="w-8 h-8 object-cover rounded-md" 
                            />
                          )}
                          <span>{product.name}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>طريقة العرض</Label>
            <RadioGroup 
              value={newDisplayStyle}
              onValueChange={(value) => setNewDisplayStyle(value as 'grid' | 'list')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="grid" id="display-grid" />
                <Label htmlFor="display-grid" className="flex items-center gap-2 cursor-pointer">
                  <Grid size={16} />
                  <span>شبكة</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="list" id="display-list" />
                <Label htmlFor="display-list" className="flex items-center gap-2 cursor-pointer">
                  <List size={16} />
                  <span>قائمة</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
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
