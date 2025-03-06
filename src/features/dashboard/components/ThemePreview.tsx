
import React from "react";
import { Phone, ShoppingBag, Heart, User, Search, Home, ChevronRight } from "lucide-react";
import { ThemeOption, ThemeSettings } from "@/features/dashboard/types/theme-types";

interface ThemePreviewProps {
  theme: ThemeOption;
  themeSettings?: ThemeSettings | null;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme, themeSettings }) => {
  // Use theme settings if available, otherwise fallback to theme default values
  const primaryColor = themeSettings?.primary_color || theme.colors.primary;
  const secondaryColor = themeSettings?.secondary_color || theme.colors.secondary;
  const accentColor = themeSettings?.accent_color || theme.colors.accent;
  const fontFamily = themeSettings?.font_family || "Tajawal";
  
  // Apply button style
  const getButtonStyle = () => {
    const buttonStyle = themeSettings?.button_style || theme.styles?.button || "rounded";
    switch (buttonStyle) {
      case "squared": return "rounded-none";
      case "pill": return "rounded-full";
      default: return "rounded-md";
    }
  };
  
  // Apply image style
  const getImageStyle = () => {
    const imageStyle = themeSettings?.image_style || theme.styles?.image || "rounded";
    switch (imageStyle) {
      case "squared": return "rounded-none";
      case "circle": return "rounded-full";
      default: return "rounded-md";
    }
  };
  
  // Header style
  const getHeaderStyle = () => {
    const headerStyle = themeSettings?.header_style || theme.styles?.header || "standard";
    switch (headerStyle) {
      case "minimal": return "py-2";
      case "centered": return "py-6 text-center";
      default: return "py-4";
    }
  };
  
  // Products per row and layout adjustments
  const getProductsGridStyle = () => {
    const productsPerRow = themeSettings?.products_per_row || theme.layout?.productsPerRow || 3;
    return `grid-cols-${productsPerRow}`;
  };
  
  return (
    <div 
      className="flex flex-col h-full overflow-hidden border rounded-lg" 
      style={{ fontFamily: fontFamily }}
    >
      {/* Phone frame */}
      <div className="flex items-center justify-center bg-gray-100 p-2 border-b">
        <Phone className="w-4 h-4 text-gray-500" />
        <span className="text-xs text-gray-500 ml-1">معاينة على الجوال</span>
      </div>
      
      {/* Store preview */}
      <div className="flex-1 overflow-auto bg-white">
        {/* Header */}
        <div 
          className={`${getHeaderStyle()} px-4 border-b flex justify-between items-center`}
          style={{ backgroundColor: secondaryColor }}
        >
          <div className="flex-1">
            <div className="font-bold text-lg">اسم المتجر</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10">
              <Search className="w-3 h-3" />
            </div>
            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10">
              <ShoppingBag className="w-3 h-3" />
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between p-2 bg-gray-50 border-b overflow-auto">
          <div className="flex gap-3 text-xs">
            <div className="flex flex-col items-center">
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </div>
            <div className="flex flex-col items-center">
              <ShoppingBag className="w-4 h-4" />
              <span>المنتجات</span>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="w-4 h-4" />
              <span>المفضلة</span>
            </div>
            <div className="flex flex-col items-center">
              <User className="w-4 h-4" />
              <span>حسابي</span>
            </div>
          </div>
        </div>
        
        {/* Hero Banner */}
        <div 
          className="p-4 text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <h2 className="text-lg font-bold">تصفح أحدث المنتجات</h2>
          <p className="text-sm opacity-90 mb-3">اكتشف العروض الحصرية والمنتجات المميزة</p>
          <button 
            className={`${getButtonStyle()} text-xs px-3 py-1 font-medium`}
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
                className={`${getButtonStyle()} text-xs px-3 py-1 whitespace-nowrap ${index === 0 ? 'text-white' : 'bg-gray-100'}`}
                style={index === 0 ? { backgroundColor: primaryColor } : {}}
              >
                {cat}
              </div>
            ))}
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
          
          <div className={`grid ${getProductsGridStyle()} gap-4`}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="border rounded-lg overflow-hidden">
                <div className={`aspect-square bg-gray-100 ${getImageStyle()} overflow-hidden`}>
                  <div 
                    className="w-full h-full bg-center bg-cover" 
                    style={{ backgroundImage: `url(https://via.placeholder.com/150/CCCCCC/808080?text=منتج)` }}
                  ></div>
                </div>
                <div className="p-2">
                  <div className="text-xs font-medium truncate">منتج {item}</div>
                  <div className="text-xs mt-1 text-green-600">99 ر.س</div>
                  <button 
                    className={`${getButtonStyle()} w-full text-xs mt-2 py-1 text-white font-medium`}
                    style={{ backgroundColor: primaryColor }}
                  >
                    إضافة للسلة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;
