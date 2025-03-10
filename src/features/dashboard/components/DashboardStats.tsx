
import React from "react";
import { ShoppingBag, Package, Users, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface DashboardStatsProps {
  products: number;
  orders: number;
  customers: number;
  revenue: number;
  formatCurrency: (value: number) => string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  products,
  orders,
  customers,
  revenue,
  formatCurrency
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-gray-500">المنتجات</h3>
            <p className="text-2xl font-bold mt-1">{products}</p>
            <div className="flex items-center text-xs mt-1 text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>12% أعلى</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <Package size={20} />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-gray-500">الطلبات</h3>
            <p className="text-2xl font-bold mt-1">{orders}</p>
            <div className="flex items-center text-xs mt-1 text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>8% أعلى</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
            <ShoppingBag size={20} />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-gray-500">العملاء</h3>
            <p className="text-2xl font-bold mt-1">{customers}</p>
            <div className="flex items-center text-xs mt-1 text-red-600">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              <span>3% أقل</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
            <Users size={20} />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-gray-500">الإيرادات</h3>
            <p className="text-2xl font-bold mt-1">{formatCurrency(revenue)}</p>
            <div className="flex items-center text-xs mt-1 text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>15% أعلى</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
            <DollarSign size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
