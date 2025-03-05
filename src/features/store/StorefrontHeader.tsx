
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, User, Home, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import useStoreData from '@/hooks/use-store-data';

interface StorefrontHeaderProps {
  cartItemsCount?: number;
}

const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({ cartItemsCount = 0 }) => {
  const navigate = useNavigate();
  const { data: storeData } = useStoreData();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to search results
    navigate(`/store-preview/${storeData?.domain_name}/search?q=${searchQuery}`);
  };

  const menuItems = [
    { title: 'الرئيسية', icon: <Home className="h-4 w-4 ml-2" />, path: `/store-preview/${storeData?.domain_name}` },
    { title: 'المنتجات', icon: null, path: `/store-preview/${storeData?.domain_name}/products` },
    { title: 'حسابي', icon: <User className="h-4 w-4 ml-2" />, path: `/store-preview/${storeData?.domain_name}/account` },
    { title: 'سلة التسوق', icon: <ShoppingCart className="h-4 w-4 ml-2" />, path: `/store-preview/${storeData?.domain_name}/cart` },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            {storeData?.logo_url ? (
              <img 
                src={storeData.logo_url} 
                alt={storeData.store_name} 
                className="h-10 w-auto object-contain" 
              />
            ) : (
              <h1 className="text-xl font-bold">{storeData?.store_name || 'متجري'}</h1>
            )}
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 rtl:space-x-reverse">
            {menuItems.map((item, index) => (
              <Button 
                key={index} 
                variant="ghost" 
                className="text-gray-700 hover:text-primary flex items-center"
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                {item.title}
                {item.title === 'سلة التسوق' && cartItemsCount > 0 && (
                  <Badge variant="destructive" className="mr-2 h-5 w-5 p-0 flex items-center justify-center">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button 
              onClick={() => navigate(`/store-preview/${storeData?.domain_name}/cart`)}
              variant="ghost" 
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="py-6 space-y-6">
                  <h2 className="text-xl font-bold border-b pb-2">{storeData?.store_name || 'متجري'}</h2>
                  <nav className="flex flex-col space-y-4">
                    {menuItems.map((item, index) => (
                      <Button 
                        key={index} 
                        variant="ghost" 
                        className="justify-start"
                        onClick={() => navigate(item.path)}
                      >
                        {item.icon}
                        {item.title}
                      </Button>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="py-3">
          <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 rtl:space-x-reverse">
            <Input
              type="search"
              placeholder="ابحث عن منتجات..."
              className="flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default StorefrontHeader;
