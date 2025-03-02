
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [domainName, setDomainName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Kuwait is the default country and currency
  const country = "Kuwait";
  const currency = "KWD";
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !storeName || !domainName || !phoneNumber) {
      toast.error("الرجاء تعبئة جميع الحقول المطلوبة");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Register user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            store_name: storeName,
            domain_name: domainName,
            phone_number: phoneNumber,
            country,
            currency
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("تم إنشاء الحساب بنجاح");
      // Redirect or perform additional actions after successful signup
      
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast.error(error.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md" id="signup">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">إنشاء متجر جديد</h2>
      
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">اسم المتجر</label>
          <input
            id="storeName"
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="domainName" className="block text-sm font-medium text-gray-700 mb-1">اسم النطاق</label>
          <div className="flex items-center">
            <input
              id="domainName"
              type="text"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500"
              required
            />
            <span className="bg-gray-100 px-3 py-2 border border-gray-300 border-l-0 rounded-r-md text-gray-500">.linok.me</span>
          </div>
        </div>
        
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
          <div className="flex items-center">
            <span className="bg-gray-100 px-3 py-2 border border-gray-300 border-r-0 rounded-l-md text-gray-500">+965</span>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-r-md focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الدولة والعملة</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={country}
              className="w-1/2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
              disabled
            />
            <input
              type="text"
              value={currency}
              className="w-1/2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
              disabled
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "جاري إنشاء الحساب..." : "إنشاء المتجر"}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          لديك حساب بالفعل؟ <a href="#login" className="text-primary-500 hover:underline">تسجيل الدخول</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
