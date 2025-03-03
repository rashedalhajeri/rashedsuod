
import React from "react";
import { Package, Settings, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import SalesOverviewChart from "./SalesOverviewChart";

const mockSalesData = [
  { name: "يناير", amount: 1500 },
  { name: "فبراير", amount: 2500 },
  { name: "مارس", amount: 2000 },
  { name: "أبريل", amount: 3000 },
  { name: "مايو", amount: 2800 },
  { name: "يونيو", amount: 3200 },
  { name: "يوليو", amount: 3800 },
];

const OverviewTab: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <SalesOverviewChart 
        data={mockSalesData} 
        total={19800} 
        growth={12} 
        currencySymbol="ر.س" 
      />

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow hover:border-primary-200 border border-gray-100 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">المنتجات</h2>
                <Package className="h-6 w-6 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-gray-600 mb-4">إدارة منتجات متجرك</p>
              <Button variant="ghost" className="text-primary-600 font-medium hover:underline bg-transparent group-hover:bg-primary-50 flex items-center" asChild>
                <Link to="/dashboard/products">
                  إدارة المنتجات
                  <ArrowRight className="mr-1 h-4 w-4 inline-block" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow hover:border-primary-200 border border-gray-100 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">الإعدادات</h2>
                <Settings className="h-6 w-6 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-gray-600 mb-4">تخصيص إعدادات متجرك</p>
              <Button variant="ghost" className="text-primary-600 font-medium hover:underline bg-transparent group-hover:bg-primary-50 flex items-center" asChild>
                <Link to="/dashboard/system-settings">
                  تعديل الإعدادات
                  <ArrowRight className="mr-1 h-4 w-4 inline-block" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow hover:border-primary-200 border border-gray-100 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">المتجر</h2>
                <Home className="h-6 w-6 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-gray-600 mb-4">زيارة المتجر الخاص بك</p>
              <Button 
                className="text-primary-600 font-medium hover:underline bg-transparent group-hover:bg-primary-50 flex items-center" 
                variant="ghost" 
                onClick={() => window.open(`https://${window.location.hostname.includes('linok.me') ? window.location.hostname : 'yourdomain.linok.me'}`, '_blank')}
              >
                عرض المتجر
                <ArrowRight className="mr-1 h-4 w-4 inline-block" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OverviewTab;
