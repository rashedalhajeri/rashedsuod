
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Section } from "@/services/section-service";
import { Edit, Trash, ToggleLeft, ToggleRight, BanknoteIcon, ShoppingBag, Sparkles, Percent, Tag, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionItemProps {
  section: Section;
  editingSection: Section | null;
  setEditingSection: (section: Section) => void;
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
  const [showActions, setShowActions] = useState(false);
  
  const isEditing = editingSection?.id === section.id;

  const handleToggleActive = () => {
    setEditingSection({
      ...section,
      is_active: !section.is_active
    });
    
    setTimeout(() => {
      handleUpdateSection();
    }, 0);
  };
  
  const getSectionTypeIcon = () => {
    switch (section.section_type) {
      case 'best_selling': 
        return <BanknoteIcon className="h-5 w-5 text-emerald-500" />;
      case 'new_arrivals': 
        return <ShoppingBag className="h-5 w-5 text-blue-500" />;
      case 'featured': 
        return <Sparkles className="h-5 w-5 text-amber-500" />;
      case 'on_sale': 
        return <Percent className="h-5 w-5 text-rose-500" />;
      case 'category': 
        return <Tag className="h-5 w-5 text-purple-500" />;
      case 'custom': 
        return <LayoutGrid className="h-5 w-5 text-indigo-500" />;
      default: 
        return <LayoutGrid className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getSectionTypeName = () => {
    switch (section.section_type) {
      case 'best_selling': return 'الأكثر مبيعاً';
      case 'new_arrivals': return 'وصل حديثاً';
      case 'featured': return 'منتجات مميزة';
      case 'on_sale': return 'تخفيضات';
      case 'category': return 'فئة محددة';
      case 'custom': return 'منتجات مخصصة';
      default: return 'قسم';
    }
  };
  
  const getSectionTypeColor = () => {
    switch (section.section_type) {
      case 'best_selling': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'new_arrivals': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'featured': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'on_sale': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'category': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'custom': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div 
      className={cn(
        "border rounded-md p-4 transition-all",
        showActions ? "bg-gray-50" : "bg-white",
        section.is_active ? "border-gray-200" : "border-gray-100 opacity-70"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-full", section.is_active ? "bg-primary/10" : "bg-gray-100")}>
            {getSectionTypeIcon()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{section.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span 
                className={cn(
                  "text-xs px-2 py-1 rounded-full border", 
                  getSectionTypeColor()
                )}
              >
                {getSectionTypeName()}
              </span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                section.is_active 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : "bg-gray-50 text-gray-700 border border-gray-200"
              )}>
                {section.is_active ? "نشط" : "غير نشط"}
              </span>
            </div>
          </div>
        </div>
        
        <div className={cn("flex gap-1 transition-opacity", showActions ? "opacity-100" : "opacity-0")}>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleToggleActive}
            className="h-8 w-8"
          >
            {section.is_active ? (
              <ToggleRight className="h-4 w-4 text-green-500" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-gray-500" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setEditingSection(section)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4 text-blue-500" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleDeleteSection(section.id)}
            className="h-8 w-8"
          >
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SectionItem;
