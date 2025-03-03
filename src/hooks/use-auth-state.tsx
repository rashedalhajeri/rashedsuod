
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useAuthState = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          throw error;
        }
        
        if (data && data.session) {
          setAuthenticated(true);
          setUserId(data.session.user.id);
        } else {
          setAuthenticated(false);
          setUserId(null);
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        toast.error("حدث خطأ أثناء التحقق من حالة تسجيل الدخول");
        setAuthenticated(false);
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setAuthenticated(true);
        setUserId(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setAuthenticated(false);
        setUserId(null);
        navigate("/auth");
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);
  
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("تم تسجيل الخروج بنجاح");
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    } finally {
      setLoading(false);
    }
  };
  
  return { loading, authenticated, userId, signOut };
};
