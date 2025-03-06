
import React from "react";
import { Phone, ShoppingBag, Heart, User, Search, Home, ChevronRight, ShoppingBasket, Star, Filter } from "lucide-react";
import { ThemeOption, ThemeSettings } from "@/features/dashboard/types/theme-types";

interface ThemePreviewProps {
  theme: ThemeOption;
  themeSettings?: ThemeSettings | null;
  page?: 'home' | 'product' | 'category';
  device?: 'mobile' | 'tablet' | 'desktop';
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ 
  theme, 
  themeSettings,
  page = 'home',
  device = 'mobile'
}) => {
  // استخدام إعدادات التصميم إذا كانت متوفرة، وإلا استخدام القيم الافتراضية للتصميم
  const primaryColor = themeSettings?.primary_color || theme.colors.primary;
  const secondaryColor = themeSettings?.secondary_color || theme.colors.secondary;
  const accentColor = themeSettings?.accent_color || theme.colors.accent;
  const fontFamily = themeSettings?.font_family || "Tajawal";
  
  // تطبيق أسلوب الزر
  const getButtonStyle = () => {
    const buttonStyle = themeSettings?.button_style || theme.styles?.button || "rounded";
    switch (buttonStyle) {
      case "squared": return "rounded-none";
      case "pill": return "rounded-full";
      default: return "rounded-md";
    }
  };
  
  // تطبيق أسلوب الصورة
  const getImageStyle = () => {
    const imageStyle = themeSettings?.image_style || theme.styles?.image || "rounded";
    switch (imageStyle) {
      case "squared": return "rounded-none";
      case "circle": return "rounded-full";
      default: return "rounded-md";
    }
  };
  
  // أسلوب الرأس
  const getHeaderStyle = () => {
    const headerStyle = themeSettings?.header_style || theme.styles?.header || "standard";
    switch (headerStyle) {
      case "minimal": return "py-2";
      case "centered": return "py-6 text-center";
      default: return "py-4";
    }
  };
  
  // المنتجات لكل صف وتعديلات التخطيط
  const getProductsGridStyle = () => {
    const productsPerRow = themeSettings?.products_per_row || theme.layout?.productsPerRow || 3;
    const productsPerRowDesktop = device === 'desktop' ? productsPerRow : (device === 'tablet' ? Math.min(productsPerRow, 2) : 1);
    return `grid-cols-${productsPerRowDesktop}`;
  };

  // محتوى المعاينة بناءً على الصفحة المحددة
  const renderContent = () => {
    switch (page) {
      case 'product':
        return renderProductPage();
      case 'category':
        return renderCategoryPage();
      default:
        return renderHomePage();
    }
  };

  // معاينة صفحة المنتج
  const renderProductPage = () => (
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
          <div className={`aspect-square bg-gray-100 ${getImageStyle()} overflow-hidden`}>
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
                className={`${getButtonStyle()} px-4 py-2 text-white flex-1 flex items-center justify-center`}
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
          <div className={`grid ${getProductsGridStyle()} gap-4`}>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="border rounded-lg overflow-hidden">
                <div className={`aspect-square bg-gray-100 ${getImageStyle()} overflow-hidden`}>
                  <div 
                    className="w-full h-full bg-center bg-cover" 
                    style={{ backgroundImage: `url(https://via.placeholder.com/150/CCCCCC/808080?text=منتج)` }}
                  ></div>
                </div>
                <div className="p-2">
                  <div className="text-xs font-medium truncate">تيشيرت قطني {item}</div>
                  <div className="text-xs mt-1 text-green-600">٩٩ ر.س</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // معاينة صفحة التصنيفات
  const renderCategoryPage = () => (
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
          <button className={`${getButtonStyle()} px-3 py-1 text-xs flex items-center`} style={{ backgroundColor: primaryColor, color: 'white' }}>
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
        
        <div className={`grid ${getProductsGridStyle()} gap-4`}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <div key={item} className="border rounded-lg overflow-hidden">
              <div className={`aspect-square bg-gray-100 ${getImageStyle()} overflow-hidden`}>
                <div 
                  className="w-full h-full bg-center bg-cover" 
                  style={{ backgroundImage: `url(https://via.placeholder.com/150/CCCCCC/808080?text=منتج)` }}
                ></div>
              </div>
              <div className="p-2">
                <div className="text-xs font-medium truncate">تيشيرت قطني {item}</div>
                <div className="text-xs mt-1 text-green-600">٩٩ ر.س</div>
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

  // معاينة الصفحة الرئيسية
  const renderHomePage = () => (
    <>
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
            className={`${getButtonStyle()} text-xs px-2 py-1 text-white self-start relative z-10`}
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
              <div className={`aspect-square bg-gray-100 ${getImageStyle()} overflow-hidden`}>
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
  
  return (
    <div 
      className="flex flex-col h-full overflow-hidden border rounded-lg" 
      style={{ fontFamily: fontFamily }}
    >
      {/* Phone frame */}
      {device === 'mobile' && (
        <div className="flex items-center justify-center bg-gray-100 p-2 border-b">
          <Phone className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500 mr-1">معاينة على الجوال</span>
        </div>
      )}
      
      {/* Store preview */}
      <div className="flex-1 overflow-auto bg-white">
        {/* Header */}
        <div 
          className={`${getHeaderStyle()} px-4 border-b flex justify-between items-center`}
          style={{ backgroundColor: secondaryColor }}
        >
          <div className="flex-1">
            <div className="font-bold text-lg">متجر alhajeri</div>
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
        
        {/* Content Area */}
        {renderContent()}
      </div>
    </div>
  );
};

export default ThemePreview;
