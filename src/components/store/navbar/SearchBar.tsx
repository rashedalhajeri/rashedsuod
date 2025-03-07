
import React, { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  productNames?: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  productNames = [],
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  // For the animated placeholder
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  
  useEffect(() => {
    if (!productNames.length) return;
    
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % productNames.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [productNames]);
  
  const placeholder = productNames.length 
    ? `ابحث عن "${productNames[placeholderIndex]}"` 
    : "ابحث حسب المتجر أو المنتج";
  
  return (
    <div 
      ref={searchRef}
      className={`relative w-full transition-all duration-300 max-w-3xl mx-auto ${
        isFocused ? 'ring-2 ring-primary ring-opacity-50' : ''
      }`}
    >
      <form 
        onSubmit={handleSearchSubmit}
        className="flex items-center w-full"
      >
        <div 
          className={`relative flex items-center w-full px-4 py-2 bg-white border rounded-full ${
            isFocused 
              ? 'border-primary shadow-sm' 
              : 'border-gray-200'
          }`}
        >
          <Search 
            className="h-5 w-5 text-gray-400 ml-2" 
          />
          
          <motion.input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
            placeholder={placeholder}
            initial={{ width: "100%" }}
            animate={{ width: "100%" }}
            className="w-full bg-transparent border-none focus:outline-none text-right px-2 py-1 placeholder-gray-400 text-base"
            dir="rtl"
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 p-1.5 text-gray-500 hover:text-primary-500 hover:bg-primary-50/50 ml-1"
                >
                  <SlidersHorizontal className="h-full w-full" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>تصفية متقدمة</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </form>
      
      <AnimatePresence>
        {isFocused && productNames.length > 0 && searchQuery === "" && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50 text-right border border-gray-100"
          >
            <div className="p-2">
              <h4 className="text-xs font-medium text-gray-500 mb-2 px-2">اقتراحات البحث</h4>
              <div className="space-y-1">
                {productNames.slice(0, 5).map((name, index) => (
                  <div 
                    key={index}
                    className="px-3 py-1.5 hover:bg-gray-50 rounded-md cursor-pointer text-sm flex items-center justify-end"
                    onClick={() => {
                      setSearchQuery(name);
                      setIsFocused(false);
                      handleSearchSubmit(new Event('submit') as any);
                    }}
                  >
                    <span>{name}</span>
                    <Search className="h-3.5 w-3.5 text-gray-400 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
