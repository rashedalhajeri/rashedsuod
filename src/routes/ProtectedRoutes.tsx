
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { secureRetrieve, secureStore, secureRemove } from "@/lib/encryption";

export const ProtectedRoute = ({ children, redirectIfStore = false }: { children: React.ReactNode, redirectIfStore?: boolean }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasStore, setHasStore] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = Navigate;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsVerifying(true);
        
        const userId = await secureRetrieve('user-id');
        
        if (userId) {
          const { data: sessionData } = await supabase.auth.getSession();
          
          if (sessionData.session && sessionData.session.user.id === userId) {
            setIsAuthenticated(true);
            
            const { count, error: storeError } = await supabase
              .from('stores')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', userId);
            
            if (storeError) throw storeError;
            
            setHasStore(count ? count > 0 : false);
          } else {
            secureRemove('user-id');
            setIsAuthenticated(false);
            setHasStore(false);
          }
        } else {
          const { data: sessionData } = await supabase.auth.getSession();
          
          if (sessionData.session) {
            await secureStore('user-id', sessionData.session.user.id);
            setIsAuthenticated(true);
            
            const { count, error: storeError } = await supabase
              .from('stores')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', sessionData.session.user.id);
            
            if (storeError) throw storeError;
            
            setHasStore(count ? count > 0 : false);
          } else {
            setIsAuthenticated(false);
            setHasStore(false);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setHasStore(false);
      } finally {
        setIsVerifying(false);
      }
    };
    
    checkAuth();
  }, []);

  if (isVerifying) {
    return <div className="flex h-screen items-center justify-center">جاري التحقق...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  if (hasStore === false && !redirectIfStore) {
    return <Navigate to="/create-store" />;
  }
  
  if (hasStore === true && redirectIfStore) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

export const CreateStoreRoute = ({ children }: { children: React.ReactNode }) => {
  return <ProtectedRoute redirectIfStore={true}>{children}</ProtectedRoute>;
};
