
import { useParams } from "react-router-dom";
import { normalizeStoreDomain } from "@/utils/url-helpers";

/**
 * Hook to consistently handle store domain parameter across the application
 */
export function useStoreDomain() {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  
  // Always normalize the domain for consistency
  const normalizedDomain = normalizeStoreDomain(storeDomain || '');
  
  // Debug domain information
  console.log("useStoreDomain - Raw domain from params:", storeDomain);
  console.log("useStoreDomain - Normalized domain:", normalizedDomain);
  
  // Check if we have a valid domain
  const isValidDomain = Boolean(normalizedDomain);
  
  return {
    rawDomain: storeDomain,
    domain: normalizedDomain,
    isValidDomain
  };
}
