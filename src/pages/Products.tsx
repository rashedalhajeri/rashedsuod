
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import ProductListItem from "@/components/product/ProductListItem";
import ProductEmptyState from "@/components/product/ProductEmptyState";
import ProductBulkActions from "@/components/product/ProductBulkActions";
import ProductFilters from "@/components/product/ProductFilters";

const Products = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Mock products data
  const mockProducts = Array(12).fill(0).map((_, i) => ({
    id: `prod-${i + 1}`,
    name: `منتج تجريبي ${i + 1}`,
    description: "وصف المنتج يظهر هنا ويمكن أن يكون طويلاً",
    price: 99.99 + i * 10,
    stock: Math.floor(Math.random() * 100),
    images: ["/placeholder.svg"],
    category: i % 3 === 0 ? "ملابس" : i % 3 === 1 ? "إلكترونيات" : "أحذية",
    isActive: Math.random() > 0.2
  }));
  
  const handleProductSelect = (productId: string, selected: boolean) => {
    if (selected) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };
  
  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on`, selectedProducts);
    // Reset selection after action
    setSelectedProducts([]);
  };
  
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.includes(searchQuery) || 
                         product.description.includes(searchQuery);
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">المنتجات</h2>
          <p className="text-muted-foreground">
            إدارة منتجات متجرك وتتبع المخزون
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">استيراد</Button>
          <Button variant="outline">تصدير</Button>
          <Button>إضافة منتج</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>قائمة المنتجات</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant={view === "grid" ? "default" : "outline"} 
                size="sm"
                onClick={() => setView("grid")}
              >
                شبكة
              </Button>
              <Button 
                variant={view === "list" ? "default" : "outline"} 
                size="sm"
                onClick={() => setView("list")}
              >
                قائمة
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <ProductFilters 
              onSearch={setSearchQuery}
              onCategoryChange={setCategoryFilter}
            />
          </div>
          
          {selectedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4"
            >
              <ProductBulkActions 
                selectedCount={selectedProducts.length}
                onAction={handleBulkAction}
                onClearSelection={() => setSelectedProducts([])}
              />
            </motion.div>
          )}
          
          {filteredProducts.length === 0 ? (
            <ProductEmptyState searchQuery={searchQuery} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {view === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      isSelected={selectedProducts.includes(product.id)}
                      onSelect={(selected) => handleProductSelect(product.id, selected)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredProducts.map(product => (
                    <ProductListItem 
                      key={product.id}
                      product={product}
                      isSelected={selectedProducts.includes(product.id)}
                      onSelect={(selected) => handleProductSelect(product.id, selected)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
