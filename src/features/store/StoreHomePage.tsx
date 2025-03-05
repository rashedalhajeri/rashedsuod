
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StorefrontHeader from './StorefrontHeader';
import ProductCard from './ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  stock_quantity?: number;
  created_at: string;
}

const StoreHomePage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [storeData, setStoreData] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        // Fetch store details
        const { data: storeResult, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('domain_name', storeId)
          .single();

        if (storeError) throw storeError;
        setStoreData(storeResult);

        // Fetch products
        const { data: productsResult, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', storeResult.id)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsResult || []);

        // Set featured products (first 3-6 products for demo)
        setFeaturedProducts(productsResult?.slice(0, Math.min(6, productsResult.length)) || []);
        
        // Set new arrivals (sort by created_at)
        const sortedByDate = [...(productsResult || [])].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setNewArrivals(sortedByDate.slice(0, 4));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching store data:', error);
        setLoading(false);
      }
    };

    fetchStoreData();
    
    // تحميل سلة التسوق من التخزين المحلي
    const loadCart = () => {
      const cart = localStorage.getItem('shopping-cart');
      if (cart) {
        const parsedCart = JSON.parse(cart);
        const totalItems = parsedCart.reduce((total: number, item: any) => total + item.quantity, 0);
        setCartItemsCount(totalItems);
      }
    };
    
    loadCart();
  }, [storeId]);

  if (loading) {
    return (
      <div>
        <StorefrontHeader cartItemsCount={0} />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-12 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <StorefrontHeader cartItemsCount={cartItemsCount} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-primary/5 py-12 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{storeData?.store_name}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              {storeData?.description || 'مرحبًا بك في متجرنا الإلكتروني، نقدم لك منتجات عالية الجودة بأسعار مناسبة وشحن سريع لجميع المناطق.'}
            </p>
            <Button size="lg" className="min-w-[160px]">تصفح المنتجات</Button>
          </div>
        </section>
        
        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">منتجات مميزة</h2>
                <Button variant="ghost" className="flex items-center">
                  عرض الكل
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    imageUrl={product.image_url}
                    description={product.description}
                    stock={product.stock_quantity}
                    isOnSale={Math.random() > 0.7} // Random for demo
                    discountPercentage={Math.floor(Math.random() * 20) + 10} // Random discount for demo
                  />
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">وصل حديثًا</h2>
                <Button variant="ghost" className="flex items-center">
                  عرض الكل
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newArrivals.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    imageUrl={product.image_url}
                    description={product.description}
                    stock={product.stock_quantity}
                    isNew={true}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* Store Features */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">لماذا تتسوق معنا؟</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">منتجات عالية الجودة</h3>
                <p className="text-gray-600">نقدم لك أفضل المنتجات ذات الجودة العالية والمصنعة بأعلى المعايير</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">شحن سريع</h3>
                <p className="text-gray-600">نوفر خدمة توصيل سريعة لجميع المناطق خلال 24-48 ساعة</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">دفع آمن</h3>
                <p className="text-gray-600">طرق دفع متعددة وآمنة، بما في ذلك الدفع عند الاستلام والدفع الإلكتروني</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">معلومات المتجر</h3>
              <p className="mb-2">{storeData?.store_name}</p>
              <p className="mb-2">{storeData?.phone_number}</p>
              <p>{storeData?.country || 'الكويت'}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">روابط مهمة</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">عن المتجر</a></li>
                <li><a href="#" className="hover:underline">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:underline">شروط الاستخدام</a></li>
                <li><a href="#" className="hover:underline">اتصل بنا</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">تابعنا</h3>
              <div className="flex space-x-4 rtl:space-x-reverse">
                <a href="#" className="hover:text-primary">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover:text-primary">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover:text-primary">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p>&copy; {new Date().getFullYear()} {storeData?.store_name}. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StoreHomePage;
