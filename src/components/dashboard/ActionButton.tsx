
import React from "react";
import { Zap } from "lucide-react";

const ActionButton: React.FC = () => {
  return (
    <div className="fixed bottom-20 left-4 md:bottom-8 z-50">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
        <button className="relative flex items-center justify-center h-12 w-12 bg-white rounded-full shadow-lg border border-primary-100 text-primary-600 hover:bg-primary-50 transition-colors">
          <Zap className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ActionButton;
