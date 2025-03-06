
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StoreFilterContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  handleCategoryChange: (category: string) => void;
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

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const value = {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    handleCategoryChange,
    handleClearSearch
  };

  return (
    <StoreFilterContext.Provider value={value}>
      {children}
    </StoreFilterContext.Provider>
  );
};
