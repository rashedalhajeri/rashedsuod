
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getThemeSettings, saveThemeSettings, ThemeSettings } from '@/utils/theme-utils';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import { applyThemeSettings } from '@/utils/theme-utils';

export const useThemeSettings = (storeId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: themeSettings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['themeSettings', storeId],
    queryFn: () => getThemeSettings(storeId || ''),
    enabled: !!storeId,
  });
  
  const { mutate: updateThemeSettings, isPending: isSaving } = useMutation({
    mutationFn: (settings: ThemeSettings) => saveThemeSettings(settings),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(['themeSettings', storeId], data);
        toast({
          title: "نجاح",
          description: "تم حفظ إعدادات التصميم بنجاح",
        });
        
        // Apply the theme settings
        applyThemeSettings(data);
      }
    },
    onError: (error) => {
      console.error('Error saving theme settings:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ إعدادات التصميم",
        variant: "destructive",
      });
    },
  });
  
  // Apply theme settings when they're loaded
  useEffect(() => {
    if (themeSettings) {
      applyThemeSettings(themeSettings);
    }
  }, [themeSettings]);
  
  return {
    themeSettings,
    isLoading,
    error,
    updateThemeSettings,
    isSaving,
  };
};

export default useThemeSettings;
