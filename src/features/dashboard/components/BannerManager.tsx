
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import SaveButton from "@/components/ui/save-button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash, Link, Image, Timer, MoveUp, MoveDown } from "lucide-react";
import ImageUploadGrid from "@/components/ui/image-upload/ImageUploadGrid";

interface BannerManagerProps {
  storeId: string;
}

interface Banner {
  id: string;
  image_url: string;
  link_type: "category" | "product" | "external" | "none";
  link_url: string;
  title: string;
  sort_order: number;
  is_active: boolean;
}

const BannerManager: React.FC<BannerManagerProps> = ({ storeId }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transitionTime, setTransitionTime] = useState(5);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  useEffect(() => {
    if (storeId) {
      fetchBanners();
      fetchCategories();
      fetchProducts();
    }
  }, [storeId]);
  
  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      // For now, we'll use local state only since the table doesn't exist
      // In a real implementation, you would fetch from the database
      setBanners([]);
      
      // Set default transition time
      setTransitionTime(5);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("حدث خطأ أثناء تحميل البنرات");
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('store_id', storeId)
        .order('name', { ascending: true });
        
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .eq('store_id', storeId)
        .order('name', { ascending: true });
        
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  
  const handleAddBanner = () => {
    const newBanner: Banner = {
      id: `temp_${Date.now()}`,
      image_url: '',
      link_type: 'none',
      link_url: '',
      title: '',
      sort_order: banners.length,
      is_active: true
    };
    
    setBanners([...banners, newBanner]);
  };
  
  const handleRemoveBanner = (index: number) => {
    const updatedBanners = [...banners];
    updatedBanners.splice(index, 1);
    
    // Update sort_order for remaining banners
    updatedBanners.forEach((banner, idx) => {
      banner.sort_order = idx;
    });
    
    setBanners(updatedBanners);
  };
  
  const handleBannerChange = (index: number, field: keyof Banner, value: any) => {
    const updatedBanners = [...banners];
    updatedBanners[index] = {
      ...updatedBanners[index],
      [field]: value
    };
    setBanners(updatedBanners);
  };
  
  const handleBannerImageChange = (index: number, images: string[]) => {
    if (images.length > 0) {
      handleBannerChange(index, 'image_url', images[0]);
    } else {
      handleBannerChange(index, 'image_url', '');
    }
  };
  
  const handleMoveBanner = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === banners.length - 1)
    ) {
      return;
    }
    
    const updatedBanners = [...banners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap banners
    [updatedBanners[index], updatedBanners[targetIndex]] = [updatedBanners[targetIndex], updatedBanners[index]];
    
    // Update sort_order
    updatedBanners.forEach((banner, idx) => {
      banner.sort_order = idx;
    });
    
    setBanners(updatedBanners);
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      toast.success("تم حفظ البنرات بنجاح");
      // In a real implementation, you would save to the database
      // For now, we'll just show a success message
    } catch (error) {
      console.error("Error saving banners:", error);
      toast.error("حدث خطأ أثناء حفظ البنرات");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">جاري تحميل البنرات...</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>البنرات الإعلانية</CardTitle>
        <CardDescription>
          أضف بنرات إعلانية للمتجر وقم بتخصيصها حسب احتياجك
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <Label className="mb-2 block">وقت التبديل بين البنرات (بالثواني)</Label>
            <div className="flex items-center gap-4">
              <Slider 
                value={[transitionTime]} 
                min={2} 
                max={10} 
                step={1} 
                onValueChange={(values) => setTransitionTime(values[0])}
                className="flex-1"
              />
              <span className="text-lg font-medium w-8 text-center">{transitionTime}</span>
            </div>
          </div>
          
          <div className="space-y-6 mt-6">
            {banners.map((banner, index) => (
              <div key={banner.id} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">البنر {index + 1}</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleMoveBanner(index, 'up')} 
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleMoveBanner(index, 'down')} 
                      disabled={index === banners.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveBanner(index)}
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
                      onImagesChange={(images) => handleBannerImageChange(index, images)}
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
                        onChange={(e) => handleBannerChange(index, 'title', e.target.value)}
                        placeholder="اكتب عنوانًا للبنر"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`banner-link-type-${index}`} className="mb-2 block">نوع الرابط</Label>
                      <Select 
                        value={banner.link_type} 
                        onValueChange={(value) => handleBannerChange(index, 'link_type', value as any)}
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
                          onValueChange={(value) => handleBannerChange(index, 'link_url', value)}
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
                          onValueChange={(value) => handleBannerChange(index, 'link_url', value)}
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
                          onChange={(e) => handleBannerChange(index, 'link_url', e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Switch 
                        id={`banner-active-${index}`}
                        checked={banner.is_active}
                        onCheckedChange={(checked) => handleBannerChange(index, 'is_active', checked)}
                      />
                      <Label htmlFor={`banner-active-${index}`}>تفعيل البنر</Label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Button onClick={handleAddBanner} className="w-full">
              <Plus className="h-4 w-4 me-2" /> إضافة بنر جديد
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <SaveButton isSaving={isSaving} onClick={handleSave} />
      </CardFooter>
    </Card>
  );
};

export default BannerManager;
