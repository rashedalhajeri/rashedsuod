
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Edit, Trash, Save, X, List, Grid } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Section {
  id: string;
  name: string;
  sort_order: number;
  section_type: string;
  is_active: boolean;
}

interface SectionItemProps {
  section: Section;
  editingSection: Section | null;
  setEditingSection: (section: Section | null) => void;
  handleUpdateSection: () => void;
  handleDeleteSection: (id: string) => void;
}

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  editingSection,
  setEditingSection,
  handleUpdateSection,
  handleDeleteSection
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const getSectionTypeName = (type: string) => {
    switch (type) {
      case 'best_selling': return 'الأكثر مبيعاً';
      case 'new_arrivals': return 'وصل حديثاً';
      case 'featured': return 'منتجات مميزة';
      case 'on_sale': return 'تخفيضات';
      case 'category': return 'فئة محددة';
      case 'custom': return 'مخصص';
      default: return 'غير معروف';
    }
  };

  const handleSaveChanges = () => {
    handleUpdateSection();
    setIsDialogOpen(false);
  };

  const openEditDialog = () => {
    setEditingSection(section);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setEditingSection(null);
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
        <div className="flex flex-col">
          <span className="text-lg font-medium">{section.name}</span>
          <div className="flex items-center mt-1">
            <span className="text-sm text-muted-foreground">
              {getSectionTypeName(section.section_type)}
            </span>
            <span className={`ms-2 px-2 py-0.5 rounded-full text-xs ${section.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {section.is_active ? 'مفعل' : 'غير مفعل'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={openEditDialog}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            className="text-red-500 hover:text-red-700"
            onClick={() => handleDeleteSection(section.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {editingSection && editingSection.id === section.id && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>تعديل القسم</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-section-name">اسم القسم</Label>
                <Input 
                  id="edit-section-name"
                  value={editingSection.name}
                  onChange={(e) => setEditingSection({...editingSection, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-section-type">نوع القسم</Label>
                <Select 
                  value={editingSection.section_type}
                  onValueChange={(value) => setEditingSection({...editingSection, section_type: value})}
                >
                  <SelectTrigger id="edit-section-type">
                    <SelectValue placeholder="اختر نوع القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="best_selling">الأكثر مبيعاً</SelectItem>
                    <SelectItem value="new_arrivals">وصل حديثاً</SelectItem>
                    <SelectItem value="featured">منتجات مميزة</SelectItem>
                    <SelectItem value="on_sale">تخفيضات</SelectItem>
                    <SelectItem value="category">فئة محددة</SelectItem>
                    <SelectItem value="custom">مخصص</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editingSection.section_type === 'category' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-category-select">اختر الفئة</Label>
                  <Select>
                    <SelectTrigger id="edit-category-select">
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل الفئات</SelectItem>
                      <SelectItem value="category1">فئة 1</SelectItem>
                      <SelectItem value="category2">فئة 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {editingSection.section_type === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-product-select">اختر المنتجات</Label>
                  <div className="border p-2 rounded-md h-24 overflow-y-auto">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <input type="checkbox" id="edit-product1" className="rounded" />
                        <Label htmlFor="edit-product1">منتج 1</Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <input type="checkbox" id="edit-product2" className="rounded" />
                        <Label htmlFor="edit-product2">منتج 2</Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <input type="checkbox" id="edit-product3" className="rounded" />
                        <Label htmlFor="edit-product3">منتج 3</Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-end space-x-2 space-x-reverse">
                <Label htmlFor="is-active">تفعيل القسم</Label>
                <Switch 
                  id="is-active"
                  checked={editingSection.is_active}
                  onCheckedChange={(checked) => setEditingSection({...editingSection, is_active: checked})}
                />
              </div>

              <div className="space-y-2">
                <Label>عرض المنتجات</Label>
                <div className="flex border rounded-md overflow-hidden">
                  <Button type="button" variant="ghost" className="flex-1 rounded-none border-r">
                    <Grid className="h-4 w-4 mr-2" />
                    شبكة
                  </Button>
                  <Button type="button" variant="ghost" className="flex-1 rounded-none">
                    <List className="h-4 w-4 mr-2" />
                    قائمة
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                إلغاء
              </Button>
              <Button 
                onClick={handleSaveChanges}
                disabled={!editingSection.name.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default SectionItem;
