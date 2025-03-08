
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

/**
 * Toast usage with Sonner:
 * 
 * Basic usage:
 * toast("Title message")
 * 
 * With description:
 * toast("Title message", { description: "More details here" })
 * 
 * Error toast (red background):
 * toast("Error title", { 
 *   description: "Error details",
 *   style: { backgroundColor: 'red', color: 'white' }
 * })
 * 
 * Success toast:
 * toast("Success title", { description: "Success details" })
 * 
 * Do NOT use the 'variant' property as it's not supported by Sonner.
 * Use 'style' instead to customize the toast appearance.
 */
