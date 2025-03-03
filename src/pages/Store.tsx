
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store as StoreIcon, ExternalLink, Palette, Layout, Eye, Smartphone, Monitor, Settings, PencilLine, Save, Check, Image, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Store = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [editMode, setEditMode] = useState(false);
  
  // بيانات نموذجية للمتجر
  const [storeData, setStoreData] = useState({
    name: "متجر الإلكترونيات",
    domain: "electronics",
    description: "متجر متخصص في بيع أحدث المنتجات الإلكترونية والأجهزة الذكية.",
    logo: "/placeholder.svg",
    email: "contact@electronics.com",
    phone: "+966 555 123456",
    country: "السعودية",
    city: "الرياض",
    currency: "SAR",
    theme: "default",
    layout: "grid"
  });

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    // هنا ستكون عملية حفظ التغييرات إلى قاعدة البيانات
    setEditMode(false);
    // إظهار رسالة نجاح (يمكن استخدام toast هنا)
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">المتجر</h1>
            <p className="text-gray-600">إدارة متجرك وتخصيصه</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => window.open(`https://${storeData.domain}.linok.me`, '_blank')}
              className="flex items-center gap-2"
            >
              <Eye size={16} />
              معاينة المتجر
            </Button>
            
            {editMode ? (
              <Button 
                className="bg-primary-600 hover:bg-primary-700 flex items-center gap-2"
                onClick={handleSave}
              >
                <Save size={16} />
                حفظ التغييرات
              </Button>
            ) : (
              <Button 
                className="bg-primary-600 hover:bg-primary-700 flex items-center gap-2"
                onClick={handleEditToggle}
              >
                <PencilLine size={16} />
                تعديل المتجر
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8 bg-gray-100 p-1 border border-gray-200">
            <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <StoreIcon size={16} className="ml-2" />
              عام
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Palette size={16} className="ml-2" />
              المظهر
            </TabsTrigger>
            <TabsTrigger value="domain" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Globe size={16} className="ml-2" />
              النطاق
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card className="border border-gray-100 hover:shadow-md transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <StoreIcon className="inline-block ml-2 h-5 w-5 text-primary-500" />
                      معلومات المتجر
                    </CardTitle>
                    <CardDescription>المعلومات الأساسية لمتجرك</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto rounded-md border border-gray-200 flex items-center justify-center overflow-hidden mb-2">
                          <img src={storeData.logo} alt="شعار المتجر" className="w-full h-full object-cover" />
                        </div>
                        {editMode && (
                          <Button variant="outline" size="sm" className="text-xs">
                            <Image size={12} className="ml-1" />
                            تغيير الشعار
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-3 mt-4">
                        <div>
                          <Label>اسم المتجر</Label>
                          {editMode ? (
                            <Input value={storeData.name} className="mt-1" />
                          ) : (
                            <p className="text-gray-700 mt-1">{storeData.name}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label>وصف المتجر</Label>
                          {editMode ? (
                            <textarea 
                              rows={3}
                              value={storeData.description}
                              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md"
                            />
                          ) : (
                            <p className="text-gray-700 mt-1">{storeData.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card className="border border-gray-100 hover:shadow-md transition-shadow mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="inline-block ml-2 h-5 w-5 text-primary-500" />
                      إعدادات المتجر
                    </CardTitle>
                    <CardDescription>تخصيص إعدادات متجرك</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>البريد الإلكتروني</Label>
                        {editMode ? (
                          <Input value={storeData.email} className="mt-1" />
                        ) : (
                          <p className="text-gray-700 mt-1">{storeData.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label>رقم الهاتف</Label>
                        {editMode ? (
                          <Input value={storeData.phone} className="mt-1" />
                        ) : (
                          <p className="text-gray-700 mt-1">{storeData.phone}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label>الدولة</Label>
                        {editMode ? (
                          <Select defaultValue={storeData.country}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="اختر الدولة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="السعودية">السعودية</SelectItem>
                              <SelectItem value="الإمارات">الإمارات</SelectItem>
                              <SelectItem value="الكويت">الكويت</SelectItem>
                              <SelectItem value="قطر">قطر</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-gray-700 mt-1">{storeData.country}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label>المدينة</Label>
                        {editMode ? (
                          <Input value={storeData.city} className="mt-1" />
                        ) : (
                          <p className="text-gray-700 mt-1">{storeData.city}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label>العملة</Label>
                        {editMode ? (
                          <Select defaultValue={storeData.currency}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="اختر العملة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                              <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
                              <SelectItem value="KWD">دينار كويتي (KWD)</SelectItem>
                              <SelectItem value="QAR">ريال قطري (QAR)</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-gray-700 mt-1">
                            {storeData.currency === "SAR" && "ريال سعودي (SAR)"}
                            {storeData.currency === "AED" && "درهم إماراتي (AED)"}
                            {storeData.currency === "KWD" && "دينار كويتي (KWD)"}
                            {storeData.currency === "QAR" && "ريال قطري (QAR)"}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-gray-100 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Monitor className="inline-block ml-2 h-5 w-5 text-primary-500" />
                      توافق الأجهزة
                    </CardTitle>
                    <CardDescription>متجرك متوافق مع جميع الأجهزة</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-around py-4">
                      <div className="text-center">
                        <div className="h-14 w-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                          <Monitor size={24} />
                        </div>
                        <p className="font-medium">ديسكتوب</p>
                        <div className="flex items-center justify-center mt-1 text-green-600">
                          <Check size={16} className="ml-1" />
                          <span className="text-sm">متوافق</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="h-14 w-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2">
                          <Smartphone size={24} />
                        </div>
                        <p className="font-medium">موبايل</p>
                        <div className="flex items-center justify-center mt-1 text-green-600">
                          <Check size={16} className="ml-1" />
                          <span className="text-sm">متوافق</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="h-14 w-14 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-2">
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="font-medium">تابلت</p>
                        <div className="flex items-center justify-center mt-1 text-green-600">
                          <Check size={16} className="ml-1" />
                          <span className="text-sm">متوافق</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="animate-fade-in">
            <Card className="border border-gray-100 hover:shadow-md transition-shadow mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="inline-block ml-2 h-5 w-5 text-primary-500" />
                  مظهر المتجر
                </CardTitle>
                <CardDescription>تخصيص مظهر متجرك وألوانه وتخطيطاته</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>السمة</Label>
                    {editMode ? (
                      <Select defaultValue={storeData.theme}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="اختر السمة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">السمة الافتراضية</SelectItem>
                          <SelectItem value="dark">السمة الداكنة</SelectItem>
                          <SelectItem value="light">السمة الفاتحة</SelectItem>
                          <SelectItem value="elegant">سمة أنيقة</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-700 mt-1">
                        {storeData.theme === "default" && "السمة الافتراضية"}
                        {storeData.theme === "dark" && "السمة الداكنة"}
                        {storeData.theme === "light" && "السمة الفاتحة"}
                        {storeData.theme === "elegant" && "سمة أنيقة"}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label>تخطيط المنتجات</Label>
                    {editMode ? (
                      <Select defaultValue={storeData.layout}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="اختر التخطيط" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">عرض شبكي</SelectItem>
                          <SelectItem value="list">عرض قائمة</SelectItem>
                          <SelectItem value="compact">عرض مدمج</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-700 mt-1">
                        {storeData.layout === "grid" && "عرض شبكي"}
                        {storeData.layout === "list" && "عرض قائمة"}
                        {storeData.layout === "compact" && "عرض مدمج"}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">معاينة السمات</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`border ${storeData.theme === 'default' ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'} rounded-md overflow-hidden cursor-pointer transition-all hover:shadow-md`}>
                      <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600"></div>
                      <div className="p-3">
                        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                    
                    <div className={`border ${storeData.theme === 'dark' ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'} rounded-md overflow-hidden cursor-pointer transition-all hover:shadow-md`}>
                      <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-900"></div>
                      <div className="p-3 bg-gray-800">
                        <div className="h-4 w-3/4 bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 w-1/2 bg-gray-600 rounded"></div>
                      </div>
                    </div>
                    
                    <div className={`border ${storeData.theme === 'elegant' ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'} rounded-md overflow-hidden cursor-pointer transition-all hover:shadow-md`}>
                      <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                      <div className="p-3">
                        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="domain" className="animate-fade-in">
            <Card className="border border-gray-100 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="inline-block ml-2 h-5 w-5 text-primary-500" />
                  نطاق المتجر
                </CardTitle>
                <CardDescription>إعدادات النطاق الخاص بمتجرك</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label>النطاق الفرعي الحالي</Label>
                    <div className="flex items-center mt-2">
                      <div className="flex-grow">
                        {editMode ? (
                          <div className="flex">
                            <Input value={storeData.domain} className="rounded-l-md rounded-r-none border-l-0" />
                            <div className="bg-gray-100 px-3 py-2 border border-gray-200 text-gray-500 flex items-center rounded-r-md border-r-0">
                              .linok.me
                            </div>
                          </div>
                        ) : (
                          <div className="flex">
                            <div className="bg-gray-50 px-4 py-2 border border-gray-200 text-gray-700 rounded-md">
                              {storeData.domain}.linok.me
                            </div>
                            <Button variant="ghost" size="sm" className="ml-2 text-primary-600" onClick={() => window.open(`https://${storeData.domain}.linok.me`, '_blank')}>
                              <ExternalLink size={16} className="ml-1" />
                              زيارة
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">هذا هو عنوان URL الذي سيستخدمه العملاء للوصول إلى متجرك.</p>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">نطاق مخصص</h3>
                    <p className="text-sm text-gray-500 mb-4">يمكنك ربط نطاق مخصص بمتجرك للحصول على مظهر أكثر احترافية.</p>
                    
                    <Button variant="outline" className="flex items-center gap-2">
                      <Globe size={16} />
                      إضافة نطاق مخصص
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Store;
