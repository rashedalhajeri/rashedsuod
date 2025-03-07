import React, { useState, useEffect } from "react";
import { useStoreData } from "@/hooks/use-store-data";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Filter, ArchiveIcon, Package } from "lucide-react";
import ProductDetailDialog from "@/components/product/ProductDetailDialog";
import ProductFormDialog from "@/components/product/ProductFormDialog";
import ProductsList from "@/components/product/ProductsList";
import { ProductEmptyState } from "@/components/product/ProductEmptyState";
import { ProductBulkActions } from "@/components/product/ProductBulkActions";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Product, RawProductData } from "@/utils/products/types";
import { mapRawProductToProduct } from "@/utils/products/mappers";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { databaseClient } from "@/integrations/database/client";
import { toast } from "@/components/ui/use-toast";

const Products = () => {
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
    category: { id: string; name: string } | null;
  };

  const { data: storeData, isLoading: loadingStore } = useStoreData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    data: rawProducts,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["products", storeData?.id],
    queryFn: async () => {
      if (!storeData?.id) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("store_id", storeData.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as unknown as ProductQueryResult[];
    },
    enabled: !!storeData?.id
  });

  const products: Product[] = rawProducts ? rawProducts.map((item: ProductQueryResult) => mapRawProductToProduct({
    ...item,
    is_featured: item.is_featured || false,
    sales_count: item.sales_count || 0,
    is_archived: item.is_archived || false
  } as RawProductData)) : [];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredProducts = products || [];

  const handleEditProduct = (productId: string) => {
    setSelectedProductId(productId);
    setIsEditDialogOpen(true);
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

  const archivedCount = products?.filter(p => p.is_archived).length || 0;

  if (loadingStore || isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="جاري تحميل المنتجات..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorState 
          title="خطأ في تحميل المنتجات"
          message={(error as Error).message}
          onRetry={refetch}
        />
      </DashboardLayout>
    );
  }

  if (products?.length === 0) {
    return (
      <DashboardLayout>
        <ProductEmptyState 
          onAddProduct={() => setIsAddProductOpen(true)} 
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 space-y-4 md:space-y-0"
        >
          <div>
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold">المنتجات</h1>
              {archivedCount > 0 && (
                <Badge variant="outline" className="mr-2 font-normal">
                  <ArchiveIcon className="h-3 w-3 ml-1" />
                  {archivedCount} مؤرشف
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              إدارة منتجات متجرك ({products.length} منتج)
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            {!isMobile && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleProductUpdate}
                disabled={isRefreshing}
                className="whitespace-nowrap flex items-center gap-1"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} /> 
                تحديث
              </Button>
            )}
            <Button 
              onClick={() => setIsAddProductOpen(true)}
              className="w-full md:w-auto"
            >
              <Plus className="h-4 w-4 ml-2" /> إضافة منتج
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="overflow-hidden shadow-sm border rounded-xl">
            {selectedItems.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 sm:p-4 border-b bg-blue-50/80"
              >
                <ProductBulkActions 
                  selectedCount={selectedItems.length}
                  selectedIds={selectedItems}
                  onActionComplete={handleProductUpdate}
                />
              </motion.div>
            )}
            
            <ProductsList 
              products={filteredProducts} 
              onEdit={handleEditProduct}
              onSelectionChange={handleSelectionChange}
              searchTerm={searchTerm}
              onSearch={handleSearch}
              onArchive={handleArchiveProduct}
              onRefresh={handleProductUpdate}
            />
          </Card>
        </motion.div>

        <ProductFormDialog
          isOpen={isAddProductOpen}
          onOpenChange={setIsAddProductOpen}
          storeId={storeData?.id}
          onAddSuccess={handleProductUpdate}
        />

        {isEditDialogOpen && (
          <ProductDetailDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            productId={selectedProductId}
            storeData={storeData}
            onSuccess={handleProductUpdate}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Products;
