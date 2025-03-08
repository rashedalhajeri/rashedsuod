
import { toast as sonnerToast } from "sonner";
import { useToast as useHookToast } from "@/hooks/use-toast";

// Re-export the toast function directly
export const toast = sonnerToast;

// Re-export the hook from the hooks directory
export const useToast = useHookToast;
