
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Tags, ShoppingBag, Settings, Plus, Gauge, BarChart3 } from "lucide-react";
import { useStoreData } from "@/hooks/use-store-data";
import ProductFormDialog from "@/components/product/ProductFormDialog";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const QuickActionButtons: React.FC = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const { data: storeData } = useStoreData();

  const handleAddProductSuccess = () => {
    // Could add a toast notification here
    setIsAddProductOpen(false);
  };

  const actions = [
    {
      icon: <Package className="h-5 w-5" />,
      label: "إضافة منتج",
      onClick: () => setIsAddProductOpen(true),
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: <Tags className="h-5 w-5" />,
      label: "التصنيفات",
      path: "/dashboard/categories",
      color: "bg-amber-50 text-amber-600"
    },
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      label: "الطلبات",
      path: "/dashboard/orders",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "الإعدادات",
      path: "/dashboard/settings",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "التقارير",
      path: "/dashboard/reports",
      color: "bg-rose-50 text-rose-600"
    },
    {
      icon: <Gauge className="h-5 w-5" />,
      label: "الأداء",
      path: "/dashboard/performance",
      color: "bg-cyan-50 text-cyan-600"
    }
  ];

  return (
    <>
      <div className="mt-6 mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="bg-primary-100 text-primary-600 p-1 rounded">
            <Plus size={18} />
          </span>
          إجراءات سريعة
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {actions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="border hover:border-primary-300 transition-all duration-300 h-full">
                <CardContent className="p-0">
                  {action.path ? (
                    <Link 
                      to={action.path}
                      className="flex flex-col items-center text-center p-4 h-full"
                    >
                      <div className={`rounded-full p-3 mb-3 ${action.color}`}>
                        {action.icon}
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                    </Link>
                  ) : (
                    <button 
                      onClick={action.onClick}
                      className="flex flex-col items-center text-center p-4 w-full h-full"
                    >
                      <div className={`rounded-full p-3 mb-3 ${action.color}`}>
                        {action.icon}
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                    </button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      <ProductFormDialog
        isOpen={isAddProductOpen}
        onOpenChange={setIsAddProductOpen}
        storeId={storeData?.id}
        onAddSuccess={handleAddProductSuccess}
      />
    </>
  );
};

export default QuickActionButtons;
