
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SaveButton from "@/components/ui/save-button";

interface ProductDetailHeaderProps {
  pageTitle: string;
  isNewProduct: boolean;
  isSaving: boolean;
  onSave: (() => Promise<void>) | (() => void);
  onDelete: (() => Promise<void>) | (() => void);
}

const ProductDetailHeader: React.FC<ProductDetailHeaderProps> = ({
  pageTitle,
  isNewProduct,
  isSaving,
  onSave,
  onDelete
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{pageTitle}</h1>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate("/dashboard/products")}>
          العودة للمنتجات
        </Button>
        <SaveButton isSaving={isSaving} onClick={onSave} />
        {!isNewProduct && (
          <Button variant="destructive" onClick={onDelete}>
            حذف المنتج
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductDetailHeader;
