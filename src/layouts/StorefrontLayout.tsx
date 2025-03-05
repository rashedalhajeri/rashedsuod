
import React, { ReactNode, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, X, Store as StoreIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { getStoreUrl } from "@/utils/url-utils";

interface StorefrontLayoutProps {
  children: ReactNode;
}

const StorefrontLayout: React.FC<StorefrontLayoutProps> = ({ children }) => {
  const { storeId } = useParams<{ storeId: string }>();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [storeData, setStoreData] = useState<{
    store_name: string;
    logo_url: string | null;
    domain_name: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch store data on mount
  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) return;

      try {
        const { data, error } = await supabase
          .from("stores")
          .select("store_name, logo_url, domain_name")
          .eq("id", storeId)
          .single();

        if (error) throw error;
        setStoreData(data);
      } catch (error) {
        console.error("Error fetching store data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId]);

  // Toggle menu open/close
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Generate store URL
  const storeUrl = storeData ? getStoreUrl(storeData) : `/store/${storeId}`;

  // Menu items with proper URLs
  const menuItems = [
    {
      label: "الرئيسية",
      href: storeUrl
    },
    {
      label: "المنتجات",
      href: `${storeUrl}/products`
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          {/* Logo and Store Name */}
          <Link to={storeUrl} className="flex items-center gap-2">
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
              {loading ? "جاري التحميل..." : storeData?.store_name || "متجر"}
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
            <Link to={`${storeUrl}/cart`}>
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
                        {loading ? "جاري التحميل..." : storeData?.store_name || "متجر"}
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
