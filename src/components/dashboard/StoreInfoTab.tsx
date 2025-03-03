
import React from "react";
import { ShoppingBag, BarChart } from "lucide-react";

interface StoreData {
  store_name?: string;
  domain_name?: string;
  country?: string;
  currency?: string;
}

interface StoreInfoTabProps {
  store: StoreData | null;
  stats: {
    productCount: number;
    orderCount: number;
    customerCount: number;
  };
}

const StoreInfoTab: React.FC<StoreInfoTabProps> = ({ store, stats }) => {
  if (!store) return null;
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-8 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-5 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <ShoppingBag className="inline-block ml-2 h-5 w-5 text-primary-500" />
            معلومات المتجر
          </h2>
          <div className="space-y-3">
            <p className="flex justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="font-medium text-gray-600">اسم المتجر:</span> 
              <span className="text-gray-800">{store.store_name}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="font-medium text-gray-600">رابط المتجر:</span> 
              <span className="text-gray-800">{store.domain_name}.linok.me</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="font-medium text-gray-600">الدولة:</span> 
              <span className="text-gray-800">{store.country}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium text-gray-600">العملة:</span> 
              <span className="text-gray-800">{store.currency}</span>
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-5 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <BarChart className="inline-block ml-2 h-5 w-5 text-primary-500" />
            الإحصائيات
          </h2>
          <div className="space-y-3">
            <p className="flex justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="font-medium text-gray-600">عدد المنتجات:</span> 
              <span className="text-gray-800">{stats.productCount}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-gray-100 pb-2">
              <span className="font-medium text-gray-600">عدد الطلبات:</span> 
              <span className="text-gray-800">{stats.orderCount}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium text-gray-600">عدد العملاء:</span> 
              <span className="text-gray-800">{stats.customerCount}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreInfoTab;
