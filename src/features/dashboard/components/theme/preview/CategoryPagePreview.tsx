
import React from "react";
import { Home, Filter } from "lucide-react";
import PreviewProductCard from "./PreviewProductCard";

interface CategoryPagePreviewProps {
  primaryColor: string;
  buttonStyle: string;
  imageStyle: string;
  productsGridStyle: string;
}

const CategoryPagePreview: React.FC<CategoryPagePreviewProps> = ({
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
          <span className="text-black">الملابس</span>
        </div>
      </div>
      
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">الملابس</h1>
        
        <div className="flex justify-between items-center mb-4">
          <button className={`${buttonStyle} px-3 py-1 text-xs flex items-center`} style={{ backgroundColor: primaryColor, color: 'white' }}>
            <Filter className="h-3 w-3 ml-1" />
            فلترة
          </button>
          
          <div className="text-xs">
            عرض 1-12 من 36 منتج
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {['تيشيرتات', 'بناطيل', 'قمصان', 'أحذية', 'إكسسوارات', 'سترات'].map((cat) => (
            <div 
              key={cat} 
              className="border p-2 text-center text-xs font-medium"
              style={{ borderColor: cat === 'تيشيرتات' ? primaryColor : '' }}
            >
              {cat}
            </div>
          ))}
        </div>
        
        <div className={`grid ${productsGridStyle} gap-4`}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <PreviewProductCard 
              key={item} 
              index={item} 
              primaryColor={primaryColor} 
              imageStyle={imageStyle} 
              buttonStyle={buttonStyle} 
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <div className="flex border rounded-md overflow-hidden">
            <button className="px-3 py-1 text-xs">&lt;</button>
            <button className="px-3 py-1 text-xs bg-gray-100">1</button>
            <button className="px-3 py-1 text-xs">2</button>
            <button className="px-3 py-1 text-xs">3</button>
            <button className="px-3 py-1 text-xs">&gt;</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPagePreview;
