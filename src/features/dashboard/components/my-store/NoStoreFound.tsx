
import React from "react";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";

const NoStoreFound: React.FC = () => {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <Store className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-xl font-medium mb-2">لم يتم العثور على متجر</div>
      <div className="text-muted-foreground mb-6">الرجاء إنشاء متجر جديد أولاً</div>
      <Button variant="default" asChild>
        <a href="/create-store">إنشاء متجر جديد</a>
      </Button>
    </div>
  );
};

export default NoStoreFound;
