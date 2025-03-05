
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getCurrencyFormatter } from "@/hooks/use-store-data";

export const useProductDetail = () => {
  const { storeId, productId } = useParams<{ storeId: string; productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const formatCurrency = getCurrencyFormatter("SAR");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("معرف المنتج غير متوفر");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await getProductById(productId);

        if (error) throw error;
        if (!data) {
          setError("المنتج غير موجود");
          return;
        }

        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("حدث خطأ أثناء تحميل المنتج");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(product?.stock_quantity || 10, value));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    toast.success("تمت إضافة المنتج إلى سلة التسوق");
  };

  const getAllImages = () => {
    if (!product) return [];
    
    const images = [];
    if (product.image_url) images.push(product.image_url);
    if (product.additional_images && Array.isArray(product.additional_images)) {
      images.push(...product.additional_images);
    }
    
    return images;
  };

  return {
    storeId,
    product,
    loading,
    error,
    quantity,
    formatCurrency,
    handleQuantityChange,
    handleAddToCart,
    getAllImages
  };
};
