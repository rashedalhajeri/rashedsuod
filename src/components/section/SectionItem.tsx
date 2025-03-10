
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Section } from "@/services/section-service";
import { Edit, Trash, ToggleLeft, ToggleRight, Crown, ShoppingBag, Star, Percent, Tag, LayoutGrid, GripVertical, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SectionItemProps {
  section: Section;
  editingSection: Section | null;
  setEditingSection: (section: Section | null) => void;
  handleUpdateSection: () => void;
  handleDeleteSection: (id: string) => void;
  dragHandleProps?: any;
}

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  editingSection,
  setEditingSection,
  handleUpdateSection,
  handleDeleteSection,
  dragHandleProps
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  
  const isEditing = editingSection?.id === section.id;

  const handleToggleActive = async () => {
    setIsToggling(true);
    setEditingSection({
      ...section,
      is_active: !section.is_active
    });
    
    // Add small delay to show loading state
    setTimeout(async () => {
      await handleUpdateSection();
      setIsToggling(false);
      
      // Show toast notification
      if (!section.is_active) {
        toast.success(`تم تفعيل قسم "${section.name}" بنجاح`);
      } else {
        toast.success(`تم إيقاف قسم "${section.name}" بنجاح`);
      }
    }, 300);
  };
  
  const getSectionTypeIcon = () => {
    switch (section.section_type) {
      case 'best_selling': 
        return <Crown className="h-4 w-4 text-emerald-500" />;
      case 'new_arrivals': 
        return <ShoppingBag className="h-4 w-4 text-blue-500" />;
      case 'featured': 
        return <Star className="h-4 w-4 text-amber-500" />;
      case 'on_sale': 
        return <Percent className="h-4 w-4 text-rose-500" />;
      case 'category': 
        return <Tag className="h-4 w-4 text-purple-500" />;
      case 'custom': 
        return <LayoutGrid className="h-4 w-4 text-indigo-500" />;
      default: 
        return <LayoutGrid className="h-4 w-4 text-gray-500" />;
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
        "border rounded-md p-4 transition-all flex items-center",
        showActions ? "bg-gray-50" : "bg-white",
        section.is_active ? "border-gray-200" : "border-gray-100 opacity-70"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Drag handle */}
      {dragHandleProps && (
        <div {...dragHandleProps} className="cursor-grab mr-1 text-gray-400 hover:text-gray-600">
          <GripVertical size={16} />
        </div>
      )}
      
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-full", section.is_active ? "bg-primary/10" : "bg-gray-100")}>
            {getSectionTypeIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">{section.name}</h3>
              <span 
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full border", 
                  getSectionTypeColor()
                )}
              >
                {getSectionTypeName()}
              </span>
            </div>
            
            {(section.section_type === 'category' && section.category_id) && (
              <div className="text-xs text-gray-500 mt-1">
                فئة محددة
              </div>
            )}
            
            {(section.section_type === 'custom' && section.product_ids) && (
              <div className="text-xs text-gray-500 mt-1">
                {section.product_ids.length} منتج مخصص
              </div>
            )}
          </div>
        </div>
        
        <div className={cn("flex gap-1 transition-opacity", showActions ? "opacity-100" : "opacity-0")}>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleToggleActive}
            className="h-8 w-8"
            disabled={isToggling}
          >
            {isToggling ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : section.is_active ? (
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
