import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/hooks/use-store";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, ShoppingBag, PackageCheck, Users, CreditCard, Settings as SettingsIcon, Percent } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import StorePreviewButton from "@/features/dashboard/components/StorePreviewButton";

const Home = () => {
  const { storeData, isLoading, error } = useStore();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
          <p className="text-gray-500">نظرة عامة على أداء متجرك</p>
        </div>
        
        {storeData && (
          <StorePreviewButton storeId={storeData?.id} storeDomain={storeData?.domain_name} />
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <ShoppingBag className="mr-2 h-4 w-4 text-gray-500 inline-block align-middle" />
              إجمالي المبيعات
            </CardTitle>
            <Link to="/dashboard/products">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M4 4h16c1.33 0 2.639.52 3.604 1.451C21.523 6.393 22 7.683 22 9c0 1.316-.477 2.607-1.396 3.549C19.361 13.48 18.05 14 16.67 14H5"></path>
                <path d="M4 14h.01"></path>
                <path d="M20 14h.01"></path>
                <path d="M4 20h.01"></path>
                <path d="M20 20h.01"></path>
                <path d="M4 8h.01"></path>
                <path d="M20 8h.01"></path>
              </svg>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">452,318.89 ر.س</div>
            <p className="text-sm text-muted-foreground">
              +20.1% من الشهر الماضي
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <PackageCheck className="mr-2 h-4 w-4 text-gray-500 inline-block align-middle" />
              الطلبات الجديدة
            </CardTitle>
            <Link to="/dashboard/orders">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M4 4h16c1.33 0 2.639.52 3.604 1.451C21.523 6.393 22 7.683 22 9c0 1.316-.477 2.607-1.396 3.549C19.361 13.48 18.05 14 16.67 14H5"></path>
                <path d="M4 14h.01"></path>
                <path d="M20 14h.01"></path>
                <path d="M4 20h.01"></path>
                <path d="M20 20h.01"></path>
                <path d="M4 8h.01"></path>
                <path d="M20 8h.01"></path>
              </svg>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72</div>
            <p className="text-sm text-muted-foreground">
              +5% من الشهر الماضي
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Users className="mr-2 h-4 w-4 text-gray-500 inline-block align-middle" />
              زوار الموقع
            </CardTitle>
            <Link to="/dashboard/customers">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M4 4h16c1.33 0 2.639.52 3.604 1.451C21.523 6.393 22 7.683 22 9c0 1.316-.477 2.607-1.396 3.549C19.361 13.48 18.05 14 16.67 14H5"></path>
                <path d="M4 14h.01"></path>
                <path d="M20 14h.01"></path>
                <path d="M4 20h.01"></path>
                <path d="M20 20h.01"></path>
                <path d="M4 8h.01"></path>
                <path d="M20 8h.01"></path>
              </svg>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,437</div>
            <p className="text-sm text-muted-foreground">
              +10% من الشهر الماضي
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Separator className="my-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <CreditCard className="mr-2 h-4 w-4 text-gray-500 inline-block align-middle" />
              الأرباح
            </CardTitle>
            <Link to="/dashboard/payments">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M4 4h16c1.33 0 2.639.52 3.604 1.451C21.523 6.393 22 7.683 22 9c0 1.316-.477 2.607-1.396 3.549C19.361 13.48 18.05 14 16.67 14H5"></path>
                <path d="M4 14h.01"></path>
                <path d="M20 14h.01"></path>
                <path d="M4 20h.01"></path>
                <path d="M20 20h.01"></path>
                <path d="M4 8h.01"></path>
                <path d="M20 8h.01"></path>
              </svg>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">57,000 ر.س</div>
            <p className="text-sm text-muted-foreground">
              +13% من الشهر الماضي
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Percent className="mr-2 h-4 w-4 text-gray-500 inline-block align-middle" />
              الكوبونات المستخدمة
            </CardTitle>
            <Link to="/dashboard/coupons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M4 4h16c1.33 0 2.639.52 3.604 1.451C21.523 6.393 22 7.683 22 9c0 1.316-.477 2.607-1.396 3.549C19.361 13.48 18.05 14 16.67 14H5"></path>
                <path d="M4 14h.01"></path>
                <path d="M20 14h.01"></path>
                <path d="M4 20h.01"></path>
                <path d="M20 20h.01"></path>
                <path d="M4 8h.01"></path>
                <path d="M20 8h.01"></path>
              </svg>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-sm text-muted-foreground">
              +6% من الشهر الماضي
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <SettingsIcon className="mr-2 h-4 w-4 text-gray-500 inline-block align-middle" />
              إعدادات المتجر
            </CardTitle>
            <Link to="/dashboard/settings">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M4 4h16c1.33 0 2.639.52 3.604 1.451C21.523 6.393 22 7.683 22 9c0 1.316-.477 2.607-1.396 3.549C19.361 13.48 18.05 14 16.67 14H5"></path>
                <path d="M4 14h.01"></path>
                <path d="M20 14h.01"></path>
                <path d="M4 20h.01"></path>
                <path d="M20 20h.01"></path>
                <path d="M4 8h.01"></path>
                <path d="M20 8h.01"></path>
              </svg>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">تعديل</div>
            <p className="text-sm text-muted-foreground">
              تعديل إعدادات المتجر
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Separator className="my-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader>
            <CardTitle>إدارة المنتجات</CardTitle>
            <CardDescription>إضافة وتعديل وحذف المنتجات في متجرك</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard/products">
              <Button className="w-full">
                <ShoppingBag className="mr-2 h-4 w-4" />
                الذهاب إلى المنتجات
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader>
            <CardTitle>إدارة الفئات</CardTitle>
            <CardDescription>تصنيف المنتجات لتسهيل عملية التسوق</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard/categories">
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                الذهاب إلى الفئات
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
