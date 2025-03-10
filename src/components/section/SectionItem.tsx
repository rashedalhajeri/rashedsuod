
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Edit, Trash, Save, X, BanknoteIcon, ShoppingBag, Sparkles, Percent, Tag, LayoutGrid } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Section {
  id: string;
  name: string;
  sort_order: number;
  section_type: string;
  is_active: boolean;
  category_id?: string | null;
  product_ids?: string[] | null;
  display_style?: 'grid' | 'list';
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

  const getSectionTypeIcon = (type: string) => {
    switch (type) {
      case 'best_selling': return <BanknoteIcon className="h-4 w-4 text-emerald-500" />;
      case 'new_arrivals': return <ShoppingBag className="h-4 w-4 text-blue-500" />;
      case 'featured': return <Sparkles className="h-4 w-4 text-amber-500" />;
      case 'on_sale': return <Percent className="h-4 w-4 text-rose-500" />;
      case 'category': return <Tag className="h-4 w-4 text-purple-500" />;
      case 'custom': return <LayoutGrid className="h-4 w-4 text-indigo-500" />;
      default: return <LayoutGrid className="h-4 w-4 text-gray-500" />;
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
      <Card className="overflow-hidden border-gray-200 hover:shadow-sm transition-all">
        <div className="flex items-center justify-between p-4 bg-white">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-md ${
              section.is_active ? 'bg-primary/10' : 'bg-gray-100'
            }`}>
              {getSectionTypeIcon(section.section_type)}
            </div>
            <div>
              <div className="text-lg font-medium">{section.name}</div>
              <div className="flex items-center mt-1 gap-2">
                <Badge variant="outline" className="text-xs font-normal bg-gray-50">
                  {getSectionTypeName(section.section_type)}
                </Badge>
                <Badge variant={section.is_active ? "default" : "outline"} className={`text-xs ${
                  section.is_active ? 'bg-green-500' : 'text-gray-500'
                }`}>
                  {section.is_active ? 'مفعل' : 'غير مفعل'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="ghost"
              className="h-8 w-8 rounded-full"
              onClick={openEditDialog}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              className="h-8 w-8 rounded-full text-destructive hover:text-destructive-foreground hover:bg-destructive"
              onClick={() => handleDeleteSection(section.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {editingSection && editingSection.id === section.id && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-background">
            <DialogHeader>
              <DialogTitle className="text-xl">تعديل القسم</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-section-name">اسم القسم</Label>
                <Input 
                  id="edit-section-name"
                  value={editingSection.name}
                  onChange={(e) => setEditingSection({...editingSection, name: e.target.value})}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-section-type">نوع القسم</Label>
                <Select 
                  value={editingSection.section_type}
                  onValueChange={(value) => setEditingSection({...editingSection, section_type: value})}
                >
                  <SelectTrigger id="edit-section-type" className="border-gray-300">
                    <SelectValue placeholder="اختر نوع القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="best_selling">
                      <div className="flex items-center gap-2">
                        <BanknoteIcon className="h-4 w-4 text-emerald-500" />
                        <span>الأكثر مبيعاً</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="new_arrivals">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-blue-500" />
                        <span>وصل حديثاً</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="featured">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <span>منتجات مميزة</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="on_sale">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-rose-500" />
                        <span>تخفيضات</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="category">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-purple-500" />
                        <span>فئة محددة</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="custom">
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4 text-indigo-500" />
                        <span>مخصص</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between space-x-2 space-x-reverse">
                <Label htmlFor="is-active" className="font-medium">تفعيل القسم</Label>
                <Switch 
                  id="is-active"
                  checked={editingSection.is_active}
                  onCheckedChange={(checked) => setEditingSection({...editingSection, is_active: checked})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                إلغاء
              </Button>
              <Button 
                onClick={handleSaveChanges}
                disabled={!editingSection.name.trim()}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4" />
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
