
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Grid, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
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
              placeholder="اسم القسم الجديد..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="section-type">نوع القسم</Label>
            <Select 
              value={newSectionType}
              onValueChange={setNewSectionType}
            >
              <SelectTrigger id="section-type">
                <SelectValue placeholder="اختر نوع القسم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="best_selling">الأكثر مبيعاً</SelectItem>
                <SelectItem value="new_arrivals">وصل حديثاً</SelectItem>
                <SelectItem value="featured">منتجات مميزة</SelectItem>
                <SelectItem value="on_sale">تخفيضات</SelectItem>
                <SelectItem value="category">فئة محددة</SelectItem>
                <SelectItem value="custom">منتجات مخصصة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {newSectionType === 'category' && (
            <div className="space-y-2">
              <Label htmlFor="category-select">اختر الفئة</Label>
              <Select 
                value={newCategoryId || ""}
                onValueChange={(value) => setNewCategoryId(value || null)}
              >
                <SelectTrigger id="category-select">
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
                      <div key={product.id} className="flex items-center space-x-2 space-x-reverse p-2 hover:bg-gray-50 rounded-md">
                        <input 
                          type="checkbox" 
                          id={`product-${product.id}`} 
                          className="rounded" 
                          checked={!!selectedProducts[product.id]}
                          onChange={(e) => handleProductSelect(product.id, e.target.checked)}
                        />
                        <Label htmlFor={`product-${product.id}`} className="flex items-center gap-2 cursor-pointer">
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
