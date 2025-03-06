
import React from "react";
import { ThemeOption, ThemeSettings } from "@/features/dashboard/types/theme-types";
import PreviewHeader from "./theme/preview/PreviewHeader";
import PreviewNavigation from "./theme/preview/PreviewNavigation";
import HomePagePreview from "./theme/preview/HomePagePreview";
import CategoryPagePreview from "./theme/preview/CategoryPagePreview";
import ProductPagePreview from "./theme/preview/ProductPagePreview";
import DeviceFrame from "./theme/preview/DeviceFrame";
import { getButtonStyle, getImageStyle, getProductsGridStyle } from "./theme/preview/ThemeStyleUtils";

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
  const buttonStyle = getButtonStyle(themeSettings?.button_style || theme.styles?.button);
  
  // تطبيق أسلوب الصورة
  const imageStyle = getImageStyle(themeSettings?.image_style || theme.styles?.image);
  
  // أسلوب الرأس
  const headerStyle = themeSettings?.header_style || theme.styles?.header || "standard";
  
  // المنتجات لكل صف وتعديلات التخطيط
  const productsPerRow = themeSettings?.products_per_row || theme.layout?.productsPerRow || 3;
  const productsGridStyle = getProductsGridStyle(productsPerRow, device);

  // محتوى المعاينة بناءً على الصفحة المحددة
  const renderContent = () => {
    switch (page) {
      case 'product':
        return (
          <ProductPagePreview 
            primaryColor={primaryColor} 
            buttonStyle={buttonStyle} 
            imageStyle={imageStyle} 
            productsGridStyle={productsGridStyle} 
          />
        );
      case 'category':
        return (
          <CategoryPagePreview 
            primaryColor={primaryColor} 
            buttonStyle={buttonStyle} 
            imageStyle={imageStyle} 
            productsGridStyle={productsGridStyle} 
          />
        );
      default:
        return (
          <HomePagePreview 
            primaryColor={primaryColor} 
            secondaryColor={secondaryColor} 
            accentColor={accentColor} 
            buttonStyle={buttonStyle} 
            imageStyle={imageStyle} 
            productsGridStyle={productsGridStyle} 
          />
        );
    }
  };
  
  return (
    <div 
      className="flex flex-col h-full overflow-hidden border rounded-lg" 
      style={{ fontFamily: fontFamily }}
    >
      <DeviceFrame device={device}>
        {/* Store preview */}
        <div className="flex-1 overflow-auto bg-white">
          {/* Header */}
          <PreviewHeader secondaryColor={secondaryColor} headerStyle={headerStyle} />
          
          {/* Navigation */}
          <PreviewNavigation />
          
          {/* Content Area */}
          {renderContent()}
        </div>
      </DeviceFrame>
    </div>
  );
};

export default ThemePreview;
