
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash, MoveUp, MoveDown } from "lucide-react";
import ImageUploadGrid from "@/components/ui/image-upload/ImageUploadGrid";
import { Banner } from "./types";

interface BannerItemProps {
  banner: Banner;
  index: number;
  storeId: string;
  categories: any[];
  products: any[];
  isLastBanner: boolean;
  isFirstBanner: boolean;
  onBannerChange: (index: number, field: keyof Banner, value: any) => void;
  onBannerImageChange: (index: number, images: string[]) => void;
  onRemoveBanner: (index: number) => void;
  onMoveBanner: (index: number, direction: 'up' | 'down') => void;
}

const BannerItem: React.FC<BannerItemProps> = ({
  banner,
  index,
  storeId,
  categories,
  products,
  isFirstBanner,
  isLastBanner,
  onBannerChange,
  onBannerImageChange,
  onRemoveBanner,
  onMoveBanner
}) => {
  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">البنر {index + 1}</h3>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onMoveBanner(index, 'up')} 
            disabled={isFirstBanner}
          >
            <MoveUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onMoveBanner(index, 'down')} 
            disabled={isLastBanner}
          >
            <MoveDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onRemoveBanner(index)}
          >
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="mb-2 block">صورة البنر</Label>
          <ImageUploadGrid 
            images={banner.image_url ? [banner.image_url] : []} 
            onImagesChange={(images) => onBannerImageChange(index, images)}
            maxImages={1}
            storeId={storeId}
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor={`banner-title-${index}`} className="mb-2 block">عنوان البنر</Label>
            <Input 
              id={`banner-title-${index}`}
              value={banner.title} 
              onChange={(e) => onBannerChange(index, 'title', e.target.value)}
              placeholder="اكتب عنوانًا للبنر"
            />
          </div>
          
          <div>
            <Label htmlFor={`banner-link-type-${index}`} className="mb-2 block">نوع الرابط</Label>
            <Select 
              value={banner.link_type} 
              onValueChange={(value) => onBannerChange(index, 'link_type', value as any)}
            >
              <SelectTrigger id={`banner-link-type-${index}`}>
                <SelectValue placeholder="اختر نوع الرابط" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون رابط</SelectItem>
                <SelectItem value="category">فئة</SelectItem>
                <SelectItem value="product">منتج</SelectItem>
                <SelectItem value="external">رابط خارجي</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {banner.link_type === 'category' && (
            <div>
              <Label htmlFor={`banner-link-category-${index}`} className="mb-2 block">اختر الفئة</Label>
              <Select 
                value={banner.link_url} 
                onValueChange={(value) => onBannerChange(index, 'link_url', value)}
              >
                <SelectTrigger id={`banner-link-category-${index}`}>
                  <SelectValue placeholder="اختر فئة" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {banner.link_type === 'product' && (
            <div>
              <Label htmlFor={`banner-link-product-${index}`} className="mb-2 block">اختر المنتج</Label>
              <Select 
                value={banner.link_url} 
                onValueChange={(value) => onBannerChange(index, 'link_url', value)}
              >
                <SelectTrigger id={`banner-link-product-${index}`}>
                  <SelectValue placeholder="اختر منتج" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product: any) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {banner.link_type === 'external' && (
            <div>
              <Label htmlFor={`banner-link-url-${index}`} className="mb-2 block">الرابط الخارجي</Label>
              <Input 
                id={`banner-link-url-${index}`}
                value={banner.link_url} 
                onChange={(e) => onBannerChange(index, 'link_url', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Switch 
              id={`banner-active-${index}`}
              checked={banner.is_active}
              onCheckedChange={(checked) => onBannerChange(index, 'is_active', checked)}
            />
            <Label htmlFor={`banner-active-${index}`}>تفعيل البنر</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerItem;
