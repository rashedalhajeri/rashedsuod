
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import StorefrontHeader from './StorefrontHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Heart, Share2, Star, Truck, ArrowLeft, Minus, Plus } from 'lucide-react';
import useStoreData, { getCurrencyFormatter } from '@/hooks/use-store-data';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: storeData } = useStoreData();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const formatCurrency = getCurrencyFormatter(storeData?.currency);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) return;

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('حدث خطأ في جلب بيانات المنتج');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    
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
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      // الحصول على السلة الحالية أو إنشاء سلة جديدة
      const currentCart = localStorage.getItem('shopping-cart');
      const cart = currentCart ? JSON.parse(currentCart) : [];
      
      // التحقق مما إذا كان المنتج موجودًا بالفعل في السلة
      const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // تحديث الكمية إذا كان المنتج موجودًا بالفعل
        cart[existingItemIndex].quantity += quantity;
      } else {
        // إضافة المنتج إلى السلة إذا لم يكن موجودًا
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image_url: product.image_url,
        });
      }
      
      // حفظ السلة المحدثة
      localStorage.setItem('shopping-cart', JSON.stringify(cart));
      
      // تحديث عدد العناصر في السلة
      const totalItems = cart.reduce((total: number, item: any) => total + item.quantity, 0);
      setCartItemsCount(totalItems);
      
      toast.success('تمت إضافة المنتج إلى السلة');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('حدث خطأ أثناء إضافة المنتج إلى السلة');
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (product && product.stock_quantity && quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    } else {
      setQuantity(quantity + 1);
    }
  };

  if (loading) {
    return (
      <div>
        <StorefrontHeader cartItemsCount={cartItemsCount} />
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <StorefrontHeader cartItemsCount={cartItemsCount} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">المنتج غير موجود</h2>
            <p className="mb-6">لم يتم العثور على المنتج الذي تبحث عنه.</p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة للخلف
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <StorefrontHeader cartItemsCount={cartItemsCount} />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center text-sm text-gray-500">
            <button onClick={() => navigate(`/store-preview/${storeData?.domain_name}`)}>الرئيسية</button>
            <span className="mx-2">/</span>
            <button onClick={() => navigate(`/store-preview/${storeData?.domain_name}/products`)}>المنتجات</button>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="bg-white rounded-lg overflow-hidden border">
              <div className="aspect-square relative">
                <img 
                  src={product.image_url || '/placeholder.svg'} 
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
                {product.stock_quantity === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white py-2 px-4 rounded-md font-bold">نفذت الكمية</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-5 w-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="mr-2 text-sm text-gray-600">(12 تقييم)</span>
                  </div>
                  <span className="text-sm text-green-600">متوفر في المخزون</span>
                </div>
                <div className="flex items-baseline space-x-4 rtl:space-x-reverse mb-4">
                  <span className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
                  {Math.random() > 0.5 && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatCurrency(product.price * 1.2)}
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-gray-700 leading-relaxed">{product.description || 'لا يوجد وصف متاح لهذا المنتج.'}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">الكمية</h3>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={increaseQuantity}
                      disabled={product.stock_quantity !== null && quantity >= product.stock_quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    className="flex-1 py-6"
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity === 0}
                  >
                    <ShoppingCart className="ml-2 h-5 w-5" />
                    إضافة إلى السلة
                  </Button>
                  <Button variant="outline" size="icon" className="py-6">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="py-6">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center text-sm">
                  <Truck className="h-5 w-5 ml-2 text-primary" />
                  <span>شحن سريع (2-3 أيام عمل)</span>
                </div>
                <div className="flex items-center text-sm">
                  <Badge variant="outline" className="ml-2">100% ضمان</Badge>
                  <Badge variant="outline" className="ml-2">منتج أصلي</Badge>
                  <Badge variant="outline">الدفع عند الاستلام</Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <Tabs defaultValue="details" className="mb-12">
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="details">التفاصيل</TabsTrigger>
              <TabsTrigger value="specifications">المواصفات</TabsTrigger>
              <TabsTrigger value="reviews">التقييمات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-bold mb-4">وصف المنتج</h3>
              <div className="prose max-w-none">
                <p>{product.description || 'لا يوجد وصف تفصيلي متاح لهذا المنتج.'}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-bold mb-4">المواصفات</h3>
              <div className="divide-y">
                <div className="py-3 flex">
                  <span className="font-medium w-1/3">رمز المنتج:</span>
                  <span className="text-gray-600">{product.id.substring(0, 8)}</span>
                </div>
                <div className="py-3 flex">
                  <span className="font-medium w-1/3">الكمية المتوفرة:</span>
                  <span className="text-gray-600">{product.stock_quantity || 'غير محدد'}</span>
                </div>
                <div className="py-3 flex">
                  <span className="font-medium w-1/3">الوزن:</span>
                  <span className="text-gray-600">0.5 كجم</span>
                </div>
                <div className="py-3 flex">
                  <span className="font-medium w-1/3">الضمان:</span>
                  <span className="text-gray-600">12 شهر</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-bold mb-4">تقييمات العملاء</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((review) => (
                  <Card key={review}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold">أحمد محمد</h4>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">منذ شهر</span>
                      </div>
                      <p className="text-gray-700">منتج رائع وجودة ممتازة. وصل في الوقت المحدد والتغليف كان ممتاز. أنصح به بشدة.</p>
                    </CardContent>
                  </Card>
                ))}
                
                <Button variant="outline" className="w-full">عرض جميع التقييمات</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Footer kept similar to the one in StoreHomePage */}
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

export default ProductDetailPage;
