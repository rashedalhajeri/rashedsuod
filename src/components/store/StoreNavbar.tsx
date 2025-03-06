
import React from "react";
import { useParams } from "react-router-dom";
import StoreHeader from "@/components/store/unified/StoreHeader";

interface StoreNavbarProps {
  storeName: string;
  logoUrl?: string | null;
}

const StoreNavbar: React.FC<StoreNavbarProps> = ({
  storeName,
  logoUrl
}) => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  
  return (
    <StoreHeader
      title=""
      storeName={storeName}
      logoUrl={logoUrl || undefined}
      storeDomain={storeDomain}
      isMainHeader={true}
    />
  );
};

export default StoreNavbar;
