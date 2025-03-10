
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ProductItem from '@/components/store/unified/ProductItem';
import { Skeleton } from '@/components/ui/skeleton';
import { Product, RawProductData } from '@/utils/products/types';
import { mapRawProductToProduct } from '@/utils/products/mappers';

interface CategoryData {
  id: string;
}

const CategoryProducts = () => {
  const { categoryName, storeDomain } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        
        // أولًا نجلب معرّف الفئة بناءً على اسمها
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .eq('name', categoryName)
          .eq('store_id', storeDomain)
          .maybeSingle<CategoryData>();
        
        if (categoryError) throw categoryError;
        
        if (!categoryData) {
          throw new Error('الفئة غير موجودة');
        }
        
        // ثم نجلب المنتجات المرتبطة بهذه الفئة
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryData.id)
          .eq('store_id', storeDomain);
        
        if (productsError) throw productsError;
        
        // Map the raw data to Product type
        const mappedProducts = (productsData || []).map((product: RawProductData) => 
          mapRawProductToProduct(product)
        );
        
        setProducts(mappedProducts);
      } catch (err: any) {
        console.error('Error fetching category products:', err);
        setError(err.message || 'حدث خطأ في تحميل منتجات الفئة');
      } finally {
        setLoading(false);
      }
    };
    
    if (categoryName && storeDomain) {
      fetchCategoryProducts();
    }
  }, [categoryName, storeDomain]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40 mt-2" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} className="h-64 w-full rounded-md" />
          ))}
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
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">منتجات الفئة: {categoryName}</h1>
        <p className="text-gray-600">نطاق المتجر: {storeDomain}</p>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">لا توجد منتجات في هذه الفئة</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <ProductItem 
              key={product.id} 
              product={product} 
              storeDomain={storeDomain}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
