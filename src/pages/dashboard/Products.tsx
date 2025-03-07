
import React, { useState } from "react";
import { useStoreData } from "@/hooks/use-store-data";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Search, Filter } from "lucide-react";
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

const Products = () => {
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
      return data;
    },
    enabled: !!storeData?.id
  });

  const products: Product[] = rawProducts ? rawProducts.map((item: any) => mapRawProductToProduct({
    ...item,
    is_featured: item.is_featured || false,
    sales_count: item.sales_count || 0
  } as RawProductData)) : [];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredProducts = products?.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
            <h1 className="text-xl sm:text-2xl font-bold">المنتجات</h1>
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
            />
          </Card>
        </motion.div>

        {isMobile && (
          <div className="fixed bottom-20 right-4">
            <Button 
              size="icon"
              onClick={handleProductUpdate}
              disabled={isRefreshing}
              variant="default"
              className="rounded-full h-12 w-12 shadow-lg"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        )}

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
