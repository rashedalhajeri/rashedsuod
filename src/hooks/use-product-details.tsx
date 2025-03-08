
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getProductById } from "@/utils/products/product-fetchers";

export function useProductDetails(productId: string | undefined, storeDomain: string | undefined) {
  const [product, setProduct] = useState<any>(null);
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        // Fetch store data first
        const { data: store, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('domain_name', storeDomain)
          .single();
        
        if (storeError) throw storeError;
        if (!store) {
          setError("لم يتم العثور على المتجر");
          return;
        }
        
        setStoreData(store);
        
        // Use the product client to fetch product
        if (productId) {
          const { data: productData, error: productError } = await getProductById(productId);
          
          if (productError) throw productError;
          if (!productData) {
            setError("لم يتم العثور على المنتج");
            return;
          }
          
          setProduct(productData);
        }
        
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("حدث خطأ أثناء تحميل بيانات المنتج");
      } finally {
        // Add delay for smooth UI transition
        setTimeout(() => {
          setLoading(false);
          setTimeout(() => {
            setShowContent(true);
          }, 100);
        }, 300);
      }
    };
    
    if (productId && storeDomain) {
      fetchProductData();
    }
  }, [productId, storeDomain]);

  // Format currency helper
  const formatCurrency = (price: number) => {
    const currencySymbol = storeData?.currency === 'KWD' ? 'د.ك' : 
                          storeData?.currency === 'SAR' ? 'ر.س' : 
                          storeData?.currency;
    
    return new Intl.NumberFormat('ar-SA', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(price) + ' ' + (currencySymbol || '');
  };

  // Calculate if product is out of stock
  const isOutOfStock = product?.track_inventory && 
                      product?.stock_quantity !== null && 
                      product?.stock_quantity <= 0;

  return {
    product,
    storeData,
    loading,
    error,
    showContent,
    formatCurrency,
    isOutOfStock
  };
}
