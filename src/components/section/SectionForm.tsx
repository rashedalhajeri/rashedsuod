
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface SectionFormProps {
  newSection: string;
  setNewSection: (name: string) => void;
  newSectionType: string;
  setNewSectionType: (type: string) => void;
  handleAddSection: () => void;
}

const SectionForm: React.FC<SectionFormProps> = ({
  newSection,
  setNewSection,
  newSectionType,
  setNewSectionType,
  handleAddSection
}) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-medium">إضافة قسم جديد</h3>
      
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
            <SelectItem value="custom">مخصص</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        className="w-full gap-2"
        onClick={handleAddSection}
        disabled={!newSection.trim()}
      >
        <Plus className="h-4 w-4" />
        <span>إضافة القسم</span>
      </Button>
    </div>
  );
};

export default SectionForm;
