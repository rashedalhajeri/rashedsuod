
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Store {
  id: string;
  store_name: string;
  logo_url: string | null;
  description: string | null;
  currency: string;
  phone_number: string | null;
  subscription_plan: string;
}

interface StoreContextType {
  store: Store | null;
  isLoading: boolean;
  error: string | null;
  refreshStore: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStoreData = async () => {
    if (!storeId) {
      setError("معرف المتجر غير متوفر");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: storeError } = await supabase
        .from("stores")
        .select("*")
        .eq("id", storeId)
        .maybeSingle();

      if (storeError) {
        console.error("Error fetching store:", storeError);
        throw storeError;
      }

      if (!data) {
        setError("المتجر غير موجود");
        return;
      }

      setStore(data as Store);
    } catch (err) {
      console.error("Error fetching store data:", err);
      setError("حدث خطأ أثناء تحميل بيانات المتجر");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, [storeId]);

  const value = {
    store,
    isLoading,
    error,
    refreshStore: fetchStoreData
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
