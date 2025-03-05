
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import { useCart } from "@/contexts/CartContext";

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
  stock_quantity: number;
  additional_images: string[] | null;
}

export const useProductDetail = () => {
  const { storeId, productId } = useParams<{ storeId: string; productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
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

        // Transform data to ensure additional_images is always an array
        const processedProduct: Product = {
          ...data,
          additional_images: Array.isArray(data.additional_images) 
            ? data.additional_images 
            : data.additional_images 
              ? [data.additional_images as string]
              : []
        };

        setProduct(processedProduct);
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
    if (!product) return;
    const maxStock = product.stock_quantity || 10;
    const newQuantity = Math.max(1, Math.min(maxStock, value));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url
    }, quantity);
    
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
