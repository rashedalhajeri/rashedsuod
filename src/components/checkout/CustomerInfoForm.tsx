
import React from "react";
import { User, Phone, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerInfoFormProps {
  formData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
  isAuthenticated: boolean;
  userData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogout: () => void;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  formData,
  isAuthenticated,
  userData,
  handleChange,
  handleLogout,
}) => {
  if (isAuthenticated) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">تم تسجيل الدخول</p>
              <p className="text-sm text-gray-600">{userData?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-500"
          >
            تسجيل الخروج
          </Button>
        </div>
        
        <form id="checkout-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customerName">الاسم الكامل <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="pr-10"
                  required
                  placeholder="محمد أحمد"
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerPhone">رقم الهاتف <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  id="customerPhone"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  className="pr-10"
                  required
                  placeholder="5xxxxxxxx"
                  type="tel"
                />
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="customerEmail">البريد الإلكتروني</Label>
              <div className="relative">
                <Input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  className="pr-10"
                  placeholder="example@example.com"
                  readOnly
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
  
  return (
    <form id="checkout-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="customerName">الاسم الكامل <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Input
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="pr-10"
              required
              placeholder="محمد أحمد"
            />
            <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="customerPhone">رقم الهاتف <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Input
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              className="pr-10"
              required
              placeholder="5xxxxxxxx"
              type="tel"
            />
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="customerEmail">البريد الإلكتروني</Label>
          <div className="relative">
            <Input
              id="customerEmail"
              name="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={handleChange}
              className="pr-10"
              placeholder="example@example.com"
            />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </form>
  );
};

export default CustomerInfoForm;
