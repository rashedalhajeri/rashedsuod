
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import { useStoreDetection } from "@/hooks/use-store-detection";

export const useProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use the store detection hook
  const { store, loading: storeLoading, error: storeError } = useStoreDetection();
  
  // Handle combined loading and error states
  const isLoading = loading || storeLoading;
  const combinedError = error || storeError;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!store || !productId) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .eq("store_id", store.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (!data) {
          throw new Error("المنتج غير موجود");
        }
        
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("حدث خطأ أثناء تحميل المنتج");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId, store]);

  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity > 0 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // This is a placeholder for actual cart functionality
    toast.success(`تمت إضافة ${product.name} إلى السلة`);
  };

  const formatCurrency = (price: number) => {
    return getCurrencyFormatter(store?.currency)(price);
  };

  const getAllImages = () => {
    const images = [];
    
    if (product?.image_url) {
      images.push(product.image_url);
    }
    
    if (product?.additional_images && Array.isArray(product.additional_images)) {
      images.push(...product.additional_images);
    }
    
    return images;
  };

  return {
    storeId: store?.id,
    product,
    loading: isLoading,
    error: combinedError,
    quantity,
    formatCurrency,
    handleQuantityChange,
    handleAddToCart,
    getAllImages
  };
};

export default useProductDetail;
