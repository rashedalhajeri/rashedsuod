
import React from "react";
import { Home, Star, ShoppingBag } from "lucide-react";
import PreviewProductCard from "./PreviewProductCard";

interface ProductPagePreviewProps {
  primaryColor: string;
  buttonStyle: string;
  imageStyle: string;
  productsGridStyle: string;
}

const ProductPagePreview: React.FC<ProductPagePreviewProps> = ({
  primaryColor,
  buttonStyle,
  imageStyle,
  productsGridStyle
}) => {
  return (
    <>
      <div className="bg-gray-50 p-2 text-sm">
        <div className="flex items-center text-gray-500">
          <Home className="w-3 h-3 ml-1" />
          <span className="mx-1">/</span>
          <span>الملابس</span>
          <span className="mx-1">/</span>
          <span className="text-black">تيشيرت قطني أنيق</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`aspect-square bg-gray-100 ${imageStyle} overflow-hidden`}>
            <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: `url(https://via.placeholder.com/400/CCCCCC/808080?text=تيشيرت+قطني)` }}></div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-xl font-bold">تيشيرت قطني أنيق</h1>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4" fill={star <= 4 ? "#FFD700" : "none"} stroke={star <= 4 ? "#FFD700" : "currentColor"} />
                ))}
              </div>
              <span className="text-xs text-gray-500">(٤٢ تقييم)</span>
            </div>
            
            <div className="text-xl font-bold" style={{ color: primaryColor }}>120 ر.س</div>
            
            <div className="text-sm">
              <p>تيشيرت قطني ناعم بتصميم أنيق وعصري. مصنوع من القطن عالي الجودة ومريح للارتداء اليومي.</p>
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium mb-1">المقاس:</div>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <div 
                      key={size} 
                      className={`border w-10 h-10 flex items-center justify-center text-sm ${size === 'L' ? 'border-2' : ''}`}
                      style={{ borderColor: size === 'L' ? primaryColor : '' }}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">اللون:</div>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  {['#000000', '#FFFFFF', '#FF0000', '#0000FF'].map((color) => (
                    <div 
                      key={color} 
                      className={`w-6 h-6 rounded-full border ${color === '#000000' ? 'border-2' : ''}`} 
                      style={{ backgroundColor: color, borderColor: color === '#000000' ? primaryColor : '' }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="border flex items-center">
                <button className="px-2 py-1 border-l">-</button>
                <span className="px-4">1</span>
                <button className="px-2 py-1 border-r">+</button>
              </div>
              
              <button 
                className={`${buttonStyle} px-4 py-2 text-white flex-1 flex items-center justify-center`}
                style={{ backgroundColor: primaryColor }}
              >
                <ShoppingBag className="w-4 h-4 ml-2" />
                إضافة للسلة
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">منتجات مشابهة</h2>
          <div className={`grid ${productsGridStyle} gap-4`}>
            {[1, 2, 3, 4].map((item) => (
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
      </div>
    </>
  );
};

export default ProductPagePreview;
