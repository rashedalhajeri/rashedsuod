import React, { useState } from "react";
import { useStoreData } from "@/hooks/use-store-data";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
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

const Products = () => {
  const { data: storeData, isLoading: loadingStore } = useStoreData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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
      <div className="container mx-auto py-6 px-4" dir="rtl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">المنتجات</h1>
            <p className="text-muted-foreground">
              إدارة منتجات متجرك ({products.length} منتج)
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleProductUpdate}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> 
              تحديث
            </Button>
            <Button onClick={() => setIsAddProductOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> إضافة منتج
            </Button>
          </div>
        </div>

        <Card>
          {selectedItems.length > 0 && (
            <div className="p-4 border-b">
              <ProductBulkActions 
                selectedCount={selectedItems.length}
                selectedIds={selectedItems}
                onActionComplete={handleProductUpdate}
              />
            </div>
          )}
          
          <ProductsList 
            products={filteredProducts} 
            onEdit={handleEditProduct}
            onSelectionChange={handleSelectionChange}
            searchTerm={searchTerm}
            onSearch={handleSearch}
          />
        </Card>

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
