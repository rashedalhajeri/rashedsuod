
import { toast as sonnerToast } from "sonner";

// Re-export the toast function directly
export const toast = sonnerToast;

// Create a compatible hook function that returns the same interface
// that components might expect from shadcn/ui toast
export function useToast() {
  return {
    toast: sonnerToast,
    // Add an empty array to be compatible with shadcn/ui toast implementation
    // which has a toasts state
    toasts: []
  };
}
