
import React from 'react';
import { ThemeSettings } from '../types/theme-types';
import { themes } from '../data/theme-data';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mobile, Tablet, Monitor } from 'lucide-react';

interface ThemePreviewProps {
  settings: ThemeSettings;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ settings }) => {
  const [device, setDevice] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const selectedTheme = themes.find(t => t.id === settings.theme_id) || themes[0];
  
  const getButtonStyle = () => {
    let baseClass = 'px-4 py-2 text-white font-medium';
    
    switch (settings.button_style) {
      case 'rounded':
        return `${baseClass} rounded-full`;
      case 'square':
        return `${baseClass}`;
      case 'soft':
        return `${baseClass} rounded-md`;
      default:
        return `${baseClass} rounded-md`;
    }
  };
  
  const getImageStyle = () => {
    switch (settings.image_style) {
      case 'rounded':
        return 'rounded-lg';
      case 'square':
        return '';
      case 'circle':
        return 'rounded-full aspect-square object-cover';
      default:
        return 'rounded-md';
    }
  };
  
  const getProductGridStyle = () => {
    const baseClass = 'grid gap-4';
    
    switch (device) {
      case 'mobile':
        return `${baseClass} grid-cols-1`;
      case 'tablet':
        return `${baseClass} grid-cols-${Math.min(settings.products_per_row - 1, 2)}`;
      default:
        return `${baseClass} grid-cols-${settings.products_per_row}`;
    }
  };
  
  const getSpacingClass = () => {
    switch (settings.layout_spacing) {
      case 'compact':
        return 'gap-2';
      case 'comfortable':
        return 'gap-4';
      case 'spacious':
        return 'gap-6';
      default:
        return 'gap-4';
    }
  };
  
  const getDeviceContainerStyle = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[375px] mx-auto border rounded-xl shadow-lg overflow-hidden';
      case 'tablet':
        return 'max-w-[768px] mx-auto border rounded-xl shadow-lg overflow-hidden';
      default:
        return 'mx-auto border rounded-xl shadow-lg overflow-hidden';
    }
  };
  
  const getHeaderStyle = () => {
    let baseClass = 'bg-white border-b py-4 px-6';
    
    switch (settings.header_style) {
      case 'centered':
        return `${baseClass} flex justify-center items-center`;
      case 'logo-left':
        return `${baseClass} flex justify-between items-center flex-row-reverse`;
      case 'logo-right':
        return `${baseClass} flex justify-between items-center`;
      default:
        return `${baseClass} flex justify-center items-center`;
    }
  };
  
  const getFooterStyle = () => {
    let baseClass = 'bg-gray-50 py-4 border-t';
    
    switch (settings.footer_style) {
      case 'simple':
        return `${baseClass} py-4`;
      case 'detailed':
        return `${baseClass} py-8`;
      case 'minimal':
        return `${baseClass} py-2`;
      default:
        return `${baseClass} py-4`;
    }
  };
  
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        <div className="border-b p-4 flex justify-between items-center">
          <h3 className="font-semibold">معاينة المتجر</h3>
          
          <Tabs value={device} onValueChange={(value: any) => setDevice(value)} className="w-auto">
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="mobile" className="text-xs px-2">
                <Mobile className="h-3 w-3 mr-1" />
                <span>جوال</span>
              </TabsTrigger>
              <TabsTrigger value="tablet" className="text-xs px-2">
                <Tablet className="h-3 w-3 mr-1" />
                <span>لوحي</span>
              </TabsTrigger>
              <TabsTrigger value="desktop" className="text-xs px-2">
                <Monitor className="h-3 w-3 mr-1" />
                <span>سطح المكتب</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="p-4 bg-gray-100 min-h-[600px]">
          <div className={getDeviceContainerStyle()}>
            {/* Header */}
            <header className={getHeaderStyle()}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full"></div>
                <h1 
                  className="text-lg font-bold" 
                  style={{ fontFamily: settings.font_family !== 'default' ? `'${settings.font_family}', sans-serif` : 'inherit' }}
                >
                  اسم المتجر
                </h1>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </header>
            
            {/* Main content */}
            <div 
              className="p-6"
              style={{ backgroundColor: settings.secondary_color }}
            >
              {/* Hero section */}
              <div className="mb-8 rounded-lg overflow-hidden">
                <div 
                  className="h-48 w-full bg-gray-300 flex items-center justify-center"
                  style={{ backgroundColor: settings.primary_color }}
                >
                  <div className="text-center">
                    <h2 
                      className="text-xl md:text-2xl font-bold text-white mb-2"
                      style={{ fontFamily: settings.font_family !== 'default' ? `'${settings.font_family}', sans-serif` : 'inherit' }}
                    >
                      أهلاً بك في متجرنا
                    </h2>
                    <p 
                      className="text-sm md:text-base text-white mb-4"
                      style={{ fontFamily: settings.font_family !== 'default' ? `'${settings.font_family}', sans-serif` : 'inherit' }}
                    >
                      تسوق أحدث المنتجات وأفضل العروض
                    </p>
                    <button 
                      className={getButtonStyle()}
                      style={{ 
                        backgroundColor: settings.accent_color,
                        fontFamily: settings.font_family !== 'default' ? `'${settings.font_family}', sans-serif` : 'inherit'
                      }}
                    >
                      تصفح المنتجات
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Categories */}
              <div className="mb-8">
                <h3 
                  className="text-lg font-bold mb-4"
                  style={{ fontFamily: settings.font_family !== 'default' ? `'${settings.font_family}', sans-serif` : 'inherit' }}
                >
                  الفئات
                </h3>
                <div className={`grid grid-cols-3 ${getSpacingClass()}`}>
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-white p-3 rounded-lg flex flex-col items-center text-center"
                    >
                      <div 
                        className={`w-12 h-12 flex items-center justify-center mb-2 ${getImageStyle()}`}
                        style={{ backgroundColor: settings.accent_color }}
                      ></div>
                      <span 
                        className="text-xs font-medium"
                        style={{ fontFamily: settings.font_family !== 'default' ? `'${settings.font_family}', sans-serif` : 'inherit' }}
                      >
                        الفئة {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Products */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 
                    className="text-lg font-bold"
                    style={{ fontFamily: settings.font_family !== 'default' ? `'${settings.font_family}', sans-serif` : 'inherit' }}
                  >
                    منتجات مميزة
                  </h3>
                  <a 
                    href="#" 
                    className="text-sm text-primary"
                    style={{ 
                      color: settings.primary_color,
                      fontFamily: settings.font_family !== 'default' ? `'${settings.font_family}', sans-serif` : 'inherit'
                    }}
                  >
                    عرض الكل
                  </a>
                </div>
                
                <div className={getProductGridStyle()}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg overflow-hidden">
                      <div 
                        className={`h-32 w-full bg-gray-200 ${getImageStyle()}`}
                      ></div>
                      <div className="p-3">
                        <h4 
                          className="font-medium text-sm truncate"
                          style={{ fontFamily: settings.font_family !== 'default' ? `'${settings.font_family}', sans-serif` : 'inherit' }}
                        >
                          منتج {i + 1}
                        </h4>
                        <p 
                          className="text-gray-500 text-xs mt-1"
                          style={{ fontFamily: settings.font_family !== 'default' ? `'${settings.font_family}', sans-serif` : 'inherit' }}
                        >
                          وصف المنتج المختصر
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span 
                            className="font-bold text-sm"
                            style={{ fontFamily: settings.font_family !== 'default' ? `'${settings.font_family}', sans-serif` : 'inherit' }}
                          >
                            {(80 + i * 10).toFixed(2)} ر.س
                          </span>
                          <button 
                            className="text-xs p-1 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            style={{ backgroundColor: settings.primary_color }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <footer className={getFooterStyle()}>
              <div className="container mx-auto px-4 text-center">
                {settings.footer_style === 'detailed' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <h4 
                        className="font-bold mb-2"
                        style={{ fontFamily: settings.font_family !== 'default' ? `'${settings.font_family}', sans-serif` : 'inherit' }}
                      >
                        روابط سريعة
                      </h4>
                      <ul 
                        className="space-y-1 text-gray-600"
                        style={{ fontFamily: settings.font_family !== 'default' ? `'${settings.font_family}', sans-serif` : 'inherit' }}
                      >
                        <li>الرئيسية</li>
                        <li>المنتجات</li>
                        <li>عن المتجر</li>
                      </ul>
                    </div>
                    <div>
                      <h4 
                        className="font-bold mb-2"
                        style={{ fontFamily: settings.font_family !== 'default' ? `'${settings.font_family}', sans-serif` : 'inherit' }}
                      >
                        تواصل معنا
                      </h4>
                      <ul 
                        className="space-y-1 text-gray-600"
                        style={{ fontFamily: settings.font_family !== 'default' ? `'${settings.font_family}', sans-serif` : 'inherit' }}
                      >
                        <li>الهاتف</li>
                        <li>البريد الإلكتروني</li>
                        <li>العنوان</li>
                      </ul>
                    </div>
                    <div>
                      <h4 
                        className="font-bold mb-2"
                        style={{ fontFamily: settings.font_family !== 'default' ? `'${settings.font_family}', sans-serif` : 'inherit' }}
                      >
                        تابعنا
                      </h4>
                      <div className="flex justify-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                        <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                        <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                      </div>
                    </div>
                  </div>
                ) : null}
                
                <p 
                  className="text-xs text-gray-500"
                  style={{ fontFamily: settings.font_family !== 'default' ? `'${settings.font_family}', sans-serif` : 'inherit' }}
                >
                  جميع الحقوق محفوظة © {new Date().getFullYear()} اسم المتجر
                </p>
              </div>
            </footer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemePreview;
