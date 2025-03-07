
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Grid, List } from "lucide-react";

interface Category {
  id: string;
  name: string;
  sort_order: number;
}

interface SectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  newSection: string;
  setNewSection: (name: string) => void;
  newSectionType: string;
  setNewSectionType: (type: string) => void;
  newCategoryId: string | null;
  setNewCategoryId: (id: string | null) => void;
  newProductIds: string[] | null;
  setNewProductIds: (ids: string[] | null) => void;
  newDisplayStyle: 'grid' | 'list';
  setNewDisplayStyle: (style: 'grid' | 'list') => void;
  handleAddSection: () => void;
  categories: Category[];
}

const SectionForm: React.FC<SectionFormProps> = ({
  isOpen,
  onClose,
  newSection,
  setNewSection,
  newSectionType,
  setNewSectionType,
  newCategoryId,
  setNewCategoryId,
  newProductIds,
  setNewProductIds,
  newDisplayStyle,
  setNewDisplayStyle,
  handleAddSection,
  categories
}) => {
  const handleSubmit = () => {
    handleAddSection();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
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
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="section-type">نوع القسم</Label>
            <Select 
              value={newSectionType}
              onValueChange={(value) => setNewSectionType(value)}
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
              <Select 
                value={newCategoryId || ""}
                onValueChange={(value) => setNewCategoryId(value || null)}
              >
                <SelectTrigger id="category-select">
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length > 0 ? (
                    categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>لا توجد فئات</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {newSectionType === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="product-select">اختر المنتجات</Label>
              <div className="border p-2 rounded-md h-24 overflow-y-auto">
                <p className="text-sm text-muted-foreground text-center py-6">
                  سيتم إضافة اختيار المنتجات قريباً
                </p>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>عرض المنتجات</Label>
            <div className="flex border rounded-md overflow-hidden">
              <Button 
                type="button" 
                variant={newDisplayStyle === 'grid' ? "default" : "ghost"} 
                className="flex-1 rounded-none border-r"
                onClick={() => setNewDisplayStyle('grid')}
              >
                <Grid className="h-4 w-4 mr-2" />
                شبكة
              </Button>
              <Button 
                type="button" 
                variant={newDisplayStyle === 'list' ? "default" : "ghost"} 
                className="flex-1 rounded-none"
                onClick={() => setNewDisplayStyle('list')}
              >
                <List className="h-4 w-4 mr-2" />
                قائمة
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!newSection.trim()}
          >
            إضافة القسم
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SectionForm;
