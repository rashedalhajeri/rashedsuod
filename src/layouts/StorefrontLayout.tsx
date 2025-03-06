
import React, { ReactNode, useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Menu, X, Store as StoreIcon, Heart, Home, Package, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useStoreDetection } from "@/hooks/use-store-detection";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

interface StorefrontLayoutProps {
  children: ReactNode;
}

const StorefrontLayout: React.FC<StorefrontLayoutProps> = ({ children }) => {
  const { storeId: storeIdFromPath } = useParams<{ storeId?: string }>();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Use our hook to detect the store automatically
  const { store: storeData, loading, error } = useStoreDetection();

  // Generate store URL for navigation
  const baseUrl = storeData ? `/store/${storeData.id}` : `/store/${storeIdFromPath}`;

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menu items with proper URLs
  const menuItems = [
    {
      label: "الرئيسية",
      href: baseUrl,
      icon: <Home className="h-4 w-4 ml-2" />
    },
    {
      label: "المنتجات",
      href: `${baseUrl}/products`,
      icon: <Package className="h-4 w-4 ml-2" />
    },
    {
      label: "تواصل معنا",
      href: `${baseUrl}/contact`,
      icon: <Phone className="h-4 w-4 ml-2" />
    }
  ];

  // Determine active menu item
  const getIsActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implementation for search functionality would go here
      console.log("Searching for:", searchQuery);
      setShowSearchBar(false);
    }
  };

  // If there's an error or still loading, show a simplified header
  if (error || loading) {
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
        <main className="flex-1">
          {loading ? (
            <LoadingState message="جاري تحميل بيانات المتجر..." />
          ) : (
            <ErrorState 
              title="خطأ في تحميل المتجر"
              message={error || "لم نتمكن من العثور على المتجر"}
              onRetry={() => window.location.reload()}
            />
          )}
          {children}
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
      <motion.header 
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          isScrolled 
            ? "bg-white/95 backdrop-blur-sm shadow-sm" 
            : "bg-white"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Store Name */}
            <Link to={baseUrl} className="flex items-center gap-2 group">
              {storeData?.logo_url ? (
                <motion.div 
                  className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 group-hover:shadow-md transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={storeData.logo_url} 
                    alt={storeData.store_name || "شعار المتجر"} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <StoreIcon className="h-5 w-5 text-primary-600" />
                </motion.div>
              )}
              <motion.span 
                className="font-bold text-xl text-gray-900 group-hover:text-primary-600 transition-colors"
                whileHover={{ y: -1 }}
              >
                {storeData?.store_name || "متجر"}
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
              {menuItems.map((item, index) => (
                <Link 
                  key={index}
                  to={item.href}
                  className={cn(
                    "relative font-medium flex items-center transition-colors py-1",
                    getIsActive(item.href)
                      ? "text-primary-600"
                      : "text-gray-600 hover:text-primary-600"
                  )}
                >
                  {item.icon}
                  {item.label}
                  {getIsActive(item.href) && (
                    <motion.div 
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                      layoutId="activeIndicator"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 space-x-reverse">
              {/* Search Button */}
              <AnimatePresence>
                {showSearchBar ? (
                  <motion.form 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="flex items-center absolute left-4 right-4 md:left-auto md:right-1/4 md:w-1/2"
                    onSubmit={handleSearch}
                  >
                    <Input
                      type="search"
                      placeholder="ابحث عن منتج..."
                      className="flex-1"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost"
                      className="ml-2"
                      onClick={() => setShowSearchBar(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.form>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowSearchBar(true)}
                    className="hidden md:flex"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                )}
              </AnimatePresence>

              {/* Favorites */}
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Heart className="h-5 w-5" />
              </Button>

              {/* Cart Link */}
              <Link to={`${baseUrl}/cart`} className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-primary-500">
                    2
                  </Badge>
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
                  <SheetContent side="right" className="w-[280px] p-0">
                    <div className="flex flex-col h-full">
                      <div className="p-4 border-b">
                        <div className="flex items-center gap-3 mb-6">
                          {storeData?.logo_url ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100">
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
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                              <StoreIcon className="h-6 w-6 text-primary-600" />
                            </div>
                          )}
                          <span className="font-bold text-xl">
                            {storeData?.store_name || "متجر"}
                          </span>
                        </div>
                        
                        <form onSubmit={handleSearch} className="relative mb-2">
                          <Input
                            type="search"
                            placeholder="ابحث عن منتج..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pr-10"
                          />
                          <Search className="absolute top-2.5 right-3 h-4 w-4 text-gray-500" />
                        </form>
                      </div>
                      
                      <nav className="flex-1 overflow-auto py-4">
                        <div className="px-4 mb-2 text-sm font-medium text-gray-500">القائمة الرئيسية</div>
                        {menuItems.map((item, index) => (
                          <Link 
                            key={index}
                            to={item.href}
                            className={cn(
                              "flex items-center px-4 py-3 text-base",
                              getIsActive(item.href)
                                ? "bg-primary-50 text-primary-700 font-medium"
                                : "text-gray-600 hover:bg-gray-50"
                            )}
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        ))}
                      </nav>
                      
                      <div className="border-t p-4">
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" asChild className="w-full">
                            <Link to={`${baseUrl}/favorites`}>
                              <Heart className="h-4 w-4 ml-2" />
                              المفضلة
                            </Link>
                          </Button>
                          <Button asChild className="w-full">
                            <Link to={`${baseUrl}/cart`}>
                              <ShoppingCart className="h-4 w-4 ml-2" />
                              السلة
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 animate-fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                {storeData?.logo_url ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
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
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <StoreIcon className="h-5 w-5 text-primary-600" />
                  </div>
                )}
                <span className="font-bold text-lg">
                  {storeData?.store_name || "متجر"}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                نوفر لكم أفضل المنتجات بأسعار مناسبة وجودة عالية، مع خدمة عملاء متميزة.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">روابط سريعة</h3>
              <ul className="space-y-2">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link 
                      to={item.href}
                      className="text-gray-600 hover:text-primary-600 transition-colors flex items-center"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">تواصل معنا</h3>
              <div className="space-y-2 text-gray-500">
                {storeData?.phone && (
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 ml-2" />
                    {storeData.phone}
                  </p>
                )}
                {storeData?.email && (
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    {storeData.email}
                  </p>
                )}
              </div>
              
              <div className="mt-4 flex space-x-4 space-x-reverse">
                <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-6 text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} {storeData?.store_name || "المتجر"} | جميع الحقوق محفوظة
            </p>
            <p className="text-gray-400 text-xs mt-2">
              تم تطويره بواسطة <a href="https://linok.me" className="text-primary-600 hover:underline">لينوك</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
