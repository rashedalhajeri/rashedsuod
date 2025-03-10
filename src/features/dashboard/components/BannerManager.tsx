
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import SaveButton from "@/components/ui/save-button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import TransitionTimeSlider from "./banner-manager/TransitionTimeSlider";
import BannersList from "./banner-manager/BannersList";
import BannerPreview from "./banner-manager/BannerPreview";
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
      // Use the type assertion to tell TypeScript that the query is valid
      const { data: bannersData, error: bannersError } = await supabase
        .from('banners')
        .select('*')
        .eq('store_id', storeId)
        .order('sort_order', { ascending: true });
      
      if (bannersError) throw bannersError;
      
      // Use the type assertion to tell TypeScript that the query is valid
      const { data: settingsData, error: settingsError } = await supabase
        .from('banner_settings')
        .select('transition_time')
        .eq('store_id', storeId)
        .single();
      
      if (!settingsError && settingsData) {
        setTransitionTime(settingsData.transition_time);
      }
      
      // Transform the data to match the Banner type
      const typedBanners = bannersData?.map(banner => ({
        id: banner.id,
        image_url: banner.image_url,
        link_type: banner.link_type as "category" | "product" | "external" | "none",
        link_url: banner.link_url || "",
        title: banner.title || "",
        sort_order: banner.sort_order,
        is_active: banner.is_active
      })) || [];
      
      setBanners(typedBanners);
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
    
    [updatedBanners[index], updatedBanners[targetIndex]] = [updatedBanners[targetIndex], updatedBanners[index]];
    
    updatedBanners.forEach((banner, idx) => {
      banner.sort_order = idx;
    });
    
    setBanners(updatedBanners);
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Use the type assertion to tell TypeScript that the query is valid
      const { error: settingsError } = await supabase
        .from('banner_settings')
        .upsert({ 
          store_id: storeId,
          transition_time: transitionTime
        }, { onConflict: 'store_id' });
      
      if (settingsError) throw settingsError;
      
      // Use the type assertion to tell TypeScript that the query is valid
      const { data: existingBanners, error: fetchError } = await supabase
        .from('banners')
        .select('id')
        .eq('store_id', storeId);
      
      if (fetchError) throw fetchError;
      
      const existingIds = existingBanners?.map(banner => banner.id) || [];
      
      const currentIds = banners
        .filter(banner => !banner.id.toString().startsWith('temp_'))
        .map(banner => banner.id);
      
      const idsToDelete = existingIds.filter(id => !currentIds.includes(id));
      
      if (idsToDelete.length > 0) {
        // Use the type assertion to tell TypeScript that the query is valid
        const { error: deleteError } = await supabase
          .from('banners')
          .delete()
          .in('id', idsToDelete);
        
        if (deleteError) throw deleteError;
      }
      
      // Prepare banners for database by ensuring they match the expected type
      const bannersToUpsert = banners.map((banner, index) => ({
        id: banner.id.toString().startsWith('temp_') ? undefined : banner.id,
        store_id: storeId,
        image_url: banner.image_url,
        link_type: banner.link_type,
        link_url: banner.link_url,
        title: banner.title,
        sort_order: index,
        is_active: banner.is_active
      }));
      
      // Use the type assertion to tell TypeScript that the query is valid
      const { error: upsertError } = await supabase
        .from('banners')
        .upsert(bannersToUpsert, { onConflict: 'id' });
      
      if (upsertError) throw upsertError;
      
      toast.success("تم حفظ البنرات بنجاح");
      fetchBanners();
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          <div>
            <BannerPreview 
              banners={banners}
              transitionTime={transitionTime}
            />
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
