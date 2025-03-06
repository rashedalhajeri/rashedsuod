import React, { ReactNode, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, X, Store as StoreIcon, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { getStoreUrl, getStoreFromUrl, shouldRedirectToStoreDomain } from "@/utils/url-utils";
import { toast } from "sonner";

interface StorefrontLayoutProps {
  children: ReactNode;
}

const StorefrontLayout: React.FC<StorefrontLayoutProps> = ({ children }) => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [storeData, setStoreData] = useState<{
    id: string;
    store_name: string;
    logo_url: string | null;
    domain_name: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch store data on mount or when retrying
  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) {
        console.error("No storeId provided");
        setError("معرف المتجر غير متوفر");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("StorefrontLayout: Fetching store data for:", storeId);
        
        // Use the utility function to get store data
        const { data, error } = await getStoreFromUrl(storeId, supabase);

        if (error) {
          console.error("Error fetching store data:", error);
          throw new Error(error.message || "حدث خطأ في تحميل بيانات المتجر");
        }
        
        if (!data) {
          console.error("Store not found for ID:", storeId);
          throw new Error("المتجر غير موجود. الرجاء التحقق من الرابط والمحاولة مرة أخرى.");
        }
        
        console.log("Store found:", data);
        setStoreData(data);
        
        // If we've retried and succeeded, show success toast
        if (retryCount > 0) {
          toast.success("تم تحميل بيانات المتجر بنجاح");
        }
      } catch (error: any) {
        console.error("Error fetching store data:", error);
        setError(error.message || "حدث خطأ في تحميل بيانات المتجر");
        
        // If it's the first attempt, try again automatically once
        if (retryCount === 0) {
          console.log("First attempt failed, retrying...");
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 1500);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId, retryCount]);

  // Handle retry action
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Toggle menu open/close
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Generate store URL for navigation - always using subdomain format in production
  const baseUrl = storeData ? `/store/${storeData.id}` : `/store/${storeId}`;

  // Menu items with proper URLs
  const menuItems = [
    {
      label: "الرئيسية",
      href: baseUrl
    },
    {
      label: "المنتجات",
      href: `${baseUrl}/products`
    }
  ];

  // If there's an error, show a simplified header with error message
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 rtl">
        <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <StoreIcon className="h-4 w-4 text-primary" />
              </div>
              <span className="font-bold text-xl text-gray-900">متجر</span>
            </div>
          </div>
        </header>
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="mr-2">خطأ في تحميل المتجر</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <div className="flex flex-col items-center justify-center mt-6">
            <p className="text-gray-600 mb-4">تعذر تحميل المتجر. يرجى التحقق من الرابط أو المحاولة مرة أخرى.</p>
            
            <div className="flex gap-4">
              <Button onClick={handleRetry} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                إعادة المحاولة
              </Button>
              
              <Button variant="outline" onClick={() => navigate("/dashboard")} className="flex items-center gap-2">
                العودة للوحة التحكم
              </Button>
            </div>
          </div>
        </main>
        
        <footer className="bg-white border-t py-6">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} - جميع الحقوق محفوظة
          </div>
        </footer>
      </div>
    );
  }

  // If still loading, show a simplified loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 rtl">
        <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <StoreIcon className="h-4 w-4 text-primary" />
              </div>
              <span className="font-bold text-xl text-gray-900">جاري التحميل...</span>
            </div>
          </div>
        </header>
        
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full inline-block mb-4"></div>
            <p className="text-gray-600">جاري تحميل بيانات المتجر...</p>
          </div>
        </main>
        
        <footer className="bg-white border-t py-6">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} - جميع الحقوق محفوظة
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          {/* Logo and Store Name */}
          <Link to={baseUrl} className="flex items-center gap-2">
            {storeData?.logo_url ? (
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
                <img 
                  src={storeData.logo_url} 
                  alt={storeData.store_name || "شعار المتجر"} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            ) : (
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <StoreIcon className="h-4 w-4 text-primary" />
              </div>
            )}
            <span className="font-bold text-xl text-gray-900">
              {storeData?.store_name || "متجر"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
            {menuItems.map((item, index) => (
              <Link 
                key={index}
                to={item.href}
                className="text-gray-600 hover:text-gray-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link to={`${baseUrl}/cart`}>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                  <div className="flex flex-col h-full">
                    <div className="flex flex-col items-center justify-center py-6 mb-4 border-b">
                      {storeData?.logo_url ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-100 mb-3">
                          <img 
                            src={storeData.logo_url} 
                            alt={storeData.store_name || "شعار المتجر"} 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                          <StoreIcon className="h-8 w-8 text-primary" />
                        </div>
                      )}
                      <span className="font-bold text-lg">
                        {storeData?.store_name || "متجر"}
                      </span>
                    </div>
                    <nav className="flex flex-col space-y-4">
                      {menuItems.map((item, index) => (
                        <Link 
                          key={index}
                          to={item.href}
                          className="text-gray-600 hover:text-gray-900 py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} - {storeData?.store_name || "المتجر"} | جميع الحقوق محفوظة
        </div>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
