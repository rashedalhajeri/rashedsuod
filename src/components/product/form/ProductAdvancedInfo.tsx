
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import FormSection from "@/components/product/form/FormSection";
import ConditionalSections from "@/components/product/form/ConditionalSections";
import { Box, Tag, User, Image as ImageIcon } from "lucide-react";

interface ProductAdvancedInfoProps {
  category_id: string | null;
  track_inventory: boolean;
  stock_quantity: number;
  has_colors: boolean;
  has_sizes: boolean;
  require_customer_name: boolean;
  require_customer_image: boolean;
  available_colors: string[] | null;
  available_sizes: string[] | null;
  categories: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleCategoryChange: (categoryId: string) => void;
  formData: any;
}

const ProductAdvancedInfo: React.FC<ProductAdvancedInfoProps> = ({
  category_id,
  track_inventory,
  stock_quantity,
  has_colors,
  has_sizes,
  require_customer_name,
  require_customer_image,
  available_colors,
  available_sizes,
  categories,
  handleChange,
  handleSwitchChange,
  handleCategoryChange,
  formData,
}) => {
  const handleColorsChange = (colors: string[]) => {
    handleSwitchChange('available_colors', colors as any);
  };

  const handleSizesChange = (sizes: string[]) => {
    handleSwitchChange('available_sizes', sizes as any);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>معلومات متقدمة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">الفئة</Label>
            <Select 
              value={category_id || ""} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">بدون فئة</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="track_inventory" className="mb-1">تتبع المخزون</Label>
              <Switch 
                id="track_inventory"
                checked={track_inventory}
                onCheckedChange={(checked) => handleSwitchChange('track_inventory', checked)}
              />
            </div>
            
            {track_inventory && (
              <div className="mt-3">
                <Label htmlFor="stock_quantity">الكمية المتوفرة</Label>
                <input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={stock_quantity}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-md font-medium">خيارات المنتج</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Colors option */}
            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-md">
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-blue-500" />
                <div>
                  <Label htmlFor="has_colors" className="cursor-pointer">الألوان</Label>
                  <p className="text-xs text-gray-500">إضافة خيارات الألوان للمنتج</p>
                </div>
              </div>
              <Switch 
                id="has_colors"
                checked={has_colors}
                onCheckedChange={(checked) => handleSwitchChange('has_colors', checked)}
              />
            </div>
            
            {/* Sizes option */}
            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-md">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-green-500" />
                <div>
                  <Label htmlFor="has_sizes" className="cursor-pointer">المقاسات</Label>
                  <p className="text-xs text-gray-500">إضافة خيارات المقاسات للمنتج</p>
                </div>
              </div>
              <Switch 
                id="has_sizes"
                checked={has_sizes}
                onCheckedChange={(checked) => handleSwitchChange('has_sizes', checked)}
              />
            </div>
          </div>
          
          {(has_colors || has_sizes) && (
            <ConditionalSections 
              formData={formData}
              handleColorsChange={handleColorsChange}
              handleSizesChange={handleSizesChange}
            />
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-md font-medium">خيارات إضافية</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Require customer name */}
            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-md">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-purple-500" />
                <div>
                  <Label htmlFor="require_customer_name" className="cursor-pointer">طلب اسم العميل</Label>
                  <p className="text-xs text-gray-500">سيطلب من العميل إدخال اسمه عند إضافة المنتج للسلة</p>
                </div>
              </div>
              <Switch 
                id="require_customer_name"
                checked={require_customer_name}
                onCheckedChange={(checked) => handleSwitchChange('require_customer_name', checked)}
              />
            </div>
            
            {/* Require customer image */}
            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-md">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-red-500" />
                <div>
                  <Label htmlFor="require_customer_image" className="cursor-pointer">طلب صورة من العميل</Label>
                  <p className="text-xs text-gray-500">سيطلب من العميل رفع صورة عند إضافة المنتج للسلة</p>
                </div>
              </div>
              <Switch 
                id="require_customer_image"
                checked={require_customer_image}
                onCheckedChange={(checked) => handleSwitchChange('require_customer_image', checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductAdvancedInfo;
