
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryHeaderProps {
  headerTitle: string;
  storeDomain?: string;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ 
  headerTitle, 
  storeDomain 
}) => {
  const navigate = useNavigate();

  const handleNavigateToStore = () => {
    navigate(`/store/${storeDomain}`);
  };

  return (
    <header className="bg-gradient-to-l from-blue-500 to-blue-600 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full -mt-20 -mr-20 blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -ml-16 blur-lg"></div>
      
      <div className="container mx-auto px-4 py-5 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <Link to={`/store/${storeDomain}/cart`} className="block">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
          </Link>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Button 
              variant="ghost" 
              className="text-white bg-white/10 hover:bg-white/20 p-0 h-9 w-9 rounded-full"
              onClick={handleNavigateToStore}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            <Link to={`/store/${storeDomain}/login`} className="block">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </Link>
          </div>
        </div>
        
        <div className="text-center py-3">
          <h1 className="text-2xl font-bold text-white tracking-wide mb-1">{headerTitle}</h1>
          <div className="h-1 w-20 bg-white/30 rounded-full mx-auto"></div>
        </div>
      </div>
      
      <div className="h-5 bg-gray-50 rounded-t-3xl -mb-1"></div>
    </header>
  );
};

export default CategoryHeader;
