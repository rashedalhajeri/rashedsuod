
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import useStoreData from '@/hooks/use-store-data';
import StoreStatus from './preview/StoreStatus';
import ActionButtons from './preview/ActionButtons';
import PreviewDialog from './preview/PreviewDialog';
import { checkStoreStatus, copyStoreLink, shareStore } from '../utils/store-preview-utils';

const StorePreviewButton = () => {
  const { data: storeData } = useStoreData();
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  
  const storeUrl = storeData?.domain_name 
    ? `https://${storeData.domain_name}.linok.me` 
    : null;
  
  useEffect(() => {
    const initializeStoreStatus = async () => {
      if (storeUrl) {
        const status = await checkStoreStatus(storeUrl);
        setIsOnline(status);
      }
    };
    
    initializeStoreStatus();
  }, [storeUrl]);
  
  const handleCopyLink = () => {
    if (copyStoreLink(storeUrl)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const openStorePreview = () => {
    if (storeUrl) {
      setPreviewOpen(true);
    } else {
      toast.error("عذراً، لا يمكن مشاهدة المتجر حالياً");
    }
  };
  
  const openExternalLink = () => {
    if (storeUrl) {
      window.open(storeUrl, '_blank');
    } else {
      toast.error("عذراً، لا يمكن فتح المتجر حالياً");
    }
  };
  
  const handleShareStore = () => {
    shareStore(storeUrl, storeData?.store_name);
  };
  
  if (!storeData || !storeUrl) {
    return null;
  }
  
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <StoreStatus isOnline={isOnline} storeUrl={storeUrl} />
        
        <ActionButtons
          copied={copied}
          onCopyLink={handleCopyLink}
          onOpenPreview={openStorePreview}
          onExternalLink={openExternalLink}
          onShare={handleShareStore}
        />
      </div>

      <PreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        storeUrl={storeUrl}
        storeName={storeData?.store_name}
        onExternalLinkClick={openExternalLink}
      />
    </>
  );
};

export default StorePreviewButton;
