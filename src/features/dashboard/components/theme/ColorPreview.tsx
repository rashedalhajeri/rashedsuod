
import React from 'react';

interface ColorPreviewProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

const ColorPreview: React.FC<ColorPreviewProps> = ({
  primaryColor,
  secondaryColor,
  accentColor
}) => {
  return (
    <div className="mt-6 p-4 border rounded-lg">
      <h3 className="text-base font-semibold mb-3">معاينة الألوان</h3>
      
      <div className="flex flex-col gap-4">
        <div 
          className="p-4 rounded-lg flex items-center justify-between"
          style={{ backgroundColor: primaryColor }}
        >
          <span className="text-white font-medium">اللون الرئيسي</span>
          <span className="text-white text-sm">{primaryColor}</span>
        </div>
        
        <div 
          className="p-4 rounded-lg flex items-center justify-between border"
          style={{ backgroundColor: secondaryColor }}
        >
          <span className="font-medium">اللون الثانوي</span>
          <span className="text-sm">{secondaryColor}</span>
        </div>
        
        <div 
          className="p-4 rounded-lg flex items-center justify-between"
          style={{ backgroundColor: accentColor }}
        >
          <span className="font-medium">لون التأكيد</span>
          <span className="text-sm">{accentColor}</span>
        </div>
        
        <div 
          className="p-4 rounded-lg"
          style={{ backgroundColor: secondaryColor }}
        >
          <div className="mb-3 font-medium">مثال على واجهة المستخدم</div>
          <div className="flex gap-2">
            <button 
              className="px-3 py-1 rounded text-white text-sm"
              style={{ backgroundColor: primaryColor }}
            >
              زر رئيسي
            </button>
            <button 
              className="px-3 py-1 rounded text-sm"
              style={{ 
                backgroundColor: accentColor,
                color: primaryColor 
              }}
            >
              زر ثانوي
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPreview;
