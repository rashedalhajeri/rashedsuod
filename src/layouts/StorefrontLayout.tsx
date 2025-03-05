
import React, { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface StorefrontLayoutProps {
  children: ReactNode;
}

const StorefrontLayout: React.FC<StorefrontLayoutProps> = ({ children }) => {
  const { storeId } = useParams<{ storeId: string }>();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Toggle menu open/close
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Menu items
  const menuItems = [
    {
      label: "الرئيسية",
      href: `/store/${storeId}`
    },
    {
      label: "المنتجات",
      href: `/store/${storeId}/products`
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={`/store/${storeId}`} className="font-bold text-xl">متجر</Link>

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
            <Link to={`/store/${storeId}/cart`}>
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
                    <div className="flex items-center justify-between py-4 mb-4 border-b">
                      <span className="font-bold text-lg">القائمة</span>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetTrigger>
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
          &copy; {new Date().getFullYear()} - جميع الحقوق محفوظة
        </div>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
