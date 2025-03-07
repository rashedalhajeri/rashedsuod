
import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Package, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import useStoreData, { getCurrencyFormatter } from "@/hooks/use-store-data";
import { Product } from "@/utils/products/types";
import { convertToStringArray } from "@/utils/products/format-helpers";
import ProductFormDialog from "@/components/product/ProductFormDialog";
import ProductDeleteDialog from "@/components/product/ProductDeleteDialog";
import ProductSearchBar from "@/components/product/ProductSearchBar";
import ProductsList from "@/components/product/ProductsList";

const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const { data: storeData } = useStoreData();
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'KWD');
  
  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      if (!storeData?.id) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      const processedProducts: Product[] = [];
      
      for (const item of data) {
        const product: Product = {
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category_id: item.category_id,
          store_id: item.store_id,
          image_url: item.image_url,
          stock_quantity: item.stock_quantity,
          created_at: item.created_at,
          updated_at: item.updated_at,
          discount_price: item.discount_price,
          track_inventory: Boolean(item.track_inventory),
          has_colors: Boolean(item.has_colors),
          has_sizes: Boolean(item.has_sizes),
          require_customer_name: Boolean(item.require_customer_name),
          require_customer_image: Boolean(item.require_customer_image),
          additional_images: convertToStringArray(item.additional_images),
          available_colors: convertToStringArray(item.available_colors),
          available_sizes: convertToStringArray(item.available_sizes)
        };
        
        processedProducts.push(product);
      }
      
      return processedProducts;
    },
    enabled: !!storeData?.id,
  });
  
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
          <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>إضافة منتج</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <ProductSearchBar 
              searchQuery={searchQuery} 
              onSearchChange={setSearchQuery} 
            />
          </div>
          <div>
            <Button variant="outline" className="w-full gap-2">
              <Filter className="h-4 w-4" />
              <span>تصفية النتائج</span>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              <Package className="h-4 w-4 inline-block ml-2" />
              قائمة المنتجات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductsList 
              products={filteredProducts} 
              isLoading={isLoading}
              formatCurrency={formatCurrency}
              onAddProductClick={() => setIsAddDialogOpen(true)}
              onDeleteClick={handleDeleteClick}
            />
          </CardContent>
        </Card>
      </div>
      
      <ProductFormDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        storeId={storeData?.id}
        onAddSuccess={refetch}
      />
      
      <ProductDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedProduct={selectedProduct}
        onDeleteSuccess={refetch}
      />
    </DashboardLayout>
  );
};

export default Products;
