
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchUserStoreId } from "@/services/category-service";
import { 
  fetchSections, 
  addSection, 
  updateSection, 
  deleteSection, 
  Section 
} from "@/services/section-service";

export const useSections = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [newSection, setNewSection] = useState("");
  const [newSectionType, setNewSectionType] = useState("best_selling");
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
        
        setSections(data);
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
        true
      );
      
      if (error) throw error;
      if (data) {
        setSections([...sections, data]);
        setNewSection("");
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

  return {
    sections,
    loading,
    storeId,
    newSection,
    setNewSection,
    newSectionType,
    setNewSectionType,
    editingSection,
    setEditingSection,
    handleAddSection,
    handleUpdateSection,
    handleDeleteSection
  };
};
