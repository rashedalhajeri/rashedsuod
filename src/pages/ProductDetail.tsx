
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreData } from "@/hooks/use-store-data";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import SaveButton from "@/components/ui/save-button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProductBasicInfo from "@/components/product/form/ProductBasicInfo";
import ProductAdvancedInfo from "@/components/product/form/ProductAdvancedInfo";
import ProductPreview from "@/components/product/form/ProductPreview";
import { useProductForm } from "@/components/product/form/useProductForm";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: storeData } = useStoreData();
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Fetch product data if editing an existing product
  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId || productId === 'new') return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
        
      if (error) throw error;
      
      if (!data) {
        throw new Error("المنتج غير موجود");
      }
      
      return {
        ...data,
        has_colors: Boolean(data.has_colors),
        has_sizes: Boolean(data.has_sizes),
        track_inventory: Boolean(data.track_inventory),
        require_customer_name: Boolean(data.require_customer_name),
        require_customer_image: Boolean(data.require_customer_image),
        available_colors: Array.isArray(data.available_colors) ? data.available_colors : [],
        available_sizes: Array.isArray(data.available_sizes) ? data.available_sizes : [],
        images: [
          ...(data.image_url ? [data.image_url] : []),
          ...(Array.isArray(data.additional_images) ? data.additional_images : [])
        ]
      };
    },
    enabled: !!productId && productId !== 'new' && !!storeData?.id,
  });
  
  // Fetch categories for the store
  useEffect(() => {
    if (storeData?.id) {
      const fetchCategories = async () => {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .eq('store_id', storeData.id)
          .order('name', { ascending: true });
        
        setCategories(data || []);
      };
      
      fetchCategories();
    }
  }, [storeData?.id]);
  
  // Initialize form with product data if editing, or empty if creating new
  const {
    formData,
    handleInputChange,
    handleSwitchChange,
    handleImagesChange,
    handleColorsChange,
    handleSizesChange,
    handleCategoryChange,
    toggleDiscount,
    isFormValid
  } = useProductForm(productData);

  const handleSave = async () => {
    if (!storeData?.id) {
      toast.error("لم يتم العثور على معرف المتجر");
      return;
    }
    
    if (!isFormValid) {
      toast.error("يرجى التأكد من ملء جميع الحقول المطلوبة");
      return;
    }
    
    try {
      setIsSaving(true);
      
      const productToSave = {
        store_id: storeData.id,
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
        additional_images: formData.images.length > 1 ? formData.images.slice(1) : [],
        category_id: formData.category_id || null,
        updated_at: new Date().toISOString()
      };
      
      if (productId && productId !== 'new') {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productToSave)
          .eq('id', productId);
          
        if (error) throw error;
        toast.success("تم تحديث المنتج بنجاح");
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productToSave]);
          
        if (error) throw error;
        toast.success("تم إضافة المنتج بنجاح");
      }
      
      navigate("/dashboard/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("حدث خطأ أثناء حفظ المنتج");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!productId || productId === 'new') return;
    
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      return;
    }
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
        
      if (error) throw error;
      
      toast.success("تم حذف المنتج بنجاح");
      navigate("/dashboard/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("حدث خطأ أثناء حذف المنتج");
    } finally {
      setIsSaving(false);
    }
  };

  const isNewProduct = !productId || productId === 'new';
  const pageTitle = isNewProduct ? "إضافة منتج جديد" : "تعديل المنتج";

  if (isLoading) {
    return <LoadingState message="جاري تحميل بيانات المنتج..." />;
  }

  if (error && !isNewProduct) {
    return (
      <ErrorState 
        title="خطأ في تحميل المنتج"
        message={error.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="container mx-auto py-8 px-4" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/dashboard/products")}>
            العودة للمنتجات
          </Button>
          <SaveButton isSaving={isSaving} onClick={handleSave} />
          {!isNewProduct && (
            <Button variant="destructive" onClick={handleDelete}>
              حذف المنتج
            </Button>
          )}
        </div>
      </div>

      <ProductBasicInfo
        name={formData.name}
        description={formData.description}
        price={formData.price}
        discount_price={formData.discount_price}
        images={formData.images}
        storeId={storeData?.id}
        handleChange={handleInputChange}
        handleImagesChange={handleImagesChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProductAdvancedInfo
            category_id={formData.category_id}
            track_inventory={formData.track_inventory}
            stock_quantity={formData.stock_quantity}
            has_colors={formData.has_colors}
            has_sizes={formData.has_sizes}
            require_customer_name={formData.require_customer_name}
            require_customer_image={formData.require_customer_image}
            available_colors={formData.available_colors}
            available_sizes={formData.available_sizes}
            categories={categories}
            handleChange={handleInputChange}
            handleSwitchChange={handleSwitchChange}
            handleCategoryChange={handleCategoryChange}
            handleColorsChange={handleColorsChange}
            handleSizesChange={handleSizesChange}
            formData={formData}
          />
        </div>
        
        <div>
          <ProductPreview
            name={formData.name}
            price={formData.price}
            discount_price={formData.discount_price}
            description={formData.description}
            images={formData.images}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
