
import React, { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/utils/product-helpers";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import ImageUploadGrid from "@/components/ui/image-upload-grid";
import { Box, ImageIcon, Percent, Tag, User } from "lucide-react";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  discount_price?: number | null;
  stock_quantity: number;
  images: string[];
  track_inventory: boolean;
  has_colors: boolean;
  has_sizes: boolean;
  require_customer_name: boolean;
  require_customer_image: boolean;
  available_colors?: string[] | null;
  available_sizes?: string[] | null;
}

interface ProductFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  storeId?: string;
  onAddSuccess: () => void;
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  isOpen,
  onOpenChange,
  storeId,
  onAddSuccess
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    discount_price: null,
    stock_quantity: 0,
    images: [],
    track_inventory: false,
    has_colors: false,
    has_sizes: false,
    require_customer_name: false,
    require_customer_image: false,
    available_colors: [],
    available_sizes: []
  });

  const handleAddProduct = async () => {
    try {
      if (!storeId) {
        toast.error("لم يتم العثور على معرف المتجر");
        return;
      }
      
      if (!formData.name || formData.price <= 0) {
        toast.error("يرجى ملء جميع الحقول المطلوبة");
        return;
      }
      
      if (formData.images.length === 0) {
        toast.error("يرجى إضافة صورة واحدة على الأقل");
        return;
      }
      
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            store_id: storeId,
            name: formData.name,
            description: formData.description,
            price: formData.price,
            discount_price: formData.discount_price,
            stock_quantity: formData.track_inventory ? formData.stock_quantity : null,
            track_inventory: formData.track_inventory,
            has_colors: formData.has_colors,
            has_sizes: formData.has_sizes,
            require_customer_name: formData.require_customer_name,
            require_customer_image: formData.require_customer_image,
            available_colors: formData.has_colors ? formData.available_colors : null,
            available_sizes: formData.has_sizes ? formData.available_sizes : null,
            image_url: formData.images[0] || null,
            additional_images: formData.images.length > 1 ? formData.images.slice(1) : []
          }
        ])
        .select();
        
      if (error) {
        console.error("Error adding product:", error);
        toast.error("حدث خطأ أثناء إضافة المنتج");
        return;
      }
      
      toast.success("تمت إضافة المنتج بنجاح");
      onOpenChange(false);
      resetForm();
      onAddSuccess();
    } catch (error) {
      console.error("Error in handleAddProduct:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      discount_price: null,
      stock_quantity: 0,
      images: [],
      track_inventory: false,
      has_colors: false,
      has_sizes: false,
      require_customer_name: false,
      require_customer_image: false,
      available_colors: [],
      available_sizes: []
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock_quantity' || name === 'discount_price' 
        ? parseFloat(value) || 0 
        : value
    }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة منتج جديد</DialogTitle>
          <DialogDescription>
            أدخل معلومات المنتج الذي تريد إضافته إلى متجرك.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">اسم المنتج <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="أدخل اسم المنتج" 
                value={formData.name} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">وصف المنتج</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="أدخل وصف المنتج"
                value={formData.description} 
                onChange={handleInputChange} 
                rows={4}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="price">السعر <span className="text-red-500">*</span></Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    placeholder="0.000" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    discount_price: prev.discount_price === null ? prev.price : null
                  }))}
                >
                  <Percent className="h-4 w-4" />
                  <span>خصم</span>
                </Button>
              </div>
            </div>
            
            {formData.discount_price !== null && (
              <div className="grid gap-2">
                <Label htmlFor="discount_price">السعر بعد الخصم <span className="text-red-500">*</span></Label>
                <Input 
                  id="discount_price" 
                  name="discount_price" 
                  type="number" 
                  placeholder="0.000" 
                  value={formData.discount_price} 
                  onChange={handleInputChange} 
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label htmlFor="track_inventory" className="mb-1">تتبع المخزون</Label>
                <span className="text-sm text-gray-500">
                  {formData.track_inventory ? 'كمية محدودة' : 'كمية غير محدودة'}
                </span>
              </div>
              <Switch 
                id="track_inventory"
                checked={formData.track_inventory}
                onCheckedChange={(checked) => handleSwitchChange('track_inventory', checked)}
              />
            </div>
            
            {formData.track_inventory && (
              <div className="grid gap-2">
                <Label htmlFor="stock_quantity">الكمية المتوفرة</Label>
                <Input 
                  id="stock_quantity" 
                  name="stock_quantity" 
                  type="number" 
                  placeholder="0" 
                  value={formData.stock_quantity} 
                  onChange={handleInputChange} 
                />
              </div>
            )}
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                خصائص متقدمة
              </h3>
              
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Box className="h-4 w-4 text-blue-500" />
                    <Label htmlFor="has_colors" className="cursor-pointer">الألوان</Label>
                  </div>
                  <Switch 
                    id="has_colors"
                    checked={formData.has_colors}
                    onCheckedChange={(checked) => handleSwitchChange('has_colors', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-500" />
                    <Label htmlFor="has_sizes" className="cursor-pointer">المقاسات</Label>
                  </div>
                  <Switch 
                    id="has_sizes"
                    checked={formData.has_sizes}
                    onCheckedChange={(checked) => handleSwitchChange('has_sizes', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-500" />
                    <Label htmlFor="require_customer_name" className="cursor-pointer">طلب اسم العميل</Label>
                  </div>
                  <Switch 
                    id="require_customer_name"
                    checked={formData.require_customer_name}
                    onCheckedChange={(checked) => handleSwitchChange('require_customer_name', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-red-500" />
                    <Label htmlFor="require_customer_image" className="cursor-pointer">طلب صورة من العميل</Label>
                  </div>
                  <Switch 
                    id="require_customer_image"
                    checked={formData.require_customer_image}
                    onCheckedChange={(checked) => handleSwitchChange('require_customer_image', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-md font-medium">صور المنتج <span className="text-red-500">*</span></Label>
              <span className="text-sm text-gray-500">
                ({formData.images.length} من 5)
              </span>
            </div>
            
            <ImageUploadGrid 
              images={formData.images}
              onImagesChange={handleImagesChange}
              maxImages={5}
              storeId={storeId}
            />
            
            <p className="text-xs text-gray-500 text-center">
              الصورة الأولى هي الصورة الرئيسية للمنتج. يمكنك إضافة حتى 5 صور.
            </p>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 w-full">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button 
              onClick={handleAddProduct}
              disabled={!formData.name || formData.price <= 0 || formData.images.length === 0}
              className="w-full sm:w-auto"
            >
              إضافة المنتج
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
