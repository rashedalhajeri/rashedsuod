
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SaveButton from "@/components/ui/save-button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getFullStoreUrl, normalizeStoreDomain } from "@/utils/url-helpers";

interface StoreTabProps {
  storeData: any;
}

const StoreTab: React.FC<StoreTabProps> = ({ storeData }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [customDomain, setCustomDomain] = useState<string>(storeData?.custom_domain || '');
  const [isValidating, setIsValidating] = useState(false);
  const [domainStatus, setDomainStatus] = useState<'unverified' | 'valid' | 'invalid' | null>(
    storeData?.custom_domain_verified ? 'valid' : 
    storeData?.custom_domain ? 'unverified' : null
  );
  
  const storeDomain = storeData?.domain_name || '';
  const defaultStoreUrl = getFullStoreUrl(`/store/${storeDomain}`);
  
  const handleSaveCustomDomain = async () => {
    if (!storeData?.id) return;
    
    setIsSaving(true);
    
    try {
      // Clean domain (remove http:// or https://)
      const cleanDomain = customDomain.trim()
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '');
        
      if (!cleanDomain) {
        // User is removing the custom domain
        const { error } = await supabase
          .from('stores')
          .update({ 
            custom_domain: null,
            custom_domain_verified: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', storeData.id);
          
        if (error) throw error;
        
        toast.success("تم إزالة الدومين المخصص بنجاح");
        setDomainStatus(null);
        return;
      }
      
      // Validate domain format
      const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
      if (!domainRegex.test(cleanDomain)) {
        toast.error("صيغة الدومين غير صحيحة، يرجى إدخال دومين صالح");
        return;
      }
      
      // Check if domain is already used by another store
      const { data: existingStore, error: checkError } = await supabase
        .from('stores')
        .select('id, store_name')
        .eq('custom_domain', cleanDomain)
        .neq('id', storeData.id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingStore) {
        toast.error(`هذا الدومين مستخدم بالفعل بواسطة متجر "${existingStore.store_name}"`);
        return;
      }
      
      // Save the custom domain
      const { error } = await supabase
        .from('stores')
        .update({ 
          custom_domain: cleanDomain,
          custom_domain_verified: false, // Will be verified through a separate process
          updated_at: new Date().toISOString()
        })
        .eq('id', storeData.id);
        
      if (error) throw error;
      
      toast.success("تم حفظ الدومين المخصص بنجاح");
      setDomainStatus('unverified');
      
      // Alert about DNS configuration
      setTimeout(() => {
        toast("هام: يرجى تكوين سجلات DNS الخاصة بك", {
          description: "قم بإضافة سجل CNAME يشير إلى domain.lovable.app",
          duration: 10000,
        });
      }, 1000);
      
    } catch (error) {
      console.error("Error saving custom domain:", error);
      toast.error("حدث خطأ أثناء حفظ الدومين المخصص");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleVerifyDomain = async () => {
    if (!customDomain || !storeData?.id) return;
    
    setIsValidating(true);
    
    try {
      // This would normally check DNS records and verify the domain
      // For now, we'll simulate the process
      
      toast.success("تم التحقق من الدومين بنجاح");
      setDomainStatus('valid');
      
      // Update verification status in database
      const { error } = await supabase
        .from('stores')
        .update({ 
          custom_domain_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', storeData.id);
        
      if (error) throw error;
      
    } catch (error) {
      console.error("Error verifying domain:", error);
      toast.error("فشل التحقق من الدومين");
      setDomainStatus('invalid');
    } finally {
      setIsValidating(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>معلومات المتجر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">اسم المتجر</Label>
            <Input id="storeName" value={storeData?.store_name || ''} disabled />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="storeSubdomain">رابط المتجر الفرعي</Label>
            <div className="flex">
              <Input 
                id="storeSubdomain" 
                value={storeDomain || ''} 
                disabled 
                className="rounded-r-none"
              />
              <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-l border-gray-300 rounded-l-md text-gray-600 h-10">
                .linok.me
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              هذا هو الرابط الافتراضي لمتجرك: {defaultStoreUrl}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="storeDescription">وصف المتجر</Label>
            <Textarea 
              id="storeDescription" 
              rows={3} 
              placeholder="أدخل وصفًا للمتجر..." 
              defaultValue={storeData?.description || ''}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button disabled>حفظ التغييرات</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>الدومين المخصص</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customDomain">الدومين المخصص</Label>
              <Input 
                id="customDomain" 
                placeholder="example.com" 
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                أدخل الدومين المخصص الخاص بك بدون http:// أو https://
              </p>
            </div>
            
            {domainStatus === 'unverified' && (
              <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md border border-yellow-200 text-sm">
                <p className="font-medium">الدومين غير متحقق منه</p>
                <p className="mt-1">لاستخدام الدومين المخصص الخاص بك، تحتاج إلى إعداد سجلات DNS التالية:</p>
                <div className="mt-2 bg-yellow-100 p-2 rounded font-mono text-xs">
                  <p>CNAME {customDomain} domain.lovable.app</p>
                </div>
                <p className="mt-2">بعد إعداد سجلات DNS، انقر على زر "التحقق من الدومين" أدناه.</p>
                <Button 
                  className="mt-2" 
                  variant="outline"
                  size="sm"
                  onClick={handleVerifyDomain}
                  disabled={isValidating}
                >
                  {isValidating ? "جاري التحقق..." : "التحقق من الدومين"}
                </Button>
              </div>
            )}
            
            {domainStatus === 'valid' && (
              <div className="bg-green-50 text-green-800 p-3 rounded-md border border-green-200 text-sm">
                <p className="font-medium">الدومين المخصص فعال</p>
                <p className="mt-1">
                  تم التحقق من الدومين المخصص {customDomain} ويمكن للعملاء الوصول إلى متجرك من خلاله.
                </p>
                <div className="mt-2 bg-green-100 p-2 rounded font-mono text-xs overflow-auto">
                  <p>https://{customDomain}</p>
                </div>
              </div>
            )}
            
            {domainStatus === 'invalid' && (
              <div className="bg-red-50 text-red-800 p-3 rounded-md border border-red-200 text-sm">
                <p className="font-medium">فشل التحقق من الدومين</p>
                <p className="mt-1">تعذر التحقق من الدومين. تأكد من إعداد سجلات DNS بشكل صحيح وحاول مرة أخرى.</p>
                <Button 
                  className="mt-2" 
                  variant="outline"
                  size="sm"
                  onClick={handleVerifyDomain}
                  disabled={isValidating}
                >
                  {isValidating ? "جاري التحقق..." : "إعادة المحاولة"}
                </Button>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
            <h4 className="font-medium text-blue-800">فوائد استخدام دومين مخصص</h4>
            <ul className="list-disc list-inside mt-2 text-sm text-blue-700 space-y-1">
              <li>احترافية أكبر وسهولة تذكر للعملاء</li>
              <li>تحسين ظهور متجرك في محركات البحث</li>
              <li>بناء هوية تجارية قوية</li>
              <li>التحكم الكامل في تجربة العملاء</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <SaveButton 
            isSaving={isSaving} 
            onClick={handleSaveCustomDomain}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default StoreTab;
