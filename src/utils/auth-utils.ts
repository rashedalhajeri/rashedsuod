
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * التحقق مما إذا كان المستخدم هو مشرف
 * @param user كائن المستخدم من Supabase
 * @returns وعد بنتيجة التحقق (صحيح/خطأ)
 */
export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  
  // التحقق من metadata
  if (user.user_metadata?.is_admin === true) {
    return true;
  }
  
  // التحقق من app_metadata
  if (user.app_metadata?.admin === true) {
    return true;
  }
  
  // إذا لم نتمكن من التحقق من metadata، نفترض أن المستخدم ليس مشرفًا
  return false;
};

/**
 * فحص ما إذا كان المستخدم يملك المتجر
 * @param storeId معرف المتجر
 * @returns وعد بنتيجة التحقق (صحيح/خطأ)
 */
export const userOwnsStore = async (storeId: string): Promise<boolean> => {
  if (!storeId) return false;
  
  try {
    const { data, error } = await supabase.rpc('user_owns_store', { store_id: storeId });
    
    if (error) {
      console.error("خطأ في التحقق من ملكية المتجر:", error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error("خطأ في التحقق من ملكية المتجر:", error);
    return false;
  }
};

/**
 * التحقق مما إذا كان للمستخدم صلاحية المشرف
 * @returns وعد بنتيجة التحقق (صحيح/خطأ)
 */
export const checkIsAdmin = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('is_admin');
    
    if (error) {
      console.error("خطأ في التحقق من صلاحية المشرف:", error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error("خطأ في التحقق من صلاحية المشرف:", error);
    return false;
  }
};

/**
 * التحقق مما إذا كان للمستخدم صلاحية المشرف الأعلى
 * @returns وعد بنتيجة التحقق (صحيح/خطأ)
 */
export const checkIsSuperAdmin = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('is_super_admin');
    
    if (error) {
      console.error("خطأ في التحقق من صلاحية المشرف الأعلى:", error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error("خطأ في التحقق من صلاحية المشرف الأعلى:", error);
    return false;
  }
};
