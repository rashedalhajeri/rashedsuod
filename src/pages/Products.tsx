
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutGrid, List, Plus, Filter, 
  Download, Upload, Search 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import ProductsGrid from "@/features/products/components/ProductsGrid";
import ProductsList from "@/features/products/components/ProductsList";
import ProductsEmptyState from "@/features/products/components/ProductsEmptyState";
import ProductsFilters from "@/features/products/components/ProductsFilters";
import ProductsBulkActions from "@/features/products/components/ProductsBulkActions";

// Mock data
const generateMockProducts = () => {
  return Array(12).fill(0).map((_, i) => ({
    id: `prod-${i + 1}`,
    name: `منتج تجريبي ${i + 1}`,
    description: "وصف المنتج يظهر هنا ويمكن أن يكون طويلاً",
    price: 99.99 + i * 10,
    stock: Math.floor(Math.random() * 100),
    images: ["/placeholder.svg"],
    category: i % 3 === 0 ? "ملابس" : i % 3 === 1 ? "إلكترونيات" : "أحذية",
    isActive: Math.random() > 0.2
  }));
};

const Products: React.FC = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [filterOpen, setFilterOpen] = useState(false);
  
  const mockProducts = generateMockProducts();
  const mockCategories = [
    { id: "clothes", name: "ملابس" },
    { id: "electronics", name: "إلكترونيات" },
    { id: "shoes", name: "أحذية" }
  ];
  
  // Product selection handling
  const handleProductSelect = (productId: string, selected: boolean) => {
    if (selected) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };
  
  // Filter the products based on search and category
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = searchQuery ? 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) :
      true;
    
    const matchesCategory = categoryFilter === "all" || 
      (categoryFilter === "clothes" && product.category === "ملابس") ||
      (categoryFilter === "electronics" && product.category === "إلكترونيات") ||
      (categoryFilter === "shoes" && product.category === "أحذية");
    
    const matchesPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPriceRange;
  });
  
  // Bulk actions
  const handleDeleteSelected = async () => {
    toast.success(`تم حذف ${selectedProducts.length} منتجات`);
    setSelectedProducts([]);
  };
  
  const handleDuplicateSelected = async () => {
    toast.success(`تم نسخ ${selectedProducts.length} منتجات`);
    setSelectedProducts([]);
  };
  
  const handleCategoryChange = async (categoryId: string) => {
    toast.success(`تم تغيير تصنيف ${selectedProducts.length} منتجات`);
    setSelectedProducts([]);
  };
  
  // Currency formatter
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(price);
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">المنتجات</h1>
          <p className="text-muted-foreground">
            إدارة منتجات متجرك وتتبع المخزون
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("وظيفة الاستيراد قيد التطوير")}>
            <Upload className="h-4 w-4 ml-2" />
            استيراد
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("وظيفة التصدير قيد التطوير")}>
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
          <Button size="sm" onClick={() => toast.info("وظيفة إضافة منتج قيد التطوير")}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة منتج
          </Button>
        </div>
      </div>
      
      {/* Products List Card */}
      <Card>
        {/* Card Header with search and view toggle */}
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>قائمة المنتجات</CardTitle>
            
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث عن منتج..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setFilterOpen(!filterOpen)}
                className={filterOpen ? "bg-muted" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
              
              <div className="border rounded-md flex">
                <Button 
                  variant={view === "grid" ? "default" : "ghost"} 
                  size="icon"
                  onClick={() => setView("grid")}
                  className="rounded-none rounded-r-md"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={view === "list" ? "default" : "ghost"} 
                  size="icon"
                  onClick={() => setView("list")}
                  className="rounded-none rounded-l-md"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters slide down */}
          {filterOpen && (
            <div className="mb-6 bg-muted/50 p-4 rounded-md border">
              <ProductsFilters
                categories={mockCategories}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
              />
            </div>
          )}
          
          {/* Bulk actions */}
          {selectedProducts.length > 0 && (
            <ProductsBulkActions
              selectedCount={selectedProducts.length}
              onDelete={handleDeleteSelected}
              onDuplicate={handleDuplicateSelected}
              onCategoryChange={handleCategoryChange}
              onClearSelection={() => setSelectedProducts([])}
              categories={mockCategories}
            />
          )}
          
          {/* Products grid/list */}
          {filteredProducts.length === 0 ? (
            <ProductsEmptyState onAdd={() => toast.info("وظيفة إضافة منتج قيد التطوير")} />
          ) : (
            view === "grid" ? (
              <ProductsGrid
                products={filteredProducts}
                formatCurrency={formatCurrency}
              />
            ) : (
              <ProductsList
                products={filteredProducts}
                formatCurrency={formatCurrency}
                selectedProducts={selectedProducts}
                onSelectProduct={handleProductSelect}
              />
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
