
import React from "react";
import { Link } from "react-router-dom";

interface StoreLogoProps {
  storeName: string;
  logoUrl?: string | null;
  storeDomain: string;
}

const StoreLogo: React.FC<StoreLogoProps> = ({ storeName, logoUrl, storeDomain }) => {
  // Create initials for the avatar if no logo
  const initials = storeName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <Link to={`/store/${storeDomain}`} className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={storeName} 
              className="h-full w-full object-cover" 
              onError={e => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }} 
            />
          ) : (
            <span className="text-lg font-bold text-blue-600">
              {initials}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default StoreLogo;
