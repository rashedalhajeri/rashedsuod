
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import PasswordInput from "./PasswordInput";

interface RegisterFormProps {
  storeDomain: string | undefined;
  storeData: any;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ storeDomain, storeData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error("الرجاء إكمال جميع الحقول المطلوبة");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }
    
    if (password.length < 6) {
      toast.error("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
      return;
    }
    
    try {
      setLoading(true);
      
      // Register with Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });
      
      if (error) throw error;
      
      // Store customer record for this store
      if (data.user) {
        const { error: customerError } = await supabase
          .from('customers')
          .insert([
            {
              user_id: data.user.id,
              store_id: storeData.id,
              name: name,
              email: email,
              is_active: true
            }
          ]);
          
        if (customerError) {
          console.error("Error creating customer record:", customerError);
        }
      }
      
      toast.success("تم إنشاء الحساب بنجاح!");
      // If email confirmation is enabled, show message
      if (data?.user?.identities?.length === 0) {
        toast.info("تم إرسال رابط التأكيد إلى بريدك الإلكتروني");
        navigate(`/store/${storeDomain}/login`);
      } else {
        // If not, redirect to store home
        navigate(`/store/${storeDomain}`);
      }
      
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast.error(error.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">الاسم الكامل</Label>
        <div className="relative">
          <Input
            id="name"
            placeholder="الاسم الكامل"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pr-10"
            required
          />
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pr-10"
            required
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <PasswordInput
        label="كلمة المرور"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        hint="يجب أن تكون كلمة المرور 6 أحرف على الأقل"
      />
      
      <PasswordInput
        label="تأكيد كلمة المرور"
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        icon={<Lock className="h-5 w-5" />}
      />
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري إنشاء الحساب...
          </>
        ) : (
          "إنشاء حساب"
        )}
      </Button>
      
      <div className="text-center text-sm">
        <span className="text-gray-500">
          لديك حساب بالفعل؟{" "}
          <Link to={`/store/${storeDomain}/login`} className="text-primary hover:underline font-medium">
            تسجيل الدخول
          </Link>
        </span>
      </div>
    </form>
  );
};

export default RegisterForm;
