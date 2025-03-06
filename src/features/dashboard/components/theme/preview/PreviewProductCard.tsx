
import React from "react";

interface PreviewProductCardProps {
  index?: number;
  id?: number;
  primaryColor: string;
  imageStyle: string;
  buttonStyle: string;
}

const PreviewProductCard: React.FC<PreviewProductCardProps> = ({ 
  index = 1,
  id = 1, 
  primaryColor, 
  imageStyle, 
  buttonStyle 
}) => {
  // Use index or id, whichever is provided
  const displayIndex = index || id;
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className={`aspect-square bg-gray-100 ${imageStyle} overflow-hidden`}>
        <div 
          className="w-full h-full bg-center bg-cover" 
          style={{ backgroundImage: `url(https://via.placeholder.com/150/CCCCCC/808080?text=منتج)` }}
        ></div>
      </div>
      <div className="p-2">
        <div className="text-xs font-medium truncate">منتج {displayIndex}</div>
        <div className="text-xs mt-1 text-green-600">99 ر.س</div>
        <button 
          className={`${buttonStyle} w-full text-xs mt-2 py-1 text-white font-medium`}
          style={{ backgroundColor: primaryColor }}
        >
          إضافة للسلة
        </button>
      </div>
    </div>
  );
};

export default PreviewProductCard;
