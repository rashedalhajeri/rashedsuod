
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface StoreHeaderProps {
  storePreviewUrl: string;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ storePreviewUrl }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">متجري</h1>
        <p className="text-muted-foreground">
          إدارة متجرك الإلكتروني وتخصيصه
        </p>
      </div>
      <div className="flex gap-2 self-stretch sm:self-auto">
        <Button asChild variant="outline" className="gap-2">
          <Link to="/dashboard/settings">
            <Settings size={16} />
            إعدادات المتجر
          </Link>
        </Button>
        
        {storePreviewUrl && (
          <Button asChild className="gap-2">
            <Link to={storePreviewUrl} target="_blank">
              <ExternalLink size={16} />
              عرض المتجر
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default StoreHeader;
