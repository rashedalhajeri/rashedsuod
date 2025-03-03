
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchIcon, PlusIcon, FolderIcon, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// نوع البيانات للفئات
interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

// بيانات وهمية للفئات (سيتم استبدالها بالبيانات الحقيقية)
const dummyCategories: Category[] = [
  {
    id: "1",
    name: "إلكترونيات",
    description: "أجهزة إلكترونية وتقنية",
    productCount: 12,
  },
  {
    id: "2",
    name: "ملابس",
    description: "ملابس رجالية ونسائية",
    productCount: 24,
  },
  {
    id: "3",
    name: "أحذية",
    description: "أحذية رجالية ونسائية",
    productCount: 8,
  },
  {
    id: "4",
    name: "اكسسوارات",
    description: "اكسسوارات متنوعة",
    productCount: 15,
  },
  {
    id: "5",
    name: "منزل ومطبخ",
    description: "منتجات منزلية ومطبخية",
    productCount: 18,
  },
];

const CategoryEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted rounded-full p-3">
        <FolderIcon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-semibold">لم يتم العثور على فئات</h3>
      <p className="text-muted-foreground text-sm mt-1 max-w-sm">
        لم يتم العثور على فئات مطابقة لعملية البحث. قم بإنشاء فئة جديدة أو تجربة مصطلح بحث آخر.
      </p>
      <Button className="mt-4">
        <PlusIcon className="h-4 w-4 mr-1" />
        إنشاء فئة جديدة
      </Button>
    </div>
  );
};

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogType, setDialogType] = useState<"add" | "edit">("add");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  // تصفية الفئات حسب البحث
  const filteredCategories = dummyCategories.filter((category) => {
    return (
      searchQuery === "" ||
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const resetForm = () => {
    setCategoryName("");
    setCategoryDescription("");
    setCurrentCategory(null);
  };

  const handleEditCategory = (category: Category) => {
    setDialogType("edit");
    setCurrentCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description);
    setIsDialogOpen(true);
  };

  const handleAddCategory = () => {
    setDialogType("add");
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!categoryName.trim()) {
      toast.error("يرجى إدخال اسم الفئة");
      return;
    }

    if (dialogType === "add") {
      toast.success("تم إضافة الفئة بنجاح");
    } else {
      toast.success("تم تحديث الفئة بنجاح");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">الفئات</h1>
          <p className="text-muted-foreground mt-1">إدارة فئات منتجات متجرك</p>
        </div>
        <Button onClick={handleAddCategory}>
          <PlusIcon className="mr-2 h-4 w-4" />
          إضافة فئة
        </Button>
      </div>

      <div className="flex justify-between gap-4">
        <div className="relative w-full max-w-md">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث في الفئات..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الفئات</CardTitle>
          <CardDescription>
            {filteredCategories.length} فئة - قم بتنظيم منتجاتك حسب الفئات
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-24rem)] w-full">
            {filteredCategories.length > 0 ? (
              <div className="space-y-0.5">
                {filteredCategories.map((category) => (
                  <React.Fragment key={category.id}>
                    <div className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <FolderIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {category.productCount} منتج
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditCategory(category)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              تعديل
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <Separator />
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <CategoryEmptyState />
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "add" ? "إضافة فئة جديدة" : "تعديل الفئة"}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "add"
                ? "قم بإضافة فئة جديدة لتنظيم منتجاتك"
                : "قم بتعديل معلومات الفئة"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">اسم الفئة</Label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="أدخل اسم الفئة"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">وصف الفئة</Label>
              <Input
                id="description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="أدخل وصف الفئة"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveCategory}>
              {dialogType === "add" ? "إضافة" : "تحديث"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
