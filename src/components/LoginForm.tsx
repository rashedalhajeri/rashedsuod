
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("تم تسجيل الدخول بنجاح");
      // Redirect or perform additional actions after successful login
      
    } catch (error: any) {
      console.error("Error logging in:", error);
      toast.error(error.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md" id="login">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">تسجيل الدخول</h2>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-700">
              تذكرني
            </label>
          </div>
          
          <a href="#forgot-password" className="text-sm text-primary-500 hover:underline">
            نسيت كلمة المرور؟
          </a>
        </div>
        
        <button
          type="submit"
          className="w-full btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          ليس لديك حساب؟ <a href="#signup" className="text-primary-500 hover:underline">إنشاء حساب جديد</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
