
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import StorefrontLayout from "@/layouts/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoreData, getCurrencyFormatter } from "@/hooks/use-store-data";
import { useShoppingCart } from "@/hooks/use-shopping-cart";

const HomePage = () => {
  const navigate = useNavigate();
  const { data: storeData, isLoading: isLoadingStore } = useStoreData();
  const { addToCart } = useShoppingCart();
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Format currency based on store settings
  const formatCurrency = storeData 
    ? getCurrencyFormatter(storeData.currency) 
    : (price: number) => `${price.toFixed(2)} KWD`;
  
  // Fetch featured products
  const { data: featuredProducts, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['featuredProducts', storeData?.id],
    queryFn: async () => {
      if (!storeData?.id) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData.id)
        .order('created_at', { ascending: false })
        .limit(8);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!storeData?.id
  });
  
  // Auto slide the banner
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % 3);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Slide data
  const slides = [
    {
      title: "تسوق أحدث المنتجات",
      description: "اكتشف تشكيلة واسعة من المنتجات المميزة بأسعار تنافسية",
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
      color: "bg-blue-50"
    },
    {
      title: "عروض حصرية",
      description: "تمتع بخصومات رائعة على منتجات مختارة لفترة محدودة",
      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
      color: "bg-amber-50"
    },
    {
      title: "توصيل سريع",
      description: "نوصل طلبك بسرعة وأمان إلى باب منزلك",
      image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
      color: "bg-green-50"
    }
  ];
  
  // Handle quick add to cart
  const handleQuickAdd = (product: any) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image_url
    });
  };
  
  if (isLoadingStore) {
    return (
      <StorefrontLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full rounded-xl mb-12" />
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </StorefrontLayout>
    );
  }
  
  return (
    <StorefrontLayout storeId={storeData?.id}>
      <div className="container mx-auto px-4 py-0">
        {/* Hero Slider */}
        <div className="relative overflow-hidden rounded-2xl mb-12 h-96">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className={`absolute inset-0 ${slide.color} flex items-center overflow-hidden rounded-2xl ${
                activeSlide === index ? "z-10" : "z-0"
              }`}
              initial={{ opacity: 0, x: 100 }}
              animate={{
                opacity: activeSlide === index ? 1 : 0,
                x: activeSlide === index ? 0 : 100
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{slide.title}</h2>
                  <p className="text-lg opacity-80 mb-6">{slide.description}</p>
                  <div>
                    <Button 
                      onClick={() => navigate('/store/products')}
                      size="lg"
                      className="bg-primary hover:bg-primary-600 text-white font-semibold"
                    >
                      تسوق الآن
                    </Button>
                  </div>
                </div>
                <div className="relative hidden md:block">
                  {slide.image && (
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="object-cover object-center w-full h-full"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Slider Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeSlide === index
                    ? "bg-primary scale-125"
                    : "bg-gray-300 opacity-70"
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/70 backdrop-blur-sm rounded-full p-2 hover:bg-white/90 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/70 backdrop-blur-sm rounded-full p-2 hover:bg-white/90 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
        
        {/* Featured Products */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">منتجات مميزة</h2>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary-700"
              onClick={() => navigate('/store/products')}
            >
              عرض الكل
              <ChevronLeft className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          {isLoadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts?.map((product) => (
                <motion.div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
                  whileHover={{ y: -5 }}
                >
                  <div
                    className="relative h-48 bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/store/products/${product.id}`)}
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400">لا توجد صورة</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 
                      className="font-medium text-lg mb-2 cursor-pointer hover:text-primary truncate"
                      onClick={() => navigate(`/store/products/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-primary-700 font-bold mb-3">
                      {formatCurrency(product.price)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleQuickAdd(product)}
                      >
                        <ShoppingBag className="h-4 w-4 ml-2" />
                        أضف للسلة
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        {/* Feature Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "شحن سريع",
              description: "نوفر خدمة توصيل سريعة وآمنة لجميع المنتجات",
              icon: "🚚"
            },
            {
              title: "دعم متميز",
              description: "فريق خدمة العملاء متاح للرد على استفساراتك",
              icon: "🛎️"
            },
            {
              title: "ضمان الجودة",
              description: "نضمن لك أعلى معايير الجودة في جميع منتجاتنا",
              icon: "✅"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="bg-primary text-white rounded-2xl p-8 md:p-12 mb-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">انضم إلى قائمة المشتركين</h2>
          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
            اشترك في نشرتنا البريدية للحصول على آخر العروض والتخفيضات
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-gray-900"
            />
            <Button className="bg-white text-primary hover:bg-gray-100">
              اشترك الآن
            </Button>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default HomePage;
