
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingBag, Users, DollarSign } from "lucide-react";

interface StatCardsProps {
  stats: {
    productCount: number;
    orderCount: number;
    customerCount: number;
    revenue: number;
  };
  formatCurrency: (amount: number) => string;
}

const StatCards: React.FC<StatCardsProps> = ({ stats, formatCurrency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="hover:shadow-md transition-all duration-300 hover:border-primary-200 border border-gray-100 bg-white overflow-hidden group">
        <CardContent className="pt-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">المنتجات</p>
              <h3 className="text-2xl font-bold">{stats.productCount}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform duration-300">
              <Package className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-all duration-300 hover:border-orange-200 border border-gray-100 bg-white overflow-hidden group">
        <CardContent className="pt-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">الطلبات</p>
              <h3 className="text-2xl font-bold">{stats.orderCount}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-all duration-300 hover:border-green-200 border border-gray-100 bg-white overflow-hidden group">
        <CardContent className="pt-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">العملاء</p>
              <h3 className="text-2xl font-bold">{stats.customerCount}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-all duration-300 hover:border-blue-200 border border-gray-100 bg-white overflow-hidden group">
        <CardContent className="pt-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">الإيرادات</p>
              <h3 className="text-2xl font-bold">{formatCurrency(stats.revenue)}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
