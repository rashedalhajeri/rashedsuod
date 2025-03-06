
import React from "react";
import { Link } from "react-router-dom";
import { Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  loginData: {
    email: string;
    password: string;
  };
  loginError: string | null;
  submitting: boolean;
  storeDomain: string;
  handleLoginDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: (e: React.FormEvent) => void;
  setCheckoutMode: (mode: "guest" | "login") => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loginData,
  loginError,
  submitting,
  storeDomain,
  handleLoginDataChange,
  handleLogin,
  setCheckoutMode,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {loginError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {loginError}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            value={loginData.email}
            onChange={handleLoginDataChange}
            className="pr-10"
            required
            placeholder="your@email.com"
          />
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">كلمة المرور</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={loginData.password}
            onChange={handleLoginDataChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-4">
        <Button 
          type="submit" 
          className="w-full"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري تسجيل الدخول...
            </>
          ) : (
            "تسجيل الدخول"
          )}
        </Button>
        
        <div className="text-center text-sm">
          <Link 
            to={`/store/${storeDomain}/forgot-password`} 
            className="text-primary hover:underline"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>
        
        <div className="text-center text-sm">
          ليس لديك حساب؟{" "}
          <Link 
            to={`/store/${storeDomain}/register`} 
            className="text-primary hover:underline"
          >
            إنشاء حساب جديد
          </Link>
        </div>
        
        <div className="text-center mt-2">
          <button
            type="button"
            onClick={() => setCheckoutMode("guest")}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            متابعة كزائر
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
