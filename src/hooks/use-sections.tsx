import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  fetchUserStoreId, 
  fetchSections, 
  addSection, 
  updateSection, 
  deleteSection, 
  Section
} from "@/services/section-service";

export const useSections = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSection, setNewSection] = useState("");
  const [newSectionType, setNewSectionType] = useState("best_selling");
  const [newCategoryId, setNewCategoryId] = useState<string | null>(null);
  const [newProductIds, setNewProductIds] = useState<string[] | null>(null);
  const [newDisplayStyle, setNewDisplayStyle] = useState<'grid' | 'list'>('grid');
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSections = async () => {
      try {
        setLoading(true);
        setError(null);
        
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
        setError("حدث خطأ أثناء تحميل الأقسام");
        toast.error("حدث خطأ أثناء تحميل الأقسام");
      } finally {
        setLoading(false);
      }
    };
    
    initializeSections();
  }, []);

  const handleAddSection = async (): Promise<void> => {
    if (!newSection.trim() || !storeId) {
      toast.error("يرجى إدخال اسم القسم");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const nextOrder = sections.length > 0 
        ? Math.max(...sections.map(c => c.sort_order)) + 1 
        : 0;
      
      console.log("Adding section with values:", {
        name: newSection,
        type: newSectionType,
        storeId,
        order: nextOrder,
        isActive: true,
        displayStyle: newDisplayStyle
      });
      
      const { data, error } = await addSection(
        newSection, 
        newSectionType, 
        storeId, 
        nextOrder, 
        true,
        null,
        null,
        newDisplayStyle
      );
      
      if (error) {
        console.error("Error adding section:", error);
        throw error;
      }
      
      if (data) {
        setSections([...sections, data as Section]);
        setNewSection("");
        setNewSectionType("best_selling");
        setNewDisplayStyle('grid');
        toast.success("تم إضافة القسم بنجاح");
      }
    } catch (err: any) {
      console.error("Error adding section:", err);
      setError(err.message || "حدث خطأ أثناء إضافة القسم");
      toast.error("حدث خطأ أثناء إضافة القسم. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateSection = async () => {
    if (!editingSection || !storeId) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const { error } = await updateSection(editingSection, storeId);
      
      if (error) throw error;
      
      setSections(sections.map(s => 
        s.id === editingSection.id ? editingSection : s
      ));
      
      setEditingSection(null);
      toast.success("تم تعديل القسم بنجاح");
    } catch (err: any) {
      console.error("Error updating section:", err);
      setError(err.message || "حدث خطأ أثناء تعديل القسم");
      toast.error("حدث خطأ أثناء تعديل القسم");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteSection = async (sectionId: string): Promise<void> => {
    if (!sections[0]?.store_id) return Promise.reject("No store ID");
    
    try {
      const { error } = await deleteSection(sectionId, sections[0].store_id);
      
      if (error) throw error;
      
      setSections(sections.filter(s => s.id !== sectionId));
      return Promise.resolve();
    } catch (err: any) {
      console.error("Error deleting section:", err);
      toast.error("حدث خطأ أثناء حذف القسم");
      return Promise.reject(err);
    }
  };
  
  const handleReorderSections = async (reorderedSections: Section[]) => {
    if (!storeId) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // First update the UI immediately for better UX
      setSections(reorderedSections);
      
      // Then update in the backend
      const { error } = await updateSectionOrder(reorderedSections, storeId);
      
      if (error) throw error;
      
      toast.success("تم تغيير ترتيب الأقسام بنجاح");
    } catch (err: any) {
      console.error("Error reordering sections:", err);
      setError(err.message || "حدث خطأ أثناء تغيير ترتيب الأقسام");
      toast.error("حدث خطأ أثناء تغيير ترتيب الأقسام");
      
      // Refresh the sections from the server on error
      const { data } = await fetchSections(storeId);
      if (data) {
        setSections(data as Section[]);
      }
    } finally {
      setIsSubmitting(false);
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
    isSubmitting,
    error,
    handleAddSection,
    handleUpdateSection,
    handleDeleteSection,
    handleReorderSections
  };
};
