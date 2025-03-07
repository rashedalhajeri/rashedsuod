
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Product, RawProductData } from "@/utils/products/types";
import { mapRawProductToProduct } from "@/utils/products/mappers";
import { databaseClient } from "@/integrations/database/client";

type ProductQueryResult = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  stock_quantity: number | null;
  image_url: string | null;
  additional_images: any;
  track_inventory: boolean | null;
  category_id: string | null;
  has_colors: boolean | null;
  has_sizes: boolean | null;
  require_customer_name: boolean | null;
  require_customer_image: boolean | null;
  available_colors: any;
  available_sizes: any;
  created_at: string;
  updated_at: string;
  store_id: string;
  is_featured: boolean;
  sales_count: number;
  is_archived: boolean;
  is_active: boolean | null;
  section_id: string | null;
  category: { id: string; name: string } | null;
};

export const useProducts = (storeId?: string) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const {
    data: rawProducts,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["products", storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("store_id", storeId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as unknown as ProductQueryResult[];
    },
    enabled: !!storeId
  });

  const products: Product[] = rawProducts ? rawProducts.map((item: any) => mapRawProductToProduct({
    ...item,
    is_featured: item.is_featured || false,
    sales_count: item.sales_count || 0,
    is_archived: item.is_archived || false,
    is_active: item.is_active !== false // Default to true if not explicitly set to false
  } as RawProductData)) : [];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSelectionChange = (items: string[]) => {
    setSelectedItems(items);
  };

  const handleProductUpdate = () => {
    setIsRefreshing(true);
    refetch().finally(() => setIsRefreshing(false));
  };

  const handleArchiveProduct = async (productId: string, isArchived: boolean) => {
    try {
      const { data, error } = await databaseClient.products.archiveProduct(productId, isArchived);
      
      if (error) {
        toast({
          variant: "destructive",
          title: isArchived ? "خطأ في أرشفة المنتج" : "خطأ في إلغاء أرشفة المنتج",
          description: error.message,
        });
        return;
      }
      
      toast({
        title: isArchived ? "تمت الأرشفة بنجاح" : "تم إلغاء الأرشفة بنجاح",
        description: isArchived ? "تم أرشفة المنتج بنجاح" : "تم إلغاء أرشفة المنتج بنجاح",
      });
      
      handleProductUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ غير متوقع",
        description: error.message,
      });
    }
  };

  const handleActivateProduct = async (productId: string, isActive: boolean) => {
    try {
      const { data, error } = await databaseClient.products.activateProduct(productId, isActive);
      
      if (error) {
        toast({
          variant: "destructive",
          title: isActive ? "خطأ في تفعيل المنتج" : "خطأ في تعطيل المنتج",
          description: error.message,
        });
        return;
      }
      
      toast({
        title: isActive ? "تم تفعيل المنتج بنجاح" : "تم تعطيل المنتج بنجاح",
        description: isActive ? "تم تفعيل المنتج وأصبح ظاهر للعملاء" : "تم تعطيل المنتج وأصبح غير ظاهر للعملاء",
      });
      
      handleProductUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ غير متوقع",
        description: error.message,
      });
    }
  };

  const filteredProducts = products || [];
  
  const archivedCount = products?.filter(p => p.is_archived).length || 0;
  const inactiveCount = products?.filter(p => !p.is_archived && p.is_active === false).length || 0;

  return {
    products,
    filteredProducts,
    isLoading,
    error,
    searchTerm,
    selectedItems,
    isRefreshing,
    archivedCount,
    inactiveCount,
    handleSearch,
    handleSelectionChange,
    handleProductUpdate,
    handleArchiveProduct,
    handleActivateProduct,
    refetch
  };
};
