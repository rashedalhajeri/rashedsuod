
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StoreFilterContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  handleCategoryChange: (category: string) => void;
  handleSectionChange: (section: string) => void;
  handleClearSearch: () => void;
  sections: string[];
}

const StoreFilterContext = createContext<StoreFilterContextType | undefined>(undefined);

export const useStoreFilter = () => {
  const context = useContext(StoreFilterContext);
  if (!context) {
    throw new Error('useStoreFilter must be used within a StoreFilterProvider');
  }
  return context;
};

interface StoreFilterProviderProps {
  children: ReactNode;
}

export const StoreFilterProvider: React.FC<StoreFilterProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeSection, setActiveSection] = useState("جميع المنتجات");

  // الأقسام الثابتة في المتجر
  const sections = ["جميع المنتجات", "الأكثر مبيعاً", "العروض", "الجديد"];

  const handleCategoryChange = (category: string) => {
    // إذا كانت الفئة المختارة من الأقسام
    if (sections.includes(category)) {
      setActiveSection(category);
      setActiveCategory("");
    } else {
      // إذا كانت فئة حقيقية
      setActiveCategory(category);
      setActiveSection("");
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setActiveCategory("");
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const value = {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    activeSection,
    setActiveSection,
    handleCategoryChange,
    handleSectionChange,
    handleClearSearch,
    sections
  };

  return (
    <StoreFilterContext.Provider value={value}>
      {children}
    </StoreFilterContext.Provider>
  );
};
