
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchUserStoreId } from "@/services/category-service";
import { 
  fetchSections, 
  addSection, 
  updateSection, 
  deleteSection,
  updateSectionOrder,
  Section 
} from "@/services/section-service";

export const useSections = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [newSection, setNewSection] = useState("");
  const [newSectionType, setNewSectionType] = useState("best_selling");
  const [newCategoryId, setNewCategoryId] = useState<string | null>(null);
  const [newProductIds, setNewProductIds] = useState<string[] | null>(null);
  const [newDisplayStyle, setNewDisplayStyle] = useState<'grid' | 'list'>('grid');
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  useEffect(() => {
    const initializeSections = async () => {
      try {
        setLoading(true);
        
        // Get current user's store
        const userStoreId = await fetchUserStoreId();
        if (!userStoreId) {
          setLoading(false);
          return;
        }
        
        setStoreId(userStoreId);
        
        // Fetch sections
        const { data, error } = await fetchSections(userStoreId);
        if (error) throw error;
        
        setSections(data as Section[]);
      } catch (err: any) {
        console.error("Error fetching store and sections:", err);
        toast.error("حدث خطأ أثناء تحميل الأقسام");
      } finally {
        setLoading(false);
      }
    };
    
    initializeSections();
  }, []);

  const handleAddSection = async () => {
    if (!newSection.trim() || !storeId) return;
    
    try {
      const nextOrder = sections.length > 0 
        ? Math.max(...sections.map(c => c.sort_order)) + 1 
        : 0;
      
      const { data, error } = await addSection(
        newSection, 
        newSectionType, 
        storeId, 
        nextOrder, 
        true,
        newCategoryId,
        newProductIds,
        newDisplayStyle
      );
      
      if (error) throw error;
      if (data) {
        setSections([...sections, data as Section]);
        setNewSection("");
        setNewSectionType("best_selling");
        setNewCategoryId(null);
        setNewProductIds(null);
        setNewDisplayStyle('grid');
        toast.success("تم إضافة القسم بنجاح");
      }
    } catch (err: any) {
      console.error("Error adding section:", err);
      toast.error("حدث خطأ أثناء إضافة القسم");
    }
  };
  
  const handleUpdateSection = async () => {
    if (!editingSection || !storeId) return;
    
    try {
      const { error } = await updateSection(editingSection, storeId);
      
      if (error) throw error;
      
      setSections(sections.map(s => 
        s.id === editingSection.id ? editingSection : s
      ));
      
      setEditingSection(null);
      toast.success("تم تعديل القسم بنجاح");
    } catch (err: any) {
      console.error("Error updating section:", err);
      toast.error("حدث خطأ أثناء تعديل القسم");
    }
  };
  
  const handleDeleteSection = async (sectionId: string) => {
    if (!storeId) return;
    
    try {
      const { error } = await deleteSection(sectionId, storeId);
      
      if (error) throw error;
      
      setSections(sections.filter(s => s.id !== sectionId));
      toast.success("تم حذف القسم بنجاح");
    } catch (err: any) {
      console.error("Error deleting section:", err);
      toast.error("حدث خطأ أثناء حذف القسم");
    }
  };

  const handleReorderSections = async (reorderedSections: Section[]) => {
    if (!storeId) return;
    
    try {
      // First update the UI immediately for better UX
      setSections(reorderedSections);
      
      // Then update in the backend
      const { error } = await updateSectionOrder(reorderedSections, storeId);
      
      if (error) throw error;
      
      toast.success("تم تغيير ترتيب الأقسام بنجاح");
    } catch (err: any) {
      console.error("Error reordering sections:", err);
      toast.error("حدث خطأ أثناء تغيير ترتيب الأقسام");
      
      // Refresh the sections from the server on error
      const { data } = await fetchSections(storeId);
      if (data) {
        setSections(data as Section[]);
      }
    }
  };

  return {
    sections,
    loading,
    storeId,
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
    editingSection,
    setEditingSection,
    handleAddSection,
    handleUpdateSection,
    handleDeleteSection,
    handleReorderSections
  };
};
