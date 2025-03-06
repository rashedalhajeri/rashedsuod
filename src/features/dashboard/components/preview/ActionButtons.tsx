
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy, CheckCheck, ExternalLink, Share2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye } from './PreviewDialog';
import { useNavigate } from 'react-router-dom';

interface ActionButtonsProps {
  copied: boolean;
  onCopyLink: () => void;
  onOpenPreview: () => void;
  onExternalLink: () => void;
  onShare: () => void;
  storeDomain?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  copied,
  onCopyLink,
  onOpenPreview,
  onExternalLink,
  onShare,
  storeDomain
}) => {
  const navigate = useNavigate();

  const handleOpenStore = () => {
    if (storeDomain) {
      navigate(`/store/${storeDomain}`);
    } else {
      onExternalLink();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 w-full">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-primary-200 hover:bg-primary-50"
              onClick={onCopyLink}
            >
              {copied ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              <span>نسخ الرابط</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>نسخ رابط المتجر</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-primary-200 hover:bg-primary-50"
              onClick={onOpenPreview}
            >
              <Eye />
              <span>مشاهدة متجري</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>مشاهدة المتجر داخل لوحة التحكم</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-primary-200 hover:bg-primary-50"
              onClick={handleOpenStore}
            >
              <ExternalLink className="h-4 w-4" />
              <span>فتح المتجر</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>فتح المتجر في نفس النافذة</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-primary-200 hover:bg-primary-50"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4" />
              <span>مشاركة</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>مشاركة رابط المتجر</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ActionButtons;
