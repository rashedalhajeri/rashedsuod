
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStoreData } from "@/hooks/use-store-data";
import { Plus, Grid, List } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// منتجات تجريبية
const dummyProducts = [
  { id: "1", name: "قميص أزرق", price: 120, status: "متاح", stock: 25, image: "/placeholder.svg" },
  { id: "2", name: "بنطلون جينز", price: 150, status: "متاح", stock: 18, image: "/placeholder.svg" },
  { id: "3", name: "حذاء رياضي", price: 220, status: "منخفض المخزون", stock: 5, image: "/placeholder.svg" },
  { id: "4", name: "تيشيرت أبيض", price: 90, status: "متاح", stock: 30, image: "/placeholder.svg" },
  { id: "5", name: "جاكيت شتوي", price: 320, status: "متاح", stock: 12, image: "/placeholder.svg" },
  { id: "6", name: "حقيبة جلد", price: 180, status: "مسودة", stock: 0, image: "/placeholder.svg" },
];

// فئات المنتجات التجريبية
const dummyCategories = [
  { id: "1", name: "ملابس رجالية" },
  { id: "2", name: "ملابس نسائية" },
  { id: "3", name: "أحذية" },
  { id: "4", name: "إكسسوارات" },
];

const Products = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { data: storeData } = useStoreData();
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const handleProductSelection = (productId: string, selected: boolean) => {
    if (selected) {
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      setSelectedProducts((prev) => prev.filter(id => id !== productId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedProducts(dummyProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
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
        // مكون عمليات المنتجات المتعددة
        <div className="bg-secondary/20 p-4 rounded-lg flex items-center justify-between">
          <span>تم تحديد {selectedProducts.length} منتج</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedProducts([])}>
              إلغاء
            </Button>
            <Button variant="destructive" size="sm">
              حذف المحدد
            </Button>
          </div>
        </div>
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
          {/* مكون فلاتر المنتجات */}
          <Card>
            <CardHeader>
              <CardTitle>الفلاتر</CardTitle>
              <CardDescription>تصفية المنتجات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">الفئة</h3>
                <div className="space-y-2">
                  {dummyCategories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        className="mr-2"
                        checked={categoryFilter === category.id}
                        onChange={() => setCategoryFilter(categoryFilter === category.id ? "" : category.id)}
                      />
                      <label htmlFor={`category-${category.id}`} className="text-sm">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">نطاق السعر</h3>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">{priceRange[0]} ريال</span>
                    <span className="text-sm">{priceRange[1]} ريال</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => {
                setCategoryFilter("");
                setPriceRange([0, 1000]);
              }}>
                إعادة ضبط الفلاتر
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-4 space-y-4">
          {viewMode === 'grid' ? (
            // عرض الشبكة
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dummyProducts.map(product => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <input
                        type="checkbox"
                        className="h-5 w-5"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                      />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{product.name}</h3>
                      <Badge>{product.status}</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold">{product.price} ريال</span>
                      <span className="text-sm text-muted-foreground">المخزون: {product.stock}</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="w-full">عرض</Button>
                      <Button size="sm" className="w-full">تعديل</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // عرض القائمة
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-right">
                        <input
                          type="checkbox"
                          checked={selectedProducts.length === dummyProducts.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                      </th>
                      <th className="p-3 text-right">المنتج</th>
                      <th className="p-3 text-right">السعر</th>
                      <th className="p-3 text-right">الحالة</th>
                      <th className="p-3 text-right">المخزون</th>
                      <th className="p-3 text-right">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyProducts.map(product => (
                      <tr key={product.id} className="border-b">
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td className="p-3">{product.price} ريال</td>
                        <td className="p-3">
                          <Badge>{product.status}</Badge>
                        </td>
                        <td className="p-3">{product.stock}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">عرض</Button>
                            <Button size="sm">تعديل</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
