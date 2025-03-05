
import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProductDialog from "@/components/product/ProductDialog";
import ProductDeleteDialog from "@/components/product/ProductDeleteDialog";
import useStoreData from "@/hooks/use-store-data";
import ProductHeader from "@/components/product/ProductHeader";
import SearchAndFilter from "@/components/product/SearchAndFilter";
import ProductList from "@/components/product/ProductList";

const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const { data: storeData } = useStoreData();

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data: storeData } = await useStoreData().refetch();
      
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
      
      return data || [];
    }
  });

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      if (selectedProduct.image_url) {
        const imageUrl = selectedProduct.image_url;
        const storageUrl = supabase.storage.from('store-images').getPublicUrl('').data.publicUrl;
        
        if (imageUrl.startsWith(storageUrl)) {
          const imagePath = imageUrl.replace(storageUrl + '/', '');
          
          const { error: storageError } = await supabase.storage
            .from('store-images')
            .remove([imagePath]);
            
          if (storageError) {
            console.error("Error deleting product image:", storageError);
          }
        }
      }
      
      if (selectedProduct.additional_images && Array.isArray(selectedProduct.additional_images) && selectedProduct.additional_images.length > 0) {
        const storageUrl = supabase.storage.from('store-images').getPublicUrl('').data.publicUrl;
        
        const imagePaths = selectedProduct.additional_images
          .filter((url: string) => url.startsWith(storageUrl))
          .map((url: string) => url.replace(storageUrl + '/', ''));
        
        if (imagePaths.length > 0) {
          const { error: storageError } = await supabase.storage
            .from('store-images')
            .remove(imagePaths);
            
          if (storageError) {
            console.error("Error deleting additional product images:", storageError);
          }
        }
      }
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', selectedProduct.id);
        
      if (error) {
        console.error("Error deleting product:", error);
        toast.error("حدث خطأ أثناء حذف المنتج");
        return;
      }
      
      toast.success("تم حذف المنتج بنجاح");
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
      refetch();
    } catch (error) {
      console.error("Error in handleDeleteProduct:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  const handleAddProduct = () => {
    setIsAddDialogOpen(true);
  };

  const handleDeleteProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <ProductHeader onAddProduct={handleAddProduct} />
        
        <SearchAndFilter 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <Card className="overflow-hidden border-gray-200 shadow-sm">
          <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-white border-b">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <span className="bg-primary/10 p-1 rounded">
                <Package className="h-4 w-4 text-primary" />
              </span>
              قائمة المنتجات
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ProductList 
              products={filteredProducts}
              isLoading={isLoading}
              storeData={storeData}
              onDelete={handleDeleteProductClick}
              onAddProduct={handleAddProduct}
            />
          </CardContent>
        </Card>
      </div>
      
      <ProductDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={() => refetch()}
      />
      
      <ProductDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteProduct}
        product={selectedProduct}
        currency={storeData?.currency}
      />
    </DashboardLayout>
  );
};

export default Products;
