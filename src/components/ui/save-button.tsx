
import React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  isSaving: boolean;
  onClick: () => Promise<void>;
  className?: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({ isSaving, onClick, className }) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={isSaving}
      className={cn("flex items-center gap-2", className)}
    >
      <Save className="h-4 w-4" />
      {isSaving ? "جاري الحفظ..." : "حفظ"}
    </Button>
  );
};

export default SaveButton;
