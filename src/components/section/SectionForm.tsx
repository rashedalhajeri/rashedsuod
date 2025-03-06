
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  newSection: string;
  setNewSection: (name: string) => void;
  newSectionType: string;
  setNewSectionType: (type: string) => void;
  handleAddSection: () => void;
}

const SectionForm: React.FC<SectionFormProps> = ({
  isOpen,
  onClose,
  newSection,
  setNewSection,
  newSectionType,
  setNewSectionType,
  handleAddSection
}) => {
  const handleSubmit = () => {
    handleAddSection();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة قسم جديد</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="section-name">اسم القسم</Label>
            <Input
              id="section-name"
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              placeholder="اسم القسم الجديد..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="section-type">نوع القسم</Label>
            <Select 
              value={newSectionType}
              onValueChange={setNewSectionType}
            >
              <SelectTrigger id="section-type">
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

          {newSectionType === 'category' && (
            <div className="space-y-2">
              <Label htmlFor="category-select">اختر الفئة</Label>
              <Select>
                <SelectTrigger id="category-select">
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

          {newSectionType === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="product-select">اختر المنتجات</Label>
              <div className="border p-2 rounded-md h-24 overflow-y-auto">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input type="checkbox" id="product1" className="rounded" />
                    <Label htmlFor="product1">منتج 1</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input type="checkbox" id="product2" className="rounded" />
                    <Label htmlFor="product2">منتج 2</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input type="checkbox" id="product3" className="rounded" />
                    <Label htmlFor="product3">منتج 3</Label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!newSection.trim()}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة القسم</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SectionForm;
