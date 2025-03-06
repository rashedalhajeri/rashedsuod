
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

  return (
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
  );
};

export default PreviewHeader;
