
import React from "react";
import PreviewProductCard from "./PreviewProductCard";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ChevronLeft } from "lucide-react";

interface HomePagePreviewProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  buttonStyle: string;
  imageStyle: string;
  productsGridStyle: string;
}

const HomePagePreview: React.FC<HomePagePreviewProps> = ({
  primaryColor,
  secondaryColor,
  accentColor,
  buttonStyle,
  imageStyle,
  productsGridStyle
}) => {
  return (
    <div className="bg-white min-h-full">
      {/* Banner */}
      <div 
        className="relative aspect-[3/1] bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center mb-6 overflow-hidden" 
        style={{ background: `linear-gradient(to right, ${secondaryColor}, ${accentColor}30)` }}
      >
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg"
            alt="Banner"
            className="w-full h-full object-cover opacity-25"
          />
        </div>
        <div className="relative z-10 text-center p-4 max-w-xl">
          <h1 className="text-2xl md:text-4xl font-bold mb-2" style={{ color: primaryColor }}>
            اسم المتجر
          </h1>
          <p className="text-sm md:text-base mb-4">
            وصف مختصر للمتجر يظهر هنا مع عرض لأهم المنتجات والعروض
          </p>
          <Button 
            className={buttonStyle} 
            style={{ backgroundColor: primaryColor }}
          >
            تسوق الآن <ShoppingBag className="mr-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
          الفئات المميزة
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={`aspect-square rounded-lg overflow-hidden relative ${imageStyle}`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <img
                src="/placeholder.svg"
                alt={`فئة ${i}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-center">
                <p className="text-xs font-medium">فئة {i}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: primaryColor }}>
            المنتجات المميزة
          </h2>
          <Button variant="ghost" size="sm" className="text-xs">
            عرض الكل <ChevronLeft className="h-3 w-3" />
          </Button>
        </div>
        <div className={`grid grid-cols-2 md:${productsGridStyle} gap-4`}>
          {[1, 2, 3, 4].map(i => (
            <PreviewProductCard 
              key={i} 
              id={i} 
              primaryColor={primaryColor} 
              buttonStyle={buttonStyle} 
              imageStyle={imageStyle} 
            />
          ))}
        </div>
      </div>

      {/* Store Info */}
      <div 
        className="px-4 py-6 mt-8 text-center" 
        style={{ backgroundColor: secondaryColor }}
      >
        <h2 className="text-lg font-bold mb-2" style={{ color: primaryColor }}>
          عن المتجر
        </h2>
        <p className="text-sm mb-4 max-w-md mx-auto">
          نحن متجر متخصص في توفير منتجات عالية الجودة للعملاء. نسعى دائمًا لتقديم أفضل تجربة تسوق ممكنة.
        </p>
        <div className="flex justify-center space-x-4 rtl:space-x-reverse">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-1 shadow-sm">
              <ShoppingBag className="h-5 w-5" style={{ color: primaryColor }} />
            </div>
            <p className="text-xs">شحن سريع</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-1 shadow-sm">
              <ShoppingBag className="h-5 w-5" style={{ color: primaryColor }} />
            </div>
            <p className="text-xs">دفع آمن</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-1 shadow-sm">
              <ShoppingBag className="h-5 w-5" style={{ color: primaryColor }} />
            </div>
            <p className="text-xs">جودة عالية</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePagePreview;
