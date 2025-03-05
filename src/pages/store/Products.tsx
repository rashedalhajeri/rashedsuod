import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import LoadingState from '@/components/ui/loading-state';
import ErrorState from '@/components/ui/error-state';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { Link } from 'react-router-dom';

const StoreProducts: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  
  // Fetch store data
  const { data: storeData, isLoading: storeLoading, error: storeError } = useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('domain_name', storeId || 'demo-store')
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!storeId || storeId === 'demo-store'
  });
  
  // Fetch products with filters
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['storeProducts', storeData?.id, categoryId, searchQuery, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, categories(name)')
        .eq('store_id', storeData?.id);
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * productsPerPage, currentPage * productsPerPage - 1);
        
      if (error) throw error;
      return data;
    },
    enabled: !!storeData?.id
  });
  
  // Fetch total products count for pagination
  const { data: totalCount } = useQuery({
    queryKey: ['storeProductsCount', storeData?.id, categoryId, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('id', { count: 'exact' })
        .eq('store_id', storeData?.id);
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      const { count, error } = await query;
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!storeData?.id
  });
  
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['storeCategories', storeData?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', storeData?.id)
        .order('name', { ascending: true });
        
      if (error) throw error;
      return data;
    },
    enabled: !!storeData?.id
  });
  
  if (storeLoading || productsLoading) {
    return <LoadingState message="جاري تحميل المنتجات..." />;
  }
  
  if (storeError) {
    return (
      <ErrorState 
        title="لم يتم العثور على المتجر"
        message="تعذر العثور على المتجر المطلوب. الرجاء التحقق من الرابط والمحاولة مرة أخرى."
      />
    );
  }
  
  return (
    <StorefrontLayout storeData={storeData}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">
          {searchQuery ? `نتائج البحث عن "${searchQuery}"` : 'جميع المنتجات'}
        </h1>
        
        {/* Filters and products display */}
        <div className="flex flex-col md:flex-row">
          {/* Categories filter */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-xl font-semibold mb-2">التصنيفات</h2>
            <ul>
              <li>
                <Link 
                  to={`/store/${storeId}/products`} 
                  className={`block py-2 px-4 rounded hover:bg-gray-100 transition-colors ${!categoryId ? 'bg-gray-100 font-semibold' : ''}`}
                >
                  الكل
                </Link>
              </li>
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link 
                    to={`/store/${storeId}/products?category=${category.id}`}
                    className={`block py-2 px-4 rounded hover:bg-gray-100 transition-colors ${categoryId === String(category.id) ? 'bg-gray-100 font-semibold' : ''}`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Product grid */}
          <div className="w-full md:w-3/4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productsData?.map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">لا توجد صورة</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description || "لا يوجد وصف"}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-800">{product.price} ر.س</span>
                      </div>
                      
                      <button className="bg-primary text-white px-3 py-1 rounded-md text-sm">
                        إضافة للسلة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center mt-8">
          {totalCount !== undefined && (
            <div className="join">
              {Array.from({ length: Math.ceil(totalCount / productsPerPage) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default StoreProducts;
