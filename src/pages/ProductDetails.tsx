
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/currency';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';

const ProductDetails = () => {
  const { productId, storeDomain } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch the product details
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (error) throw error;
        
        setProduct(data);
      } catch (err: any) {
        console.error('Error fetching product details:', err);
        setError(err.message || 'حدث خطأ في تحميل تفاصيل المنتج');
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-6 px-4 text-center">
        <p className="text-red-500 text-lg">{error}</p>
        <p className="mt-4">يرجى المحاولة مرة أخرى لاحقًا</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto py-6 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
        <p className="text-gray-600">لم نتمكن من العثور على المنتج المطلوب</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* صورة المنتج */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={product.image_url || '/placeholder.svg'} 
            alt={product.name} 
            className="w-full h-full object-contain object-center aspect-square"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
        
        {/* تفاصيل المنتج */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          
          {/* السعر - دائمًا بالدينار الكويتي */}
          <div className="flex items-center gap-2">
            {product.discount_price ? (
              <>
                <p className="text-xl font-bold text-red-600">{formatCurrency(product.discount_price, 'KWD')}</p>
                <p className="text-gray-500 line-through">{formatCurrency(product.price, 'KWD')}</p>
              </>
            ) : (
              <p className="text-xl font-bold">{formatCurrency(product.price, 'KWD')}</p>
            )}
          </div>
          
          {/* وصف المنتج */}
          <p className="text-gray-700">{product.description || 'لا يوجد وصف لهذا المنتج'}</p>
          
          {/* أزرار الإجراءات */}
          <div className="flex space-x-4 rtl:space-x-reverse">
            <Button className="flex-1 gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span>إضافة للسلة</span>
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
          
          {/* معلومات إضافية */}
          <div className="border-t pt-4 mt-6">
            <p className="text-sm text-gray-600">المتجر: {storeDomain}</p>
            <p className="text-sm text-gray-600">رقم المنتج: {productId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
