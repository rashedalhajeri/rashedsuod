
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ConditionalSections from "@/components/product/form/ConditionalSections";
import CategorySelect from "@/components/product/form/CategorySelect";
import InventoryTrackingSection from "@/components/product/form/InventoryTrackingSection";
import ProductOptionsSection from "@/components/product/form/ProductOptionsSection";
import AdditionalOptionsSection from "@/components/product/form/AdditionalOptionsSection";

interface ProductAdvancedInfoProps {
  category_id: string | null;
  track_inventory: boolean;
  stock_quantity: number;
  has_colors: boolean;
  has_sizes: boolean;
  require_customer_name: boolean;
  require_customer_image: boolean;
  available_colors: string[] | null;
  available_sizes: string[] | null;
  categories: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleCategoryChange: (categoryId: string) => void;
  handleColorsChange: (colors: string[]) => void;
  handleSizesChange: (sizes: string[]) => void;
  formData: any;
}

const ProductAdvancedInfo: React.FC<ProductAdvancedInfoProps> = ({
  category_id,
  track_inventory,
  stock_quantity,
  has_colors,
  has_sizes,
  require_customer_name,
  require_customer_image,
  available_colors,
  available_sizes,
  categories,
  handleChange,
  handleSwitchChange,
  handleCategoryChange,
  handleColorsChange,
  handleSizesChange,
  formData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>معلومات متقدمة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategorySelect
            categoryId={category_id}
            categories={categories}
            onCategoryChange={handleCategoryChange}
          />
          
          <InventoryTrackingSection
            trackInventory={track_inventory}
            stockQuantity={stock_quantity}
            handleChange={handleChange}
            handleSwitchChange={handleSwitchChange}
          />
        </div>
        
        <Separator />
        
        <ProductOptionsSection
          hasColors={has_colors}
          hasSizes={has_sizes}
          handleSwitchChange={handleSwitchChange}
        />
        
        {(has_colors || has_sizes) && (
          <ConditionalSections 
            formData={formData}
            handleColorsChange={handleColorsChange}
            handleSizesChange={handleSizesChange}
          />
        )}
        
        <Separator />
        
        <AdditionalOptionsSection
          requireCustomerName={require_customer_name}
          requireCustomerImage={require_customer_image}
          handleSwitchChange={handleSwitchChange}
        />
      </CardContent>
    </Card>
  );
};

export default ProductAdvancedInfo;
