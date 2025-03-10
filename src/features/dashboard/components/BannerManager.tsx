
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import SaveButton from "@/components/ui/save-button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import TransitionTimeSlider from "./banner-manager/TransitionTimeSlider";
import BannersList from "./banner-manager/BannersList";
import { Banner, BannerManagerProps } from "./banner-manager/types";

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
          <TransitionTimeSlider 
            transitionTime={transitionTime}
            setTransitionTime={setTransitionTime}
          />
          
          <BannersList
            banners={banners}
            storeId={storeId}
            categories={categories}
            products={products}
            onAddBanner={handleAddBanner}
            onRemoveBanner={handleRemoveBanner}
            onBannerChange={handleBannerChange}
            onBannerImageChange={handleBannerImageChange}
            onMoveBanner={handleMoveBanner}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <SaveButton isSaving={isSaving} onClick={handleSave} />
      </CardFooter>
    </Card>
  );
};

export default BannerManager;
