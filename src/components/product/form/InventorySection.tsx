import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import { Archive, AlertTriangle } from "lucide-react";
interface InventorySectionProps {
  trackInventory: boolean;
  stockQuantity: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}
const InventorySection: React.FC<InventorySectionProps> = ({
  trackInventory,
  stockQuantity,
  handleInputChange,
  handleSwitchChange
}) => {
  const isMobile = useIsMobile();
  return <div className="space-y-6">
      <div className={`flex ${isMobile ? 'flex-col' : 'items-center justify-between'} gap-3`}>
        <div className="flex flex-col">
          <Label htmlFor="track_inventory" className="mb-1 font-medium">تتبع المخزون</Label>
          <span className="text-sm text-gray-500">
            {trackInventory ? 'كمية محدودة - سيتم تتبع المخزون المتاح' : 'كمية غير محدودة - لن يتم عرض "نفذت الكمية" أبداً'}
          </span>
        </div>
        <Switch id="track_inventory" checked={trackInventory} onCheckedChange={checked => handleSwitchChange('track_inventory', checked)} className={isMobile ? 'self-start mt-1' : ''} />
      </div>
      
      {trackInventory && <motion.div initial={{
      opacity: 0,
      height: 0
    }} animate={{
      opacity: 1,
      height: 'auto'
    }} exit={{
      opacity: 0,
      height: 0
    }} transition={{
      duration: 0.3
    }} className="grid gap-3 border border-gray-100 rounded-xl p-4 bg-gray-50">
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-gray-500" />
            <Label htmlFor="stock_quantity" className="font-medium">الكمية المتوفرة في المخزون</Label>
          </div>
          
          <Input id="stock_quantity" name="stock_quantity" type="number" placeholder="0" value={stockQuantity} onChange={handleInputChange} className="bg-white shadow-sm" />
          
          {stockQuantity <= 0 && <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">تنبيه: المنتج غير متوفر حالياً</span>
            </div>}
          
          {stockQuantity > 0 && stockQuantity <= 5 && <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">تنبيه: كمية المنتج منخفضة</span>
            </div>}

          {stockQuantity > 5 && <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-lg text-green-600">
              <Badge variant="outline" className="bg-white">
                {stockQuantity}
              </Badge>
              <span className="text-sm">وحدة متوفرة في المخزون</span>
            </div>}
        </motion.div>}
      
      {!trackInventory}
    </div>;
};
export default InventorySection;