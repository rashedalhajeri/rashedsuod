
import React from "react";
import { Button } from "@/components/ui/button";

interface CreateStorePromptProps {
  onCreateStore: () => void;
}

const CreateStorePrompt: React.FC<CreateStorePromptProps> = ({ onCreateStore }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">مرحباً بك في Linok.me</h1>
        <p className="text-gray-600 mb-6 text-center">لم نجد أي متجر مرتبط بحسابك. قم بإنشاء متجرك الآن للبدء!</p>
        <Button onClick={onCreateStore} className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:bg-primary-700">
          إنشاء متجر جديد
        </Button>
      </div>
    </div>
  );
};

export default CreateStorePrompt;
