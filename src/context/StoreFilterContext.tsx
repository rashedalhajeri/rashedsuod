
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
  const [activeSection, setActiveSection] = useState("");

  const handleCategoryChange = (category: string) => {
    // إذا تم النقر على نفس الفئة مرة أخرى، قم بإلغاء تحديدها
    if (category === activeCategory) {
      setActiveCategory("");
    } else {
      setActiveCategory(category);
    }
  };

  const handleSectionChange = (section: string) => {
    // إذا تم النقر على نفس القسم مرة أخرى، قم بإلغاء تحديده
    if (section === activeSection) {
      setActiveSection("");
    } else {
      setActiveSection(section);
    }
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
    handleClearSearch
  };

  return (
    <StoreFilterContext.Provider value={value}>
      {children}
    </StoreFilterContext.Provider>
  );
};
