
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Edit, Trash, Save, X } from "lucide-react";

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
  const getSectionTypeName = (type: string) => {
    switch (type) {
      case 'best_selling': return 'الأكثر مبيعاً';
      case 'new_arrivals': return 'وصل حديثاً';
      case 'featured': return 'منتجات مميزة';
      case 'on_sale': return 'تخفيضات';
      case 'custom': return 'مخصص';
      default: return 'غير معروف';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
      {editingSection?.id === section.id ? (
        <div className="flex flex-col w-full gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Input 
              value={editingSection.name}
              onChange={(e) => setEditingSection({...editingSection, name: e.target.value})}
              className="flex-1"
            />
            <Button 
              size="sm" 
              variant="default"
              onClick={handleUpdateSection}
              disabled={!editingSection.name.trim()}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setEditingSection(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="section-type">نوع القسم</Label>
              <Select 
                value={editingSection.section_type}
                onValueChange={(value) => setEditingSection({...editingSection, section_type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع القسم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="best_selling">الأكثر مبيعاً</SelectItem>
                  <SelectItem value="new_arrivals">وصل حديثاً</SelectItem>
                  <SelectItem value="featured">منتجات مميزة</SelectItem>
                  <SelectItem value="on_sale">تخفيضات</SelectItem>
                  <SelectItem value="custom">مخصص</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-end space-x-2 space-x-reverse">
              <Label htmlFor="is-active">تفعيل القسم</Label>
              <Switch 
                id="is-active"
                checked={editingSection.is_active}
                onCheckedChange={(checked) => setEditingSection({...editingSection, is_active: checked})}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
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
              onClick={() => setEditingSection(section)}
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
        </>
      )}
    </div>
  );
};

export default SectionItem;
