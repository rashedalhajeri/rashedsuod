
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tag, PlusCircle, Edit, Trash2, ChevronRight, Box, ArrowUpDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Categories = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categories, setCategories] = useState([
    { id: 1, name: "إلكترونيات", slug: "electronics", count: 15 },
    { id: 2, name: "ملابس", slug: "clothes", count: 24 },
    { id: 3, name: "أحذية", slug: "shoes", count: 12 },
    { id: 4, name: "إكسسوارات", slug: "accessories", count: 8 },
    { id: 5, name: "هواتف", slug: "phones", count: 10 },
  ]);

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">الفئات</h1>
            <p className="text-gray-600">إدارة فئات المنتجات في متجرك</p>
          </div>
          
          <Button 
            className="bg-primary-600 hover:bg-primary-700 flex items-center gap-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusCircle size={16} />
            إضافة فئة جديدة
          </Button>
        </div>

        <Card className="border border-gray-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <CardTitle className="flex items-center">
              <Tag className="inline-block ml-2 h-5 w-5 text-primary-500" />
              فئات المنتجات
            </CardTitle>
            <CardDescription>جميع الفئات المتوفرة في متجرك</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-12 text-sm font-medium text-gray-500 bg-gray-50 p-4 border-b border-gray-100">
                <div className="col-span-1 flex items-center">#</div>
                <div className="col-span-4 flex items-center">
                  الاسم
                  <ArrowUpDown size={14} className="mr-1 opacity-50" />
                </div>
                <div className="col-span-3">رابط الفئة</div>
                <div className="col-span-2">عدد المنتجات</div>
                <div className="col-span-2 text-left">إجراءات</div>
              </div>
              
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className="grid grid-cols-12 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-sm"
                >
                  <div className="col-span-1 flex items-center">{category.id}</div>
                  <div className="col-span-4 font-medium text-gray-800 flex items-center">
                    <div className="bg-primary-50 text-primary-700 h-8 w-8 rounded-md flex items-center justify-center mr-2">
                      <Tag size={14} />
                    </div>
                    {category.name}
                  </div>
                  <div className="col-span-3 text-gray-500">{category.slug}</div>
                  <div className="col-span-2 text-gray-500">{category.count} منتج</div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                      <Edit size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
              
              {categories.length === 0 && (
                <div className="text-center py-12">
                  <Tag className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">لا توجد فئات</h3>
                  <p className="mt-1 text-gray-500">ابدأ بإضافة فئات لمنتجات متجرك.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    إضافة فئة جديدة
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة فئة جديدة</DialogTitle>
            <DialogDescription>
              قم بإضافة فئة جديدة لمنتجات متجرك.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                اسم الفئة
              </Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                رابط الفئة
              </Label>
              <Input id="slug" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                الوصف
              </Label>
              <Input id="description" className="col-span-3" />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button">
              إضافة الفئة
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Categories;
