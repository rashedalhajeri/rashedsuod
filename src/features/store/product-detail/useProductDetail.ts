
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProductDetail = (productId: string, storeData: any) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const fetchProduct = async () => {
    if (!productId || !storeData?.id) {
      setError("معلومات المنتج أو المتجر غير متوفرة");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('store_id', storeData.id)
        .single();
      
      if (error) {
        console.error('Error fetching product:', error);
        setError("حدث خطأ في جلب بيانات المنتج");
        setLoading(false);
        return;
      }
      
      if (!data) {
        setError("لم يتم العثور على المنتج");
        setLoading(false);
        return;
      }
      
      setProduct(data);
    } catch (err) {
      console.error('Error in fetchProduct:', err);
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (productId && storeData) {
      fetchProduct();
    }
  }, [productId, storeData]);
  
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: storeData?.currency || 'KWD'
    }).format(price);
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity));
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      // Here would be the cart implementation
      // For now we just show a toast message
      toast.success(`تمت إضافة ${product.name} إلى سلة التسوق`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('حدث خطأ أثناء إضافة المنتج إلى السلة');
    }
  };
  
  const getAllImages = () => {
    if (!product) return [];
    
    const images = [];
    
    if (product.image_url) {
      images.push(product.image_url);
    }
    
    if (product.additional_images && Array.isArray(product.additional_images)) {
      images.push(...product.additional_images);
    }
    
    return images;
  };
  
  return {
    product,
    loading,
    error,
    quantity,
    formatCurrency,
    handleQuantityChange,
    handleAddToCart,
    getAllImages,
    refetch: fetchProduct
  };
};
