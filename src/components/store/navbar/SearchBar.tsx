
import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

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
  productNames = ["قميص رجالي", "عطر فاخر", "ساعة يد", "حذاء رياضي", "حقيبة جلدية", "نظارة شمسية"]
}) => {
  const [placeholderText, setPlaceholderText] = useState("أبحث عن...");
  const [productIndex, setProductIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Typewriter effect for placeholder
  useEffect(() => {
    if (!isPaused) {
      const typingSpeed = isDeleting ? 50 : 120;
      const pauseTime = isDeleting ? 500 : 2000;
      const currentProductName = productNames[productIndex];
      
      if (isDeleting) {
        // Deleting text
        if (charIndex > 0) {
          const timeoutId = setTimeout(() => {
            setPlaceholderText("أبحث عن " + currentProductName.substring(0, charIndex - 1));
            setCharIndex(charIndex - 1);
          }, typingSpeed);
          return () => clearTimeout(timeoutId);
        } else {
          // Finished deleting
          setIsDeleting(false);
          const nextIndex = (productIndex + 1) % productNames.length;
          setProductIndex(nextIndex);
          const timeoutId = setTimeout(() => {
            setPlaceholderText("أبحث عن ");
          }, pauseTime);
          return () => clearTimeout(timeoutId);
        }
      } else {
        // Typing text
        if (charIndex < currentProductName.length) {
          const timeoutId = setTimeout(() => {
            setPlaceholderText("أبحث عن " + currentProductName.substring(0, charIndex + 1));
            setCharIndex(charIndex + 1);
          }, typingSpeed);
          return () => clearTimeout(timeoutId);
        } else {
          // Finished typing
          const timeoutId = setTimeout(() => {
            setIsDeleting(true);
          }, pauseTime);
          return () => clearTimeout(timeoutId);
        }
      }
    }
  }, [charIndex, isDeleting, productIndex, productNames, isPaused]);

  const handleFocus = () => {
    setIsPaused(true);
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!searchQuery) {
      setIsPaused(false);
      setIsFocused(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative w-full max-w-full">
      <div className={`relative w-full h-14 sm:h-14 rounded-full overflow-hidden bg-white shadow-md border border-gray-100/50 transition-all ${isFocused ? 'ring-2 ring-blue-300 shadow-lg' : 'hover:shadow-lg'}`}>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="h-5 w-5 sm:h-5 sm:w-5" />
        </div>
        {searchQuery && (
          <button 
            type="button"
            onClick={clearSearch}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <input 
          ref={inputRef}
          type="search" 
          placeholder={placeholderText} 
          className="w-full h-full bg-transparent border-0 text-gray-700 placeholder-gray-400 pr-14 pl-12 py-3 rounded-full text-sm sm:text-base focus:outline-none focus:ring-0 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          dir="rtl"
        />
      </div>
    </form>
  );
};

export default SearchBar;
