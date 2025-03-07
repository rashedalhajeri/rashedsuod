
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardTitle, CardDescription } from "@/components/ui/card";

interface StoreHeaderProps {
  storeName: string;
  logoUrl?: string | null;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ storeName, logoUrl }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = getInitials(storeName || "Store");

  return (
    <div className="space-y-1 items-center pb-2 text-center">
      <Avatar className="h-20 w-20 mb-4 mx-auto">
        {logoUrl ? (
          <AvatarImage src={logoUrl} alt={storeName} />
        ) : (
          <AvatarFallback className="bg-primary text-white text-xl font-bold">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
      <CardTitle className="text-2xl text-center font-bold">إنشاء حساب جديد</CardTitle>
      <CardDescription className="text-center">
        سجل الآن للتسوق في {storeName}
      </CardDescription>
    </div>
  );
};

export default StoreHeader;
