
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStoreData } from "@/hooks/use-store-data";
import { Plus, Grid, List } from "lucide-react";
import { Link } from "react-router-dom";
import ProductsGrid from "@/features/products/components/ProductsGrid";
import ProductsList from "@/features/products/components/ProductsList";
import ProductsFilters from "@/features/products/components/ProductsFilters";
import ProductsBulkActions from "@/features/products/components/ProductsBulkActions";

const Products = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { data: storeData } = useStoreData();

  const handleProductSelection = (productId: string, selected: boolean) => {
    if (selected) {
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      setSelectedProducts((prev) => prev.filter(id => id !== productId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    // هذه الوظيفة ستتم تنفيذها بالكامل عند ربط البيانات
    setSelectedProducts([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">المنتجات</h1>
          <p className="text-muted-foreground mt-1">إدارة منتجات متجرك</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" />
            إضافة منتج
          </Link>
        </Button>
      </div>

      {selectedProducts.length > 0 ? (
        <ProductsBulkActions
          count={selectedProducts.length}
          onCancel={() => setSelectedProducts([])}
        />
      ) : (
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Tabs defaultValue="all" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="all">جميع المنتجات</TabsTrigger>
              <TabsTrigger value="active">متاح</TabsTrigger>
              <TabsTrigger value="draft">مسودة</TabsTrigger>
              <TabsTrigger value="archived">مؤرشف</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-muted rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className={`${viewMode === 'grid' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`${viewMode === 'list' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-1">
          <ProductsFilters />
        </div>
        <div className="md:col-span-4 space-y-4">
          {viewMode === 'grid' ? (
            <ProductsGrid 
              storeId={storeData?.id || ''}
              onSelectProduct={handleProductSelection}
              selectedProducts={selectedProducts}
            />
          ) : (
            <ProductsList 
              storeId={storeData?.id || ''}
              onSelectProduct={handleProductSelection}
              selectedProducts={selectedProducts}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
