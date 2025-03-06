
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from 'lucide-react';

interface ComingSoonBannerProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const ComingSoonBanner: React.FC<ComingSoonBannerProps> = ({ 
  title, 
  description, 
  icon = <Sparkles className="h-8 w-8 text-primary mb-2" />
}) => {
  return (
    <Card className="mt-4 border-dashed border-primary/30 bg-primary/5">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-2">
          {icon}
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComingSoonBanner;
