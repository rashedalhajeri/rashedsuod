
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import DashboardLayout from "@/layouts/DashboardLayout";
import { ArrowLeft, Smartphone, Tablet, Monitor, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-media-query";
import StoreLayout from "@/components/store/StoreLayout";
import StoreContent from "@/components/store/StoreContent";
import PromoBanner from "@/components/store/banner/PromoBanner";

const StorePreview = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [storeData, setStoreData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [isLoading, setIsLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (storeId) {
      fetchStoreData();
    }
  }, [storeId]);
  
  const fetchStoreData = async () => {
    setIsLoading(true);
    try {
      // Fetch store details
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .single();
      
      if (storeError) throw storeError;
      setStoreData(store);
      
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .eq('is_active', true)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      
      if (productsError) throw productsError;
      setProducts(productsData || []);
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select(`
          name,
          products:products(count)
        `)
        .eq('store_id', storeId);
      
      if (categoriesError) throw categoriesError;
      
      const categoriesWithProducts = categoriesData
        ?.filter(cat => cat.products.length > 0)
        .map(cat => cat.name) || [];
      
      setCategories(categoriesWithProducts);
      
      // Fetch sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('sections')
        .select('name')
        .eq('store_id', storeId)
        .eq('is_active', true);
      
      if (sectionsError) throw sectionsError;
      
      const sectionNames = sectionsData?.map(sec => sec.name) || [];
      setSections(sectionNames);
      
      // Featured products
      const { data: featuredProductsData, error: featuredError } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .eq('is_featured', true)
        .eq('is_active', true)
        .is('deleted_at', null)
        .limit(4);
      
      if (featuredError) throw featuredError;
      setFeaturedProducts(featuredProductsData || []);
      
      // Best selling products
      const { data: bestSellingProductsData, error: bestSellingError } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .eq('is_active', true)
        .is('deleted_at', null)
        .order('sales_count', { ascending: false })
        .limit(8);
      
      if (bestSellingError) throw bestSellingError;
      setBestSellingProducts(bestSellingProductsData || []);
      
    } catch (error) {
      console.error("Error fetching store data:", error);
      toast.error("حدث خطأ أثناء تحميل بيانات المتجر");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get the appropriate device frame width for preview
  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile':
        return 'w-full max-w-[375px]';
      case 'tablet':
        return 'w-full max-w-[768px]';
      case 'desktop':
        return 'w-full max-w-[1024px]';
      default:
        return 'w-full max-w-[375px]';
    }
  };
  
  // Get device icon for the currently selected mode
  const getDeviceIcon = () => {
    switch (previewMode) {
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      case 'tablet':
        return <Tablet className="h-5 w-5" />;
      case 'desktop':
        return <Monitor className="h-5 w-5" />;
      default:
        return <Smartphone className="h-5 w-5" />;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="ghost" className="mr-2">
                <ArrowLeft className="h-4 w-4 ml-1" />
                العودة للوحة التحكم
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">معاينة المتجر</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="bg-white"
              onClick={() => fetchStoreData()}
              title="تحديث المعاينة"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <div className="bg-white border rounded-md flex">
              <Button 
                variant={previewMode === 'mobile' ? 'secondary' : 'ghost'} 
                onClick={() => setPreviewMode('mobile')}
                className="rounded-r-none"
                title="معاينة الجوال"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button 
                variant={previewMode === 'tablet' ? 'secondary' : 'ghost'} 
                onClick={() => setPreviewMode('tablet')}
                className="rounded-none border-r border-l"
                title="معاينة التابلت"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button 
                variant={previewMode === 'desktop' ? 'secondary' : 'ghost'} 
                onClick={() => setPreviewMode('desktop')}
                className="rounded-l-none"
                title="معاينة سطح المكتب"
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <Card className="bg-gray-100 p-4 flex justify-center overflow-hidden">
          <div className={`${getPreviewWidth()} bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 h-[700px] overflow-y-auto`}>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">جاري تحميل المعاينة...</p>
              </div>
            ) : (
              <div className="h-full">
                <StoreLayout storeData={storeData}>
                  <>
                    <PromoBanner storeDomain={storeData?.domain_name} />
                    <StoreContent 
                      storeData={storeData}
                      products={products}
                      categories={categories}
                      sections={sections}
                      featuredProducts={featuredProducts}
                      bestSellingProducts={bestSellingProducts}
                    />
                  </>
                </StoreLayout>
              </div>
            )}
          </div>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            {previewMode === 'mobile' ? 'معاينة تصميم المتجر على الجوال' : 
             previewMode === 'tablet' ? 'معاينة تصميم المتجر على التابلت' :
             'معاينة تصميم المتجر على سطح المكتب'}
          </p>
          <p className="text-xs text-gray-400">
            قم بزيارة <Link to={`/store/${storeData?.domain_name}`} className="text-primary-500 underline" target="_blank">
              {storeData?.domain_name && `store/${storeData.domain_name}`}
            </Link> لرؤية المتجر بشكل كامل
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StorePreview;
