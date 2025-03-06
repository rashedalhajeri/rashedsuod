
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

/**
 * Custom hook for accessing authentication context throughout the application
 * @returns Authentication context with session, loading state and signOut function
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

export default useAuth;
