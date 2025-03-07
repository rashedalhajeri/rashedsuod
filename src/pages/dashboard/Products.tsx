
import React, { useState } from "react";
import { useStoreData } from "@/hooks/use-store-data";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import ProductDetailDialog from "@/components/product/ProductDetailDialog";
import ProductFormDialog from "@/components/product/ProductFormDialog";
import ProductsList from "@/components/product/ProductsList";
import ProductSearchBar from "@/components/product/ProductSearchBar";
import ProductEmptyState from "@/components/product/ProductEmptyState";
import ProductBulkActions from "@/components/product/ProductBulkActions";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

const Products = () => {
  const { data: storeData, isLoading: loadingStore } = useStoreData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const {
    data: products,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["products", storeData?.id],
    queryFn: async () => {
      if (!storeData?.id) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", storeData.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!storeData?.id
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredProducts = products?.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEditProduct = (productId) => {
    setSelectedProductId(productId);
    setIsEditDialogOpen(true);
  };

  const handleSelectionChange = (items) => {
    setSelectedItems(items);
  };

  const handleProductUpdate = () => {
    refetch();
  };

  if (loadingStore || isLoading) {
    return <LoadingState message="جاري تحميل المنتجات..." />;
  }

  if (error) {
    return (
      <ErrorState 
        title="خطأ في تحميل المنتجات"
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  if (products?.length === 0) {
    return (
      <ProductEmptyState 
        onAddProduct={() => setIsAddProductOpen(true)} 
      />
    );
  }

  return (
    <div className="container mx-auto py-6 px-4" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold">المنتجات</h1>
        <Button onClick={() => setIsAddProductOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> إضافة منتج
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <ProductSearchBar onSearch={handleSearch} />
            
            {selectedItems.length > 0 && (
              <ProductBulkActions 
                selectedCount={selectedItems.length} 
                onActionComplete={handleProductUpdate}
              />
            )}
          </div>
        </div>
        
        <ProductsList 
          products={filteredProducts} 
          onEdit={handleEditProduct}
          onSelectionChange={handleSelectionChange}
        />
      </div>

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
  );
};

export default Products;
