
import React from "react";
import { Phone, ShoppingBag, Heart, User, Search } from "lucide-react";

interface PreviewHeaderProps {
  secondaryColor: string;
  headerStyle: string;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ 
  secondaryColor, 
  headerStyle 
}) => {
  const getHeaderStyle = () => {
    switch (headerStyle) {
      case "minimal": return "py-2";
      case "centered": return "py-6 text-center";
      default: return "py-4";
    }
  };

  // Add a subtle glass effect on top of the background color
  const backgroundColor = secondaryColor;
  const textColor = isLightColor(secondaryColor) ? '#333' : '#fff';
  
  return (
    <div 
      className={`${getHeaderStyle()} px-4 backdrop-blur-sm flex justify-between items-center shadow-sm`}
      style={{ 
        backgroundColor: `${backgroundColor}dd`, // Add transparency
        color: textColor
      }}
    >
      <div className="flex-1">
        <div className="font-bold text-lg">متجر alhajeri</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 flex items-center justify-center rounded-full" 
             style={{ backgroundColor: `${textColor}22` }}>
          <Search className="w-4 h-4" />
        </div>
        <div className="w-7 h-7 flex items-center justify-center rounded-full relative"
             style={{ backgroundColor: `${textColor}22` }}>
          <ShoppingBag className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            2
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper function to determine if a color is light or dark
const isLightColor = (color: string): boolean => {
  // Remove the hash if it exists
  color = color.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calculate brightness (using a common formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return true if color is light
  return brightness > 128;
};

export default PreviewHeader;
