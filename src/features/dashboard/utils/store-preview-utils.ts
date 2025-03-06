
import { toast } from "sonner";

export const checkStoreStatus = async (storeUrl: string | null): Promise<boolean> => {
  if (!storeUrl) return false;
  
  // In a real implementation, we would check the store status
  // For now, we'll just return true
  return true;
};

export const copyStoreLink = (storeUrl: string | null): boolean => {
  if (!storeUrl) {
    toast.error("عذراً، لا يمكن نسخ الرابط حالياً");
    return false;
  }
  
  navigator.clipboard.writeText(storeUrl);
  toast.success("تم نسخ رابط المتجر");
  return true;
};

export const shareStore = async (storeUrl: string | null, storeName: string | undefined): Promise<boolean> => {
  if (!storeUrl) {
    toast.error("عذراً، لا يمكن مشاركة المتجر حالياً");
    return false;
  }
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `متجر ${storeName}`,
        text: `تفضل بزيارة متجري الإلكتروني ${storeName}`,
        url: storeUrl,
      });
      toast.success("تم مشاركة المتجر بنجاح");
      return true;
    } catch (error) {
      // User cancelled or share failed
      return false;
    }
  } else {
    // Fallback to copy if Web Share API is not available
    copyStoreLink(storeUrl);
    toast.success("تم نسخ رابط المتجر، يمكنك مشاركته الآن");
    return true;
  }
};
