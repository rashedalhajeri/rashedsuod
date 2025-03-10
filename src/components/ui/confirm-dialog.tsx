
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Check, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  confirmButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  className?: string;
  variant?: "delete" | "warning" | "info";
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  confirmButtonProps,
  cancelButtonProps,
  className,
  variant = "delete",
}) => {
  // Create a dedicated handler for confirmation to avoid duplicate calls
  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onConfirm();
    // Do not close the dialog here, let the onConfirm handler control when to close
  };

  // Handle cancel button click
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenChange(false);
  };
  
  // Get appropriate icon based on variant
  const getIcon = () => {
    switch (variant) {
      case "delete":
        return <Trash2 className="h-10 w-10 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-10 w-10 text-amber-500" />;
      case "info":
        return <AlertCircle className="h-10 w-10 text-blue-500" />;
      default:
        return <AlertCircle className="h-10 w-10 text-gray-500" />;
    }
  };
  
  // Get appropriate button styles based on variant
  const getButtonStyles = (): ButtonProps => {
    switch (variant) {
      case "delete":
        return {
          variant: "destructive",
          className: "bg-destructive hover:bg-destructive/90"
        };
      case "warning":
        return {
          className: "bg-amber-500 hover:bg-amber-600 text-white"
        };
      case "info":
        return {
          className: "bg-blue-500 hover:bg-blue-600 text-white"
        };
      default:
        return {
          variant: "default"
        };
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent 
        className={cn(
          "max-w-[450px] bg-background p-0 overflow-hidden rounded-xl",
          className
        )}
      >
        <div className="p-6">
          <AlertDialogHeader className="gap-4 items-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="mx-auto bg-gray-50 p-4 rounded-full"
            >
              {getIcon()}
            </motion.div>
            <AlertDialogTitle className="text-xl font-bold text-center mt-4">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base text-gray-700 dark:text-gray-300">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 p-4 border-t bg-gray-50/80">
          <AlertDialogCancel asChild onClick={handleCancel}>
            <Button
              variant="outline"
              className="w-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 flex items-center justify-center gap-2"
              {...cancelButtonProps}
            >
              <X className="h-4 w-4" />
              {cancelText}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
              onClick={handleConfirm} 
              variant="default" 
              className="w-full flex items-center justify-center gap-2"
              {...getButtonStyles()}
              {...confirmButtonProps}
            >
              {variant === "delete" ? (
                <Trash2 className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
