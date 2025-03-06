
import React from "react";
import { Link } from "react-router-dom";

interface StoreLogoProps {
  storeName: string;
  logoUrl?: string | null;
  storeDomain: string;
}

const StoreLogo: React.FC<StoreLogoProps> = ({ storeName, logoUrl, storeDomain }) => {
  return (
    <Link to={`/store/${storeDomain}`} className="flex items-center gap-3">
      {logoUrl ? (
        <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-white shadow-sm">
          <img 
            src={logoUrl} 
            alt={storeName} 
            className="h-10 w-10 object-contain" 
            onError={e => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }} 
          />
        </div>
      ) : (
        <div className="h-12 w-12 bg-gradient-to-br from-primary/80 to-primary rounded-full flex items-center justify-center border border-primary/20 shadow-sm">
          <span className="text-lg font-bold text-white">
            {storeName ? storeName.charAt(0).toUpperCase() : "S"}
          </span>
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-bold text-xl text-gray-800">{storeName}</span>
        <span className="text-xs text-gray-500">متجر إلكتروني احترافي</span>
      </div>
    </Link>
  );
};

export default StoreLogo;
