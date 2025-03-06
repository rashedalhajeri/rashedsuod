
import React from "react";
import { ChevronRight } from "lucide-react";
import PreviewProductCard from "./PreviewProductCard";

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
    <>
      {/* Hero Banner */}
      <div 
        className="p-4 text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <h2 className="text-lg font-bold">تصفح أحدث المنتجات</h2>
        <p className="text-sm opacity-90 mb-3">اكتشف العروض الحصرية والمنتجات المميزة</p>
        <button 
          className={`${buttonStyle} text-xs px-3 py-1 font-medium`}
          style={{ backgroundColor: accentColor }}
        >
          تسوق الآن
        </button>
      </div>
      
      {/* Categories */}
      <div className="p-4">
        <h3 className="text-sm font-bold mb-2">التصنيفات</h3>
        <div className="flex gap-2 overflow-auto pb-2">
          {['الكل', 'ملابس', 'أحذية', 'إكسسوارات', 'هدايا'].map((cat, index) => (
            <div 
              key={index} 
              className={`${buttonStyle} text-xs px-3 py-1 whitespace-nowrap ${index === 0 ? 'text-white' : 'bg-gray-100'}`}
              style={index === 0 ? { backgroundColor: primaryColor } : {}}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>
      
      {/* Featured Banner */}
      <div className="px-4 mb-4">
        <div 
          className="rounded-lg overflow-hidden relative h-32 p-4 flex flex-col justify-center"
          style={{ backgroundColor: secondaryColor }}
        >
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-10" style={{ backgroundColor: primaryColor }}></div>
          <h3 className="text-md font-bold relative z-10">تشكيلة صيف ٢٠٢٥</h3>
          <p className="text-xs opacity-80 mb-2 relative z-10">خصم يصل إلى ٣٠٪ على الملابس الصيفية</p>
          <button 
            className={`${buttonStyle} text-xs px-2 py-1 text-white self-start relative z-10`}
            style={{ backgroundColor: primaryColor }}
          >
            اكتشف الآن
          </button>
        </div>
      </div>
      
      {/* Products */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold">منتجات مميزة</h3>
          <div className="text-xs flex items-center" style={{ color: primaryColor }}>
            عرض الكل <ChevronRight className="w-3 h-3" />
          </div>
        </div>
        
        <div className={`grid ${productsGridStyle} gap-4`}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <PreviewProductCard 
              key={item} 
              index={item} 
              primaryColor={primaryColor} 
              imageStyle={imageStyle} 
              buttonStyle={buttonStyle} 
            />
          ))}
        </div>
      </div>
      
      {/* Bestsellers */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold">الأكثر مبيعاً</h3>
          <div className="text-xs flex items-center" style={{ color: primaryColor }}>
            عرض الكل <ChevronRight className="w-3 h-3" />
          </div>
        </div>
        
        <div className="flex overflow-auto gap-4 pb-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="border rounded-lg overflow-hidden min-w-[140px]">
              <div className={`aspect-square bg-gray-100 ${imageStyle} overflow-hidden`}>
                <div 
                  className="w-full h-full bg-center bg-cover" 
                  style={{ backgroundImage: `url(https://via.placeholder.com/150/CCCCCC/808080?text=منتج)` }}
                ></div>
              </div>
              <div className="p-2">
                <div className="text-xs font-medium truncate">منتج {item}</div>
                <div className="text-xs mt-1 text-green-600">99 ر.س</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePagePreview;
